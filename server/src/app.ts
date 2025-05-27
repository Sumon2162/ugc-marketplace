// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import videoRoutes from './routes/videos';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';

// Middleware
import { authenticateSocket } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Services
import { handleSocketConnection } from './services/socketService';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('UGC Marketplace API is running!');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io
io.use(authenticateSocket);
io.on('connection', (socket: any) => handleSocketConnection(socket, io));

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Dynamic port selection to avoid conflicts
let PORT = parseInt(process.env.PORT || '5000');
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  }).on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use, trying port ${PORT + 1}`);
      PORT += 1;
      startServer(); // Try with new port
    } else {
      console.error('Server error:', e);
    }
  });
};

startServer();

export { io };