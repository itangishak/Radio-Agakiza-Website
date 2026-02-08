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
async function listEpisodes({ series_id, status, limit = 20, offset = 0 } = {}) {
  try {
    let query = 'SELECT * FROM podcast_episodes';
    
    const params = [];
    const conditions = [];
    
    if (series_id !== undefined) {
      conditions.push('series_id = ?');
      params.push(series_id);
    }
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add sorting and pagination
    query += ' ORDER BY COALESCE(episode_number, 999999) DESC, created_at DESC';
    query += ' LIMIT ? OFFSET ?';
    
    // Add limit and offset to params
    const limitNum = Number(limit) || 20;
    const offsetNum = Number(offset) || 0;
    params.push(limitNum, offsetNum);
    
    // Execute the query
    const [rows] = await pool.execute(query, params);
    return rows || [];
  } catch (error) {
    console.error('Error in listEpisodes:', error);
    throw error; // Re-throw to be handled by the controller
  }
}

async function getEpisode(id) {
  const [[row]] = await pool.execute(
    `SELECT * FROM podcast_episodes WHERE id = ? LIMIT 1`,
    [id]
  );
  return row || null;
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
