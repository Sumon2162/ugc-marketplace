// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'creator' | 'client';
  profile: {
    bio?: string;
    location?: string;
    age?: number;
    specialties?: string[];
    rates?: {
      min: number;
      max: number;
    };
    socialMedia?: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    };
    portfolio?: string[];
    profileImageUrl?: string; // Add this line
    stats?: {
      followers: number;
      engagement: number;
      totalViews: number;
    };
  };
  company?: {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
  };
  subscription?: {
    plan: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: Date;
  };
  isVerified: boolean;
  emailVerified: boolean;
  rating: number;
  totalRatings: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { type: String, enum: ['creator', 'client'], required: true },
  profile: {
    bio: { type: String, maxlength: 500 },
    location: String,
    age: { type: Number, min: 18, max: 100 },
    specialties: [{ type: String, enum: ['Fashion', 'Beauty', 'Fitness', 'Tech', 'Food', 'Travel', 'Lifestyle', 'Gaming', 'Music', 'Art'] }],
    rates: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 }
    },
    socialMedia: {
      instagram: String,
      tiktok: String,
      youtube: String
    },
    portfolio: [String],
    profileImageUrl: String, // Add this line
    stats: {
      followers: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 }
    }
  },
  company: {
    name: String,
    website: String,
    industry: String,
    size: { type: String, enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'] }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    expiresAt: Date
  },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ 'profile.specialties': 1 });
UserSchema.index({ rating: -1 });

export default mongoose.model<IUser>('User', UserSchema);