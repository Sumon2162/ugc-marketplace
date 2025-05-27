// src/routes/videos.ts
import express from 'express';
import { uploadVideo, deleteVideo, getMyVideos, getDiscoverVideos, likeVideo } from '../controllers/videoController';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { videoUpload } from '../services/cloudinaryService';

const router = express.Router();

// Protected routes - requires authentication
router.post('/upload', authenticateToken, videoUpload.single('video'), uploadVideo);
router.delete('/:videoId', authenticateToken, deleteVideo);
router.get('/my-videos', authenticateToken, getMyVideos);
router.get('/discover', authenticateToken, getDiscoverVideos);
router.post('/:videoId/like', authenticateToken, likeVideo);

export default router;