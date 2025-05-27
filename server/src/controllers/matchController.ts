// src/controllers/matchController.ts
import { Request, Response } from 'express';
import Match from '../models/Match';
import User from '../models/User';

interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
}

// Create a new match request
export const createMatch = async (req: AuthRequest, res: Response) => {
  try {
    const { creatorId, projectDetails } = req.body;
    const clientId = req.userId;
    
    // Validate creator exists
    const creator = await User.findOne({ _id: creatorId, userType: 'creator' });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }
    
    // Check if match already exists
    const existingMatch = await Match.findOne({ creator: creatorId, client: clientId });
    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists with this creator' });
    }
    
    // Create match
    const match = new Match({
      creator: creatorId,
      client: clientId,
      status: 'pending',
      projectDetails
    });
    
    await match.save();
    
    res.status(201).json({
      message: 'Match request sent successfully',
      match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ message: 'Server error during match creation' });
  }
};

// Get all matches for the current user
export const getMyMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const userType = req.userType;
    
    // Get matches based on user type
    const filter = userType === 'creator' 
      ? { creator: userId } 
      : { client: userId };
    
    const matches = await Match.find(filter)
      .populate('creator', 'firstName lastName profile.specialties rating')
      .populate('client', 'firstName lastName company')
      .sort({ createdAt: -1 });
    
    res.json(matches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update match status
export const updateMatchStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid match status' });
    }
    
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Check if user is part of the match
    const isCreator = match.creator.toString() === req.userId;
    const isClient = match.client.toString() === req.userId;
    
    if (!isCreator && !isClient) {
      return res.status(403).json({ message: 'Not authorized to update this match' });
    }
    
    // Only creators can accept/reject, only clients can mark as completed
    if ((status === 'accepted' || status === 'rejected') && !isCreator) {
      return res.status(403).json({ message: 'Only creators can accept or reject matches' });
    }
    
    if (status === 'completed' && !isClient) {
      return res.status(403).json({ message: 'Only clients can mark matches as completed' });
    }
    
    // Update status
    match.status = status;
    await match.save();
    
    res.json({
      message: `Match ${status} successfully`,
      match
    });
  } catch (error) {
    console.error('Update match status error:', error);
    res.status(500).json({ message: 'Server error during status update' });
  }
};