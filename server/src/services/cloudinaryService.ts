// src/services/cloudinaryService.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ugc-marketplace/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    transformation: [{ quality: 'auto' }]
  } as any
});

// Set up storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ugc-marketplace/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ quality: 'auto' }]
  } as any
});

// Create multer upload objects
export const videoUpload = multer({ storage: videoStorage });
export const imageUpload = multer({ storage: imageStorage });

// Function to delete media from Cloudinary
export const deleteMedia = async (publicId: string, resourceType: 'image' | 'video') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete media from Cloudinary');
  }
};