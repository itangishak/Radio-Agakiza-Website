const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/testimonialsController');

const router = express.Router();

// Public
router.get('/public', ctrl.listPublished);
router.get('/:id', ctrl.get);

// Admin/Journalist
router.get('/', auth, authorize(['admin', 'journalist']), ctrl.listAll);
router.post('/', auth, authorize(['admin', 'journalist']), ctrl.create);
router.patch('/:id', auth, authorize(['admin', 'journalist']), ctrl.update);
router.delete('/:id', auth, authorize(['admin', 'journalist']), ctrl.remove);

module.exports = router;
