// src/controllers/messageController.ts
import { Request, Response } from 'express';
import Message from '../models/Message';
import Match from '../models/Match';

interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
}

// Get messages for a specific match
export const getMatchMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId;
    
    // Verify match exists and user is part of it
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (match.creator.toString() !== userId && match.client.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }
    
    // Get messages
    const messages = await Message.find({ match: matchId })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName');
    
    // Mark messages as read
    await Message.updateMany(
      { match: matchId, recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error during message retrieval' });
  }
};

// Send a message (REST API version, for non-socket clients)
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    const { content, type = 'text' } = req.body;
    const senderId = req.userId;
    
    // Validate match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if user is part of the match
    if (match.creator.toString() !== senderId && match.client.toString() !== senderId) {
      return res.status(403).json({ message: 'Not authorized to send messages in this match' });
    }
    
    // Determine recipient
    const recipientId = match.creator.toString() === senderId 
      ? match.client 
      : match.creator;
    
    // Create message
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      match: matchId,
      content,
      type
    });
    
    await message.save();
    await message.populate('sender', 'firstName lastName');
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error during message sending' });
  }
};

// Get unread message counts
export const getUnreadCounts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    // Get all matches for the user
    const matches = await Match.find({
      $or: [{ creator: userId }, { client: userId }]
    });
    
    const matchIds = matches.map(match => match._id);
    
    // Get unread counts per match
    const unreadCounts = await Message.aggregate([
      { 
        $match: { 
          recipient: userId, 
          isRead: false,
          match: { $in: matchIds }
        } 
      },
      { 
        $group: { 
          _id: '$match', 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Format response
    const result = unreadCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {} as Record<string, number>);
    
    res.json({
      totalUnread: unreadCounts.reduce((sum, item) => sum + item.count, 0),
      matchCounts: result
    });
  } catch (error) {
    console.error('Get unread counts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};