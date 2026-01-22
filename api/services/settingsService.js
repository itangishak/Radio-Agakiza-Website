const { pool } = require('../config/db');

async function getSetting(key) {
  const [[row]] = await pool.execute(
    `SELECT id, settings_key, settings_value, updated_by, created_at, updated_at
     FROM app_settings WHERE settings_key = ? LIMIT 1`,
    [key]
  );
  return row || null;
}

async function upsertSetting(key, value, userId) {
  const [res] = await pool.execute(
    `INSERT INTO app_settings (settings_key, settings_value, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE settings_value = VALUES(settings_value), updated_by = VALUES(updated_by), updated_at = CURRENT_TIMESTAMP`,
    [key, value, userId || null]
  );
  // Return the row after insert/update
  const row = await getSetting(key);
  return row;
}

module.exports = { getSetting, upsertSetting };
