const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'radio_user',
    password: process.env.DB_PASSWORD || 'agakiza',
    database: process.env.DB_NAME || 'radio_agakiza',
  };

  let conn;
  try {
    conn = await mysql.createConnection(config);
    const [rows] = await conn.query('SELECT 1 AS ok, NOW() AS now, DATABASE() AS db');
    console.log(JSON.stringify({ status: 'ok', result: rows[0] }));
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ status: 'error', message: err.message }));
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
})();
