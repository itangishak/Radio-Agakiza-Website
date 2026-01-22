const { DateTime } = require('luxon');
const { pool } = require('../config/db');

// Tables used: programs, hosts, program_hosts, program_schedule

async function listPrograms() {
  const [rows] = await pool.execute(
    `SELECT p.id, p.name, p.slug, p.description, p.image_url, p.is_active,
            p.created_by, p.created_at, p.updated_at
     FROM programs p
     ORDER BY p.name ASC`
  );
  return rows;
}

async function getProgramById(id) {
  const [[program]] = await pool.execute(
    `SELECT p.id, p.name, p.slug, p.description, p.image_url, p.is_active,
            p.created_by, p.created_at, p.updated_at
     FROM programs p WHERE p.id = ? LIMIT 1`,
    [id]
  );
  if (!program) return null;

  const [hosts] = await pool.execute(
    `SELECT h.id, h.full_name, h.bio, h.photo_url, ph.is_primary
     FROM program_hosts ph
     JOIN hosts h ON h.id = ph.host_id
     WHERE ph.program_id = ?
     ORDER BY ph.is_primary DESC, h.full_name ASC`,
    [id]
  );

  const [schedule] = await pool.execute(
    `SELECT ps.id, ps.day_of_week, ps.start_time, ps.end_time, ps.timezone, ps.is_active
     FROM program_schedule ps
     WHERE ps.program_id = ?
     ORDER BY ps.day_of_week, ps.start_time`,
    [id]
  );

  return { ...program, hosts, schedule };
}

async function createProgram(data, userId) {
  const { name, slug, description = null, image_url = null, is_active = 1 } = data;
  const [result] = await pool.execute(
    `INSERT INTO programs (name, slug, description, image_url, is_active, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, slug, description, image_url, is_active ? 1 : 0, userId || null]
  );
  return result.insertId;
}

async function updateProgram(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['name','slug','description','image_url','is_active']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'is_active') params.push(data[key] ? 1 : 0); else params.push(data[key]);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  const [res] = await pool.execute(
    `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
  return res.affectedRows > 0;
}

async function deleteProgram(id) {
  const [res] = await pool.execute(`DELETE FROM programs WHERE id = ?`, [id]);
  return res.affectedRows > 0;
}

// Hosts
async function createHost(data) {
  const { full_name, bio = null, photo_url = null } = data;
  const [res] = await pool.execute(
    `INSERT INTO hosts (full_name, bio, photo_url) VALUES (?, ?, ?)`,
    [full_name, bio, photo_url]
  );
  return res.insertId;
}

async function listHosts() {
  const [rows] = await pool.execute(
    `SELECT id, full_name, bio, photo_url, created_at, updated_at FROM hosts ORDER BY full_name ASC`
  );
  return rows;
}

async function attachHost(programId, hostId, is_primary = false) {
  await pool.execute(
    `INSERT INTO program_hosts (program_id, host_id, is_primary)
     VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_primary = VALUES(is_primary)`,
    [programId, hostId, is_primary ? 1 : 0]
  );
}

async function detachHost(programId, hostId) {
  await pool.execute(
    `DELETE FROM program_hosts WHERE program_id = ? AND host_id = ?`,
    [programId, hostId]
  );
}

// Schedule
async function listSchedule(programId) {
  const [rows] = await pool.execute(
    `SELECT id, day_of_week, start_time, end_time, timezone, is_active
     FROM program_schedule WHERE program_id = ? ORDER BY day_of_week, start_time`,
    [programId]
  );
  return rows;
}

async function addSchedule(programId, row) {
  const { day_of_week, start_time, end_time, timezone = 'Africa/Kigali', is_active = true } = row;
  const [res] = await pool.execute(
    `INSERT INTO program_schedule (program_id, day_of_week, start_time, end_time, timezone, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [programId, day_of_week, start_time, end_time, timezone, is_active ? 1 : 0]
  );
  return res.insertId;
}

async function updateSchedule(programId, scheduleId, row) {
  const fields = [];
  const params = [];
  for (const key of ['day_of_week','start_time','end_time','timezone','is_active']) {
    if (row[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'is_active') params.push(row[key] ? 1 : 0); else params.push(row[key]);
    }
  }
  if (!fields.length) return false;
  params.push(programId, scheduleId);
  const [res] = await pool.execute(
    `UPDATE program_schedule SET ${fields.join(', ')} WHERE program_id = ? AND id = ?`,
    params
  );
  return res.affectedRows > 0;
}

async function deleteSchedule(programId, scheduleId) {
  const [res] = await pool.execute(
    `DELETE FROM program_schedule WHERE program_id = ? AND id = ?`,
    [programId, scheduleId]
  );
  return res.affectedRows > 0;
}

function timeToSeconds(t) {
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

async function liveNowNext() {
  // Load all active schedules
  const [rows] = await pool.execute(
    `SELECT ps.id, ps.program_id, ps.day_of_week, ps.start_time, ps.end_time, ps.timezone,
            p.name, p.slug
     FROM program_schedule ps
     JOIN programs p ON p.id = ps.program_id
     WHERE ps.is_active = 1 AND p.is_active = 1`
  );

  const nowUTC = DateTime.utc();

  let live = null;
  let next = null;
  let nextDelta = Number.POSITIVE_INFINITY;

  for (const r of rows) {
    const tz = r.timezone || 'Africa/Kigali';
    const localNow = nowUTC.setZone(tz);

    // compute the local date for the target weekday within this week
    const currentDow = localNow.weekday % 7; // luxon: 1=Mon..7=Sun; convert to 0..6
    const targetDow = r.day_of_week; // 0..6
    let diffDays = targetDow - ((currentDow === 0 ? 7 : currentDow) % 7);
    // Convert luxon weekday to 0..6 (Sun=0)
    const localNowDow0 = (localNow.weekday % 7); // 1..6,0
    const delta = r.day_of_week - localNowDow0;
    let startDate = localNow.plus({ days: delta });
    if (delta < 0) startDate = localNow.plus({ days: 7 + delta });

    // Parse start/end times
    const [sh, sm, ss] = r.start_time.split(':').map(Number);
    const [eh, em, es] = r.end_time.split(':').map(Number);

    const startDateTime = startDate.set({ hour: sh, minute: sm, second: ss || 0, millisecond: 0 });
    let endDateTime = startDate.set({ hour: eh, minute: em, second: es || 0, millisecond: 0 });
    if (endDateTime <= startDateTime) {
      endDateTime = endDateTime.plus({ days: 1 }); // handle overnight
    }

    // Determine live
    if (localNow >= startDateTime && localNow < endDateTime) {
      live = {
        program_id: r.program_id,
        name: r.name,
        slug: r.slug,
        schedule_id: r.id,
        start_time: r.start_time,
        end_time: r.end_time,
        timezone: tz,
      };
    }

    // Determine next upcoming start within next 7 days
    let nextStart = startDateTime;
    if (nextStart <= localNow) nextStart = nextStart.plus({ weeks: 1 });
    const deltaMs = nextStart.toMillis() - localNow.toMillis();
    if (deltaMs < nextDelta) {
      nextDelta = deltaMs;
      next = {
        program_id: r.program_id,
        name: r.name,
        slug: r.slug,
        schedule_id: r.id,
        start_time: r.start_time,
        end_time: r.end_time,
        timezone: tz,
        starts_in_ms: deltaMs,
      };
    }
  }

  return { live, next };
}

module.exports = {
  listPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  createHost,
  listHosts,
  attachHost,
  detachHost,
  listSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  liveNowNext,
};
