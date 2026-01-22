const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/analyticsController');

const router = express.Router();

// Public tracking endpoint (no PII expected)
router.post('/page-views', ctrl.trackPageView);

// Admin analytics
router.get('/page-views/summary', auth, authorize(['admin']), ctrl.pageViewsSummary);
router.post('/live-listeners', auth, authorize(['admin']), ctrl.trackLiveListeners);
router.get('/live-listeners/recent', auth, authorize(['admin']), ctrl.recentLiveListeners);

module.exports = router;
