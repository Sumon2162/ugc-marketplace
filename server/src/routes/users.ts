// src/routes/users.ts
import express from 'express';
import { getProfile, updateProfile, getCreators, uploadProfileImage, searchCreators } from '../controllers/userController';
import { authenticateToken, requireUserType } from '../middleware/auth';
import { imageUpload } from '../services/cloudinaryService';

const router = express.Router();

// Protected routes - requires authentication
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/image', authenticateToken, imageUpload.single('image'), uploadProfileImage);

// Client-only routes
router.get('/creators', authenticateToken, requireUserType('client'), getCreators);

// Search route
router.get('/search', authenticateToken, searchCreators);

export default router;