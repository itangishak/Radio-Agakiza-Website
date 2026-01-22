const { pool } = require('../config/db');

// Tables: analytics_page_views, analytics_live_listeners

async function trackPageView({ page_path, session_id = null, visitor_hash = null, referrer = null, user_agent = null, occurred_at = null }) {
  const sql = `INSERT INTO analytics_page_views (page_path, session_id, visitor_hash, referrer, user_agent, occurred_at)
               VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`;
  const params = [page_path, session_id, visitor_hash, referrer, user_agent, occurred_at];
  const [res] = await pool.execute(sql, params);
  return res.insertId;
}

async function pageViewsSummary({ from = null, to = null }) {
  const where = [];
  const params = [];
  if (from) { where.push('occurred_at >= ?'); params.push(from); }
  if (to) { where.push('occurred_at <= ?'); params.push(to); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT DATE(occurred_at) AS day, COUNT(*) AS views
     FROM analytics_page_views
     ${whereSql}
     GROUP BY DATE(occurred_at)
     ORDER BY day ASC`,
    params
  );
  return rows;
}

async function trackLiveListeners({ source = 'icecast', listeners_count, stream_label = null, measured_at = null }) {
  const sql = `INSERT INTO analytics_live_listeners (source, listeners_count, stream_label, measured_at)
               VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`;
  const params = [source, Number(listeners_count), stream_label, measured_at];
  const [res] = await pool.execute(sql, params);
  return res.insertId;
}

async function recentLiveListeners({ limit = 50 } = {}) {
  const [rows] = await pool.execute(
    `SELECT id, source, listeners_count, stream_label, measured_at
     FROM analytics_live_listeners
     ORDER BY measured_at DESC
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}

module.exports = { trackPageView, pageViewsSummary, trackLiveListeners, recentLiveListeners };
