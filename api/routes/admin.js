const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const controller = require('../controllers/adminController');

const router = express.Router();

// Multer setup for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Auth routes
router.post('/login', controller.login);
router.get('/verify', authMiddleware, controller.verify);
router.put('/profile', authMiddleware, controller.updateProfile);
router.post('/profile/image', authMiddleware, upload.single('image'), controller.uploadProfileImage);

// Users CRUD
router.get('/users', authMiddleware, authorize(['admin']), controller.getUsers);
router.post('/users', authMiddleware, authorize(['admin']), controller.createUser);
router.put('/users/:id', authMiddleware, authorize(['admin']), controller.updateUser);
router.delete('/users/:id', authMiddleware, authorize(['admin']), controller.deleteUser);

// Programs CRUD
router.get('/programs', authMiddleware, authorize(['admin','manager']), controller.getPrograms);
router.post('/programs', authMiddleware, authorize(['admin','manager']), controller.createProgram);
router.put('/programs/:id', authMiddleware, authorize(['admin','manager']), controller.updateProgram);
router.delete('/programs/:id', authMiddleware, authorize(['admin','manager']), controller.deleteProgram);

// News CRUD
router.get('/news', authMiddleware, authorize(['admin','journalist']), controller.getNews);
router.post('/news', authMiddleware, authorize(['admin','journalist']), controller.createNews);
router.put('/news/:id', authMiddleware, authorize(['admin','journalist']), controller.updateNews);
router.delete('/news/:id', authMiddleware, authorize(['admin','journalist']), controller.deleteNews);

// Podcasts CRUD
router.get('/podcasts', authMiddleware, authorize(['admin','journalist']), controller.getPodcasts);
router.post('/podcasts', authMiddleware, authorize(['admin','journalist']), controller.createPodcast);
router.put('/podcasts/:id', authMiddleware, authorize(['admin','journalist']), controller.updatePodcast);
router.delete('/podcasts/:id', authMiddleware, authorize(['admin','journalist']), controller.deletePodcast);

// Testimonials CRUD
router.get('/testimonials', authMiddleware, authorize(['admin','manager']), controller.getTestimonials);
router.post('/testimonials', authMiddleware, authorize(['admin','manager']), controller.createTestimonial);
router.put('/testimonials/:id', authMiddleware, authorize(['admin','manager']), controller.updateTestimonial);
router.delete('/testimonials/:id', authMiddleware, authorize(['admin','manager']), controller.deleteTestimonial);

// Settings
router.get('/settings/stream', authMiddleware, authorize(['admin']), controller.getStreamSettings);
router.put('/settings/stream', authMiddleware, authorize(['admin']), controller.updateStreamSettings);

module.exports = router;
