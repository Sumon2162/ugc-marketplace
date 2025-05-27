// src/routes/messages.ts
import express from 'express';
import { getMatchMessages, sendMessage, getUnreadCounts } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Protected routes - requires authentication
router.get('/match/:matchId', authenticateToken, getMatchMessages);
router.post('/match/:matchId', authenticateToken, sendMessage);
router.get('/unread', authenticateToken, getUnreadCounts);

export default router;