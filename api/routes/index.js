const express = require('express');
const authRoutes = require('./auth');
const programsRoutes = require('./programs');
const articlesRoutes = require('./articles');
const podcastsRoutes = require('./podcasts');
const testimonialsRoutes = require('./testimonials');
const settingsRoutes = require('./settings');
const analyticsRoutes = require('./analytics');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/programs', programsRoutes);
router.use('/articles', articlesRoutes);
router.use('/podcasts', podcastsRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/settings', settingsRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
