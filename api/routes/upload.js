const express = require('express');
const multer = require('multer');
const ImageProcessor = require('../../lib/imageProcessor');
const AudioProcessor = require('../../lib/audioProcessor');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Ensure ffmpeg binary is available for fluent-ffmpeg
const ffmpeg = require('fluent-ffmpeg');
let ffmpegPath = null;
try {
  ffmpegPath = process.env.FFMPEG_PATH || require('ffmpeg-static');
} catch (_) {
  ffmpegPath = process.env.FFMPEG_PATH || null;
}
if (ffmpegPath) {
  try {
    ffmpeg.setFfmpegPath(ffmpegPath);
  } catch (_) {
    // ignore if setting path fails; system ffmpeg may be available on PATH
  }
}

let ffprobePath = null;
try {
  const ffprobe = require('ffprobe-static');
  ffprobePath = process.env.FFPROBE_PATH || (ffprobe && (ffprobe.path || ffprobe));
} catch (_) {
  ffprobePath = process.env.FFPROBE_PATH || null;
}
if (ffprobePath) {
  try {
    ffmpeg.setFfprobePath(ffprobePath);
  } catch (_) {
    // ignore if setting path fails; system ffprobe may be available on PATH
  }
}

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for audio files
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// POST /api/v1/upload-image
router.post('/upload-image', authMiddleware, authorize(['admin','journalist']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { buffer, originalname, mimetype } = req.file;
    
    // Process image with Lanczos-3
    const results = await ImageProcessor.processImage(buffer, originalname, mimetype);

    res.json({
      success: true,
      images: results,
      message: 'Image processed successfully'
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process image' 
    });
  }
});

// POST /api/v1/upload-audio
router.post('/upload-audio', authMiddleware, authorize(['admin','journalist']), upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { buffer, originalname } = req.file;
    
    // Save temp file for FFmpeg processing
    const os = require('os');
    const path = require('path');
    const tempPath = path.join(os.tmpdir(), `${Date.now()}_${originalname}`);
    await require('fs').promises.writeFile(tempPath, buffer);
    
    // Process audio with Kaiser-Windowed Sinc
    const result = await AudioProcessor.processAudio(tempPath, originalname);
    
    // Clean up temp file
    await require('fs').promises.unlink(tempPath);

    res.json({
      success: true,
      audio: result,
      message: 'Audio processed successfully'
    });

  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process audio' 
    });
  }
});

module.exports = router;
