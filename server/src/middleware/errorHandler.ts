import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

// Helper function to create errors with status codes
export const createError = (message: string, statusCode: number): ErrorWithStatus => {
  const error: ErrorWithStatus = new Error(message);
  error.statusCode = statusCode;
  return error;
};