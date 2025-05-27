// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { sendWelcomeEmail, sendVerificationEmail } from '../services/emailService';

// Define AuthRequest interface to extend Request
interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, userType, companyName, specialties } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userData: any = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType
    };

    if (userType === 'client' && companyName) {
      userData.company = { name: companyName };
    }

    if (userType === 'creator' && specialties) {
      userData.profile = { specialties: Array.isArray(specialties) ? specialties : [specialties] };
    }

    const user = new User(userData);
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Send emails
    try {
      await sendWelcomeEmail(user.email, user.firstName);
      await sendVerificationEmail(user.email, user._id.toString());
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        profile: user.profile,
        company: user.company,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        profile: user.profile,
        company: user.company,
        emailVerified: user.emailVerified,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        profile: user.profile,
        company: user.company,
        emailVerified: user.emailVerified,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};