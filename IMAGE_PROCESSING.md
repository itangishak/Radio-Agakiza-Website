# Lanczos-3 Image Processing Implementation

## Overview
This implementation provides high-quality image resizing using the Lanczos-3 resampling filter for all image uploads in the Radio Agakiza website.

## Key Features
- **Lanczos-3 Kernel**: Explicitly configured for superior image quality
- **Multiple Variants**: Generates thumbnail (300px), medium (800px), and large (1600px) versions
- **WebP Conversion**: Optimizes file sizes while maintaining quality
- **EXIF Removal**: Strips metadata for privacy and smaller files
- **Server-side Processing**: No client-side resizing

## Technology Stack
- **Sharp Library**: Uses libvips with explicit Lanczos-3 kernel
- **Node.js**: Server-side processing via Next.js API routes
- **MySQL**: Stores image URLs in articles table

## File Structure
```
/lib/imageProcessor.js          # Core image processing logic
/api/routes/upload.js           # Upload API endpoint
/public/uploads/                # Image storage
  ├── thumbnails/               # 300px width images
  ├── medium/                   # 800px width images
  └── large/                    # 1600px width images
```

## API Endpoint
**POST** `/api/v1/upload-image`
- Accepts: `multipart/form-data` with `image` field
- Returns: URLs and metadata for all three variants
- Authentication: Admin token required

## Database Schema
Added to `articles` table:
- `image_thumbnail` VARCHAR(512)
- `image_medium` VARCHAR(512) 
- `image_large` VARCHAR(512)

## Quality Benefits
✅ **Lanczos-3 Interpolation**: Superior edge preservation
✅ **Sharp Text**: Crisp text rendering in images
✅ **No Artifacts**: Eliminates jagged edges and moiré patterns
✅ **60%+ Size Reduction**: WebP format with quality=85
✅ **Metadata Stripped**: Privacy and performance optimized

## Usage in Admin Panel
1. Navigate to `/admin/news`
2. Click "Add Article" or edit existing
3. Upload image via file input
4. System automatically processes with Lanczos-3
5. Preview shows optimized thumbnail
6. All variants saved and linked to article

## Extending Image Sizes
To add new sizes, modify `SIZES` object in `/lib/imageProcessor.js`:
```javascript
const SIZES = {
  thumbnail: 300,
  medium: 800,
  large: 1600,
  xlarge: 2400  // Add new size
};
```

## Why Lanczos-3?
Lanczos-3 provides the optimal balance between:
- **Quality**: Superior to bicubic/bilinear interpolation
- **Performance**: Faster than higher-order Lanczos filters
- **Artifacts**: Minimal ringing compared to Lanczos-5+
- **Text Clarity**: Excellent for images containing text

This implementation ensures all uploaded images meet professional web standards with optimal loading performance.
