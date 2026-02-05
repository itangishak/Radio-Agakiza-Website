const { pool } = require('../config/db');

function toPlainText(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function listArticles({ status, limit = 50, offset = 0 } = {}) {
  const params = [];
  let where = '';
  if (status) {
    where = 'WHERE a.status = ?';
    params.push(status);
  }
  const limitN = Math.max(1, Math.min(100, parseInt(limit, 10) || 30));
  const offsetN = Math.max(0, parseInt(offset, 10) || 0);
  const sql = `
    SELECT a.id, a.author_id, a.title, a.slug, a.excerpt, a.content,
           COALESCE(a.cover_image_url, a.image_large, a.image_medium, a.image_thumbnail) AS cover_image_url,
           a.status,
           a.published_at, a.created_at, a.updated_at,
           u.full_name AS author_name
    FROM articles a
    JOIN users u ON u.id = a.author_id
    ${where}
    ORDER BY a.created_at DESC
    LIMIT ${limitN} OFFSET ${offsetN}`;
  const [rows] = await pool.execute(sql, params);
  const data = rows.map(r => {
    if (!r.excerpt) {
      const txt = toPlainText(r.content);
      r.excerpt = txt || null;
    }
    // Provide a preview text always, based on excerpt if present, otherwise content
    r.preview_text = toPlainText(r.excerpt || r.content);
    delete r.content;
    return r;
  });
  return data;
}

async function getArticle(id) {
  const [[row]] = await pool.execute(
    `SELECT 
        a.id,
        a.author_id,
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        COALESCE(a.cover_image_url, a.image_large, a.image_medium, a.image_thumbnail) AS cover_image_url,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at,
        u.full_name AS author_name
     FROM articles a 
     JOIN users u ON u.id = a.author_id
     WHERE a.id = ? LIMIT 1`,
    [id]
  );
  return row || null;
}

async function createArticle(data, authorId) {
  const { title, slug, excerpt = null, content, cover_image_url = null, status = 'draft', published_at = null } = data;
  const [res] = await pool.execute(
    `INSERT INTO articles (author_id, title, slug, excerpt, content, cover_image_url, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [authorId, title, slug, excerpt, content, cover_image_url, status, published_at]
  );
  return res.insertId;
}

async function updateArticle(id, data) {
  const fields = [];
  const params = [];
  for (const key of ['title','slug','excerpt','content','cover_image_url','status','published_at']) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  const [res] = await pool.execute(`UPDATE articles SET ${fields.join(', ')} WHERE id = ?`, params);
  return res.affectedRows > 0;
}

async function deleteArticle(id) {
  const [res] = await pool.execute(`DELETE FROM articles WHERE id = ?`, [id]);
  return res.affectedRows > 0;
}

module.exports = { listArticles, getArticle, createArticle, updateArticle, deleteArticle };
