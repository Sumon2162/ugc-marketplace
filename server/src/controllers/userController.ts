// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import { deleteMedia } from '../services/cloudinaryService';

// Define AuthRequest interface to extend Request
interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
  file?: Express.Multer.File;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields based on user type
    if (user.userType === 'creator') {
      const { firstName, lastName, email, profile } = req.body;
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      
      if (profile) {
        user.profile = {
          ...user.profile,
          ...profile
        };
      }
    } else if (user.userType === 'client') {
      const { firstName, lastName, email, company } = req.body;
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      
      if (company) {
        user.company = {
          ...user.company,
          ...company
        };
      }
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        profile: user.profile,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile image
export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const imageUrl = req.file.path;
    
    // Update user's profile
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }
    
    // Store previous image URL for cleanup
    const previousImage = user.profile.profileImageUrl;
    
    // Update profile image
    user.profile.profileImageUrl = imageUrl;
    await user.save();
    
    // Delete previous image if it exists
    if (previousImage) {
      try {
        // Extract public ID from previous image URL
        const publicId = previousImage.split('/').pop()?.split('.')[0];
        if (publicId) {
          await deleteMedia(publicId, 'image');
        }
      } catch (error) {
        console.error('Error deleting previous profile image:', error);
      }
    }
    
    res.json({
      message: 'Profile image updated successfully',
      profileImageUrl: imageUrl
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    res.status(500).json({ message: 'Server error during image upload' });
  }
};

export const getCreators = async (req: AuthRequest, res: Response) => {
  try {
    const { specialties, rating, page = 1, limit = 10 } = req.query;
    
    const filter: any = { userType: 'creator' };
    
    if (specialties) {
      filter['profile.specialties'] = { $in: specialties };
    }
    
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const creators = await User.find(filter)
      .select('-password')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(filter);
    
    res.json({
      creators,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get creators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for creators
export const searchCreators = async (req: AuthRequest, res: Response) => {
  try {
    const { query, specialties, minRating, location, page = 1, limit = 20 } = req.query;
    
    const filter: any = { userType: 'creator' };
    
    // Text search
    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { 'profile.bio': { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by specialties
    if (specialties) {
      const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];
      filter['profile.specialties'] = { $in: specialtiesArray };
    }
    
    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    
    // Filter by location
    if (location) {
      filter['profile.location'] = { $regex: location, $options: 'i' };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const creators = await User.find(filter)
      .select('firstName lastName profile rating totalRatings')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments(filter);
    
    res.json({
      creators,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Search creators error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};