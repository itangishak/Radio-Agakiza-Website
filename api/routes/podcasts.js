const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ctrl = require('../controllers/podcastsController');

const router = express.Router();

// Series
router.get('/series', ctrl.listSeries);
router.get('/series/:id', ctrl.getSeries);
router.post('/series', auth, authorize(['admin', 'journalist']), ctrl.createSeries);
router.patch('/series/:id', auth, authorize(['admin', 'journalist']), ctrl.updateSeries);
router.delete('/series/:id', auth, authorize(['admin', 'journalist']), ctrl.deleteSeries);

// Episodes
router.get('/episodes', ctrl.listEpisodes);
router.get('/episodes/:id', ctrl.getEpisode);
router.post('/episodes', auth, authorize(['admin', 'journalist']), ctrl.createEpisode);
router.patch('/episodes/:id', auth, authorize(['admin', 'journalist']), ctrl.updateEpisode);
router.delete('/episodes/:id', auth, authorize(['admin', 'journalist']), ctrl.deleteEpisode);

module.exports = router;
