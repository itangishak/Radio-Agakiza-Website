const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function findUserByEmail(email) {
  const sql = `
    SELECT u.id, u.full_name, u.email, u.password_hash, u.role_id, r.name AS role
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.email = ? AND u.is_active = 1
    LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [email]);
  return rows[0] || null;
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { findUserByEmail, verifyPassword };
