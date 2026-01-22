const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/programsController');

const router = express.Router();

// Public
router.get('/hosts', ctrl.listHosts);
router.get('/', ctrl.list);
router.get('/live', ctrl.live);
router.get('/:id/schedule', ctrl.listSchedule);
router.get('/:id', ctrl.get);

// Admin only for program/hosts/schedule mutations
router.post('/', auth, authorize(['admin']), ctrl.create);
router.patch('/:id', auth, authorize(['admin']), ctrl.update);
router.delete('/:id', auth, authorize(['admin']), ctrl.remove);

router.post('/hosts', auth, authorize(['admin']), ctrl.createHost);
router.post('/:id/hosts/:hostId', auth, authorize(['admin']), ctrl.attachHost);
router.delete('/:id/hosts/:hostId', auth, authorize(['admin']), ctrl.detachHost);

router.post('/:id/schedule', auth, authorize(['admin']), ctrl.addSchedule);
router.patch('/:id/schedule/:scheduleId', auth, authorize(['admin']), ctrl.updateSchedule);
router.delete('/:id/schedule/:scheduleId', auth, authorize(['admin']), ctrl.deleteSchedule);

module.exports = router;
