import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

interface AuthRequest extends Request {
  userId?: string;
  userType?: string;
}

interface AuthSocket extends Socket {
  userId: string;
  userType: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  });
};

export const authenticateSocket = (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return next(new Error('Invalid token'));
      }
      
      (socket as AuthSocket).userId = decoded.userId;
      (socket as AuthSocket).userType = decoded.userType;
      next();
    });
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};

export const requireUserType = (userType: 'creator' | 'client') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userType !== userType) {
      return res.status(403).json({ message: `Access restricted to ${userType}s only` });
    }
    next();
  };
};