const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/settingsController');

const router = express.Router();

// Public read for specific settings like stream URL (no secrets stored here)
router.get('/:key', ctrl.get);

// Admin-only update
router.put('/:key', auth, authorize(['admin']), ctrl.update);

module.exports = router;
