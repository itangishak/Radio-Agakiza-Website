const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/articlesController');

const router = express.Router();

// Public
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// Admin and Journalist can manage articles
router.post('/', auth, authorize(['admin', 'journalist']), ctrl.create);
router.patch('/:id', auth, authorize(['admin', 'journalist']), ctrl.update);
router.delete('/:id', auth, authorize(['admin', 'journalist']), ctrl.remove);

module.exports = router;
