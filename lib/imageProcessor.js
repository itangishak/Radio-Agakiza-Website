const path = require('path');
const fs = require('fs').promises;

const SIZES = {
  thumbnail: 300,
  medium: 800,
  large: 1600
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

class ImageProcessor {
  static async processImage(buffer, originalName, mimetype, progressCallback) {
    // Load sharp (ESM-only) via dynamic import to work within CJS
    const sharp = (await import('sharp')).default;
    // Validate file type
    if (!ALLOWED_TYPES.includes(mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    const timestamp = Date.now();
    const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_');
    const results = {};
    const totalSizes = Object.keys(SIZES).length;
    let completedSizes = 0;

    progressCallback?.({ 
      algorithm: 'Lanczos-3 Resampling', 
      progress: 0, 
      processedMB: 0, 
      totalMB: (buffer.length / (1024 * 1024)).toFixed(2) 
    });

    // Process each size variant
    for (const [sizeName, width] of Object.entries(SIZES)) {
      const fileName = `${baseName}_${timestamp}_${sizeName}.webp`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', sizeName, fileName);
      
      try {
        // Ensure output directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Process with Sharp using Lanczos-3 kernel
        const processedBuffer = await sharp(buffer)
          // auto-rotate based on EXIF, and drop metadata by default
          .rotate()
          .resize({
            width,
            kernel: sharp.kernel.lanczos3,
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({
            quality: 85,
            effort: 6
          })
          .toBuffer();

        // Save to disk
        await fs.writeFile(filePath, processedBuffer);

        // Get image metadata
        const metadata = await sharp(processedBuffer).metadata();

        results[sizeName] = {
          url: `/uploads/${sizeName}/${fileName}`,
          width: metadata.width,
          height: metadata.height,
          size: processedBuffer.length,
          format: 'webp'
        };

        completedSizes++;
        const progress = Math.round((completedSizes / totalSizes) * 100);
        const processedMB = ((completedSizes / totalSizes) * buffer.length / (1024 * 1024)).toFixed(2);

        progressCallback?.({ 
          algorithm: 'Lanczos-3 Resampling', 
          progress, 
          processedMB, 
          totalMB: (buffer.length / (1024 * 1024)).toFixed(2) 
        });

      } catch (error) {
        console.error(`Error processing ${sizeName}:`, error);
        throw new Error(`Failed to process ${sizeName} variant`);
      }
    }

    return results;
  }

  static async deleteImages(imageUrls) {
    const deletePromises = imageUrls.map(async (url) => {
      if (!url) return;
      
      const filePath = path.join(process.cwd(), 'public', url);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
      }
    });

    await Promise.all(deletePromises);
  }
}

module.exports = ImageProcessor;
