const { pool } = require('../config/db');

// Tables: podcast_series, podcast_episodes

// Series
async function listSeries({ limit = 50, offset = 0 } = {}) {
  const [rows] = await pool.execute(
    `SELECT id, title, slug, description, image_url, author_id, is_active, created_at, updated_at
     FROM podcast_series
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function getSeries(id) {
  const [[row]] = await pool.execute(
    `SELECT id, title, slug, description, image_url, author_id, is_active, created_at, updated_at
     FROM podcast_series WHERE id = ? LIMIT 1`,
    [id]
  );
  return row || null;
}

async function createSeries(data, userId) {
  const { title, slug, description = null, image_url = null, is_active = 1 } = data;
  const [res] = await pool.execute(
    `INSERT INTO podcast_series (title, slug, description, image_url, author_id, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, slug, description, image_url, userId || null, is_active ? 1 : 0]
  );
  return res.insertId;
}

async function updateSeries(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['title','slug','description','image_url','author_id','is_active']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'is_active') params.push(data[key] ? 1 : 0); else params.push(data[key]);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  const [res] = await pool.execute(`UPDATE podcast_series SET ${fields.join(', ')} WHERE id = ?`, params);
  return res.affectedRows > 0;
}

async function deleteSeries(id) {
  const [res] = await pool.execute(`DELETE FROM podcast_series WHERE id = ?`, [id]);
  return res.affectedRows > 0;
}

// Episodes
async function listEpisodes({ series_id, status, limit = 50, offset = 0 } = {}) {
  const params = [];
  const where = [];
  if (series_id) { where.push('pe.series_id = ?'); params.push(series_id); }
  if (status) { where.push('pe.status = ?'); params.push(status); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  try {
    const [rows] = await pool.execute(
      `SELECT pe.*, ps.title AS series_title
       FROM podcast_episodes pe
       LEFT JOIN podcast_series ps ON pe.series_id = ps.id
       ${whereSql}
       ORDER BY pe.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    return rows;
  } catch {
    const fallbackWhere = [];
    const fallbackParams = [];
    if (series_id) { fallbackWhere.push('series_id = ?'); fallbackParams.push(series_id); }
    if (status) { fallbackWhere.push('status = ?'); fallbackParams.push(status); }
    const fallbackWhereSql = fallbackWhere.length ? `WHERE ${fallbackWhere.join(' AND ')}` : '';
    const [rows] = await pool.execute(
      `SELECT * FROM podcast_episodes
       ${fallbackWhereSql}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...fallbackParams, Number(limit), Number(offset)]
    );
    return rows;
  }
}

async function getEpisode(id) {
  try {
    const [[row]] = await pool.execute(
      `SELECT pe.*, ps.title AS series_title
       FROM podcast_episodes pe
       LEFT JOIN podcast_series ps ON pe.series_id = ps.id
       WHERE pe.id = ? LIMIT 1`,
      [id]
    );
    return row || null;
  } catch {
    const [[row]] = await pool.execute(
      `SELECT * FROM podcast_episodes WHERE id = ? LIMIT 1`,
      [id]
    );
    return row || null;
  }
}

async function createEpisode(data, userId) {
  const { series_id, title, slug, description = null, audio_url, source = 'external', duration_seconds = null,
          episode_number = null, status = 'draft', published_at = null } = data;
  const [res] = await pool.execute(
    `INSERT INTO podcast_episodes (series_id, title, slug, description, audio_url, source, duration_seconds,
                                   episode_number, status, published_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [series_id, title, slug, description, audio_url, source, duration_seconds,
     episode_number, status, published_at, userId || null]
  );
  return res.insertId;
}

async function updateEpisode(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['series_id','title','slug','description','audio_url','source','duration_seconds','episode_number','status','published_at']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  const [res] = await pool.execute(`UPDATE podcast_episodes SET ${fields.join(', ')} WHERE id = ?`, params);
  return res.affectedRows > 0;
}

async function deleteEpisode(id) {
  const [res] = await pool.execute(`DELETE FROM podcast_episodes WHERE id = ?`, [id]);
  return res.affectedRows > 0;
}

module.exports = {
  listSeries,
  getSeries,
  createSeries,
  updateSeries,
  deleteSeries,
  listEpisodes,
  getEpisode,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
