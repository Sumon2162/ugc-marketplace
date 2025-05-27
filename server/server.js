const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('🔥 Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['creator', 'brand'], required: true },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { type: String, default: '' },
  avatar: { type: String, default: '' },
  socialLinks: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  rates: {
    shortVideo: { type: Number, default: 100 },
    longVideo: { type: Number, default: 500 },
    socialPost: { type: Number, default: 50 }
  },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  avgEngagementRate: { type: Number, default: 0 },
  monthlyViews: { type: Number, default: 0 },
  monthlyEarnings: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [{ type: String }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  uploadedAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  deliverables: [{ type: String }],
  timeline: { type: String, required: true },
  requirements: { type: String, default: '' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  applicants: [{
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    proposal: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// Match Schema
const matchSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', matchSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Message = mongoose.model('Message', messageSchema);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
    user: 'postmaster@' + process.env.MAILGUN_DOMAIN,
    pass: process.env.MAILGUN_API_KEY
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'UGC Marketplace API is running!' });
});

// Registration endpoint
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('userType').isIn(['creator', 'brand'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, userType, bio, location, category } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      bio: bio || '',
      location: location || '',
      category: category || ''
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Welcome to UGC Marketplace!',
        html: `
          <h1>Welcome ${firstName}!</h1>
          <p>Thank you for joining our UGC Marketplace as a ${userType}.</p>
          <p>Start exploring and connecting with amazing creators and brands!</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        location: user.location,
        category: user.category
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        location: user.location,
        category: user.category,
        avatar: user.avatar,
        socialLinks: user.socialLinks,
        rates: user.rates
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Discover creators
app.get('/api/creators/discover', authenticateToken, async (req, res) => {
  try {
    const { category, minFollowers, maxRate } = req.query;
    
    let query = { userType: 'creator' };
    
    if (category) query.category = category;
    if (minFollowers) query.followers = { $gte: parseInt(minFollowers) };
    if (maxRate) query['rates.ugcVideo'] = { $lte: parseInt(maxRate) };

    const creators = await User.find(query)
      .select('-password')
      .limit(20)
      .sort({ followers: -1 });

    res.json(creators);
  } catch (error) {
    console.error('Discover creators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Video upload endpoint - FIXED VERSION
app.post('/api/videos/upload', authenticateToken, upload.single('video'), async (req, res) => {
  console.log('🔍 UPLOAD: Request received from user:', req.user.userId);
  
  try {
    if (!req.file) {
      console.log('❌ UPLOAD: No file provided');
      return res.status(400).json({ message: 'No video file provided' });
    }

    console.log('🔍 UPLOAD: File received, size:', req.file.size);
    console.log('🔍 UPLOAD: Uploading to Cloudinary...');
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'ugc-marketplace/videos',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) {
            console.log('❌ CLOUDINARY ERROR:', error);
            reject(error);
          } else {
            console.log('✅ CLOUDINARY SUCCESS:', result.secure_url);
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const { title, description, category, tags, status } = req.body;

    console.log('🔍 UPLOAD: Creating video document with data:', {
      title: title || 'Untitled Video',
      description: description || 'No description',
      category: category || 'lifestyle',
      creator: req.user.userId
    });

    const video = new Video({
      title: title || 'Untitled Video',
      description: description || 'No description provided',
      videoUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace('.mp4', '.jpg'),
      category: category || 'lifestyle',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      creator: new mongoose.Types.ObjectId(req.user.userId),
      status: status || 'published'
    });

    console.log('🔍 UPLOAD: Saving video to MongoDB...');
    await video.save();
    console.log('✅ UPLOAD SUCCESS: Video saved with ID:', video._id);

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        category: video.category,
        creator: video.creator,
        uploadedAt: video.uploadedAt
      }
    });
  } catch (error) {
    console.log('❌ UPLOAD ERROR:', error);
    res.status(500).json({ 
      message: 'Server error during video upload',
      error: error.message 
    });
  }
});

// Get user's videos - FIXED VERSION
app.get('/api/videos/my-videos', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 FETCH: Getting videos for user:', req.user.userId);
    
    const videos = await Video.find({ 
      creator: new mongoose.Types.ObjectId(req.user.userId) 
    })
    .sort({ uploadedAt: -1 })
    .populate('creator', 'firstName lastName avatar');

    console.log('✅ FETCH SUCCESS: Found', videos.length, 'videos for user');
    
    res.json({
      videos: videos,
      totalVideos: videos.length
    });
  } catch (error) {
    console.error('❌ FETCH ERROR:', error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
});

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const { page = 1, category, limit = 10 } = req.query;
    
    let query = { status: 'published' };
    if (category) query.category = category;

    const videos = await Video.find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'firstName lastName avatar');

    const totalVideos = await Video.countDocuments(query);

    res.json({
      videos,
      totalPages: Math.ceil(totalVideos / limit),
      currentPage: page,
      totalVideos
    });
  } catch (error) {
    console.error('Videos fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create campaign
app.post('/api/campaigns', authenticateToken, async (req, res) => {
  console.log("🔍 CAMPAIGN CREATE: Request received from user:", req.user?.userId);
  console.log("🔍 CAMPAIGN CREATE: Request body:", req.body);
  try {
    if (req.user.userType !== 'brand') {
      return res.status(403).json({ message: 'Only brands can create campaigns' });
    }

    const campaign = new Campaign({
      ...req.body,
      brand: req.user.userId
    });

    await campaign.save();
    console.log("✅ CAMPAIGN SAVED: Campaign saved with ID:", campaign._id);

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({ message: 'Server error during campaign creation' });
  }
});

// Get all campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const { page = 1, category, limit = 10 } = req.query;
    
    let query = { status: 'active' };
    if (category) query.category = category;

    console.log("🔍 CAMPAIGNS: Query:", query);
    const allCampaigns = await Campaign.find({});
    console.log("🔍 CAMPAIGNS: All campaigns in DB:", allCampaigns.length);
    console.log("🔍 CAMPAIGNS: Sample campaign:", allCampaigns[0]);
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('brand', 'firstName lastName avatar');

    const totalCampaigns = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      totalPages: Math.ceil(totalCampaigns / limit),
      currentPage: page,
      totalCampaigns
    });
  } catch (error) {
    console.error('Campaigns fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to campaign
app.post('/api/campaigns/:id/apply', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'creator') {
      return res.status(403).json({ message: 'Only creators can apply to campaigns' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if already applied
    const existingApplication = campaign.applicants.find(
      app => app.creator.toString() === req.user.userId
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this campaign' });
    }

    // Add application
    campaign.applicants.push({
      creator: req.user.userId,
      proposal: req.body.proposal || ''
    });

    await campaign.save();
    console.log("✅ CAMPAIGN SAVED: Campaign saved with ID:", campaign._id);

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Campaign application error:', error);
    res.status(500).json({ message: 'Server error during campaign application' });
  }
});

// Get matches
app.get('/api/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { creator: req.user.userId },
        { brand: req.user.userId }
      ]
    })
    .populate('creator', 'firstName lastName avatar')
    .populate('brand', 'firstName lastName avatar')
    .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    console.error('Matches fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a match
app.get('/api/messages/:matchId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ matchId: req.params.matchId })
      .populate('sender', 'firstName lastName avatar')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { matchId, content } = req.body;

    const message = new Message({
      matchId,
      sender: req.user.userId,
      content
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'creator') {
      return res.status(403).json({ message: 'Only creators can view analytics' });
    }

    const videos = await Video.find({ creator: req.user.userId });
    
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const totalVideos = videos.length;
    const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);
    
    const analytics = {
      totalViews,
      totalVideos,
      totalLikes,
      avgEngagementRate: totalViews > 0 ? (totalLikes / totalViews * 100) : 0,
      monthlyViews: Math.floor(totalViews * 0.3), // Mock monthly data
      monthlyEarnings: Math.floor(totalViews * 0.05), // Mock earnings
      totalEarnings: Math.floor(totalViews * 0.2) // Mock total earnings
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===== PROFILE UPDATE ENDPOINTS =====
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 UPDATE PROFILE: Request from user:', req.user.userId);
    const { firstName, lastName, bio, location, website, socialLinks } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio?.trim() || '',
        location: location?.trim() || '',
        website: website?.trim() || '',
        socialLinks: socialLinks || {}
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

app.patch('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===== PROFILE UPDATE ENDPOINTS =====
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    console.log('🔄 UPDATE PROFILE: Request from user:', req.user.userId);
    const { firstName, lastName, bio, location, website, socialLinks } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio?.trim() || '',
        location: location?.trim() || '',
        website: website?.trim() || '',
        socialLinks: socialLinks || {}
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

app.patch('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 UGC Marketplace API server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Not configured'}`);
  console.log(`📧 Mailgun: ${process.env.MAILGUN_API_KEY ? 'Configured' : 'Not configured'}`);
});