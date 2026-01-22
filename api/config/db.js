const mysql = require('mysql2/promise');
const env = require('./env');

// Connection pool for MySQL using existing schema tables
// Tables used across modules: users, roles, programs, hosts, program_hosts, program_schedule,
// articles, podcast_series, podcast_episodes, testimonials, app_settings,
// analytics_page_views, analytics_live_listeners
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  namedPlaceholders: true,
});

module.exports = {
  pool,
  getConnection: () => pool.getConnection(),
  query: (sql, params) => pool.execute(sql, params),
};
