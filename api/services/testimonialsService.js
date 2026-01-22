const { pool } = require('../config/db');

async function listPublished({ limit = 50, offset = 0 } = {}) {
  const [rows] = await pool.execute(
    `SELECT id, author_name, role, other_role, message, photo_url, is_published, published_at, created_by, created_at, updated_at
     FROM testimonials
     WHERE is_published = 1
     ORDER BY COALESCE(published_at, created_at) DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function listAll({ limit = 50, offset = 0 } = {}) {
  const [rows] = await pool.execute(
    `SELECT id, author_name, role, other_role, message, photo_url, is_published, published_at, created_by, created_at, updated_at
     FROM testimonials
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function getById(id) {
  const [[row]] = await pool.execute(
    `SELECT id, author_name, role, other_role, message, photo_url, is_published, published_at, created_by, created_at, updated_at
     FROM testimonials WHERE id = ? LIMIT 1`,
    [id]
  );
  return row || null;
}

async function create(data, userId) {
  const { author_name, role, other_role = null, message, photo_url = null, is_published = 0, published_at = null } = data;
  const [res] = await pool.execute(
    `INSERT INTO testimonials (author_name, role, other_role, message, photo_url, is_published, published_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [author_name, role, other_role, message, photo_url, is_published ? 1 : 0, published_at, userId || null]
  );
  return res.insertId;
}

async function update(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['author_name','role','other_role','message','photo_url','is_published','published_at']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (key === 'is_published') params.push(data[key] ? 1 : 0); else params.push(data[key]);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  const [res] = await pool.execute(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`, params);
  return res.affectedRows > 0;
}

async function remove(id) {
  const [res] = await pool.execute(`DELETE FROM testimonials WHERE id = ?`, [id]);
  return res.affectedRows > 0;
}

module.exports = { listPublished, listAll, getById, create, update, remove };
