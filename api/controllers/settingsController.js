const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/settingsService');

// GET /api/v1/settings/:key
// Table: app_settings
exports.get = asyncHandler(async (req, res) => {
  const key = req.params.key;
  const row = await svc.getSetting(key);
  if (!row) return res.status(404).json({ message: 'Setting not found' });
  res.json({ key: row.settings_key, value: row.settings_value, updated_by: row.updated_by, updated_at: row.updated_at });
});

// PUT /api/v1/settings/:key  { value }
// Admin only via route-level middleware
exports.update = asyncHandler(async (req, res) => {
  const key = req.params.key;
  const value = String(req.body?.value ?? '');
  if (value.length === 0) return res.status(400).json({ message: 'value is required' });
  const row = await svc.upsertSetting(key, value, req.user?.id);
  res.json({ key: row.settings_key, value: row.settings_value, updated_by: row.updated_by, updated_at: row.updated_at });
});
