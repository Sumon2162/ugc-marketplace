// src/controllers/videoController.ts
import { Request, Response } from 'express';
import Video from '../models/Video';
import { deleteMedia } from '../services/cloudinaryService';

// Define AuthRequest interface
interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
  file?: Express.Multer.File;
}

// Upload video
export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, description, category, tags } = req.body;
    const tagsArray = tags ? JSON.parse(tags) : [];

    // Get video details from Cloudinary upload
    const videoUrl = req.file.path;
    const publicId = req.file.filename;
    
    // Extract thumbnail URL from video URL
    // Cloudinary automatically generates thumbnails for videos
    const thumbnailUrl = videoUrl.replace('/video/upload/', '/video/upload/e_thumbnail/');
    
    // Create video record in database
    const video = new Video({
      creator: req.userId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration: req.body.duration || 0, // This would need to be calculated or provided
      tags: tagsArray,
      category,
      isPublic: true,
      isApproved: req.userType === 'admin' ? true : false // Auto-approve for admins
    });

    await video.save();
    
    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Server error during video upload' });
  }
};

// Delete video
export const deleteVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user owns the video
    if (video.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    
    // Extract public ID from video URL
    const publicId = video.videoUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      await deleteMedia(publicId, 'video');
    }
    
    await Video.deleteOne({ _id: videoId });
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error during video deletion' });
  }
};

// Get videos uploaded by the logged in creator
export const getMyVideos = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ creator: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'firstName lastName profile.stats');
    
    const total = await Video.countDocuments({ creator: req.userId });
    
    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get videos for discovery feed
export const getDiscoverVideos = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    
    const filter: any = { 
      isPublic: true, 
      isApproved: true,
      creator: { $ne: req.userId } // Don't show user's own videos
    };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const videos = await Video.find(filter)
      .sort({ createdAt: -1, views: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'firstName lastName profile.stats profile.location profile.specialties rating');
    
    const total = await Video.countDocuments(filter);
    
    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get discover videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like/unlike a video
export const likeVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const isLiked = video.likes.includes(userId as any);
    
    if (isLiked) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      video.likes.push(userId as any);
    }
    
    await video.save();
    
    res.json({
      message: isLiked ? 'Video unliked' : 'Video liked',
      isLiked: !isLiked,
      likesCount: video.likes.length
    });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};