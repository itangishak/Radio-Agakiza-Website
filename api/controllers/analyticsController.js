const asyncHandler = require('../utils/asyncHandler');
const svc = require('../services/analyticsService');

// POST /api/v1/analytics/page-views
// Table: analytics_page_views
exports.trackPageView = asyncHandler(async (req, res) => {
  const { page_path, session_id, visitor_hash, referrer, user_agent, occurred_at } = req.body || {};
  if (!page_path) return res.status(400).json({ message: 'page_path is required' });
  const id = await svc.trackPageView({ page_path, session_id, visitor_hash, referrer, user_agent, occurred_at });
  res.status(201).json({ id });
});

// GET /api/v1/analytics/page-views/summary?from=&to=
exports.pageViewsSummary = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const rows = await svc.pageViewsSummary({ from, to });
  res.json(rows);
});

// POST /api/v1/analytics/live-listeners
// Table: analytics_live_listeners
exports.trackLiveListeners = asyncHandler(async (req, res) => {
  const { source = 'icecast', listeners_count, stream_label, measured_at } = req.body || {};
  if (listeners_count === undefined) return res.status(400).json({ message: 'listeners_count is required' });
  const id = await svc.trackLiveListeners({ source, listeners_count, stream_label, measured_at });
  res.status(201).json({ id });
});

// GET /api/v1/analytics/live-listeners/recent?limit=50
exports.recentLiveListeners = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const rows = await svc.recentLiveListeners({ limit });
  res.json(rows);
});
