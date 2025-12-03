import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { 
  TaskBreakdownRequestSchema,
  DailyStudyPlanRequestSchema,
  RecommendationsRequestSchema,
  StudySessionHintsRequestSchema
} from '../types/ai';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const validateTaskBreakdownRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add userId from authenticated user
    const requestData = {
      ...req.body,
      userId: req.user?.id || req.body.userId,
    };

    const validated = TaskBreakdownRequestSchema.parse(requestData);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ error: 'Validation error' });
  }
};

export const validateDailyStudyPlanRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestData = {
      ...req.body,
      userId: req.user?.id || req.body.userId,
    };

    const validated = DailyStudyPlanRequestSchema.parse(requestData);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ error: 'Validation error' });
  }
};

export const validateRecommendationsRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestData = {
      ...req.body,
      userId: req.user?.id || req.body.userId,
    };

    const validated = RecommendationsRequestSchema.parse(requestData);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ error: 'Validation error' });
  }
};

export const validateStudySessionHintsRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestData = {
      ...req.body,
      userId: req.user?.id || req.body.userId,
    };

    const validated = StudySessionHintsRequestSchema.parse(requestData);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ error: 'Validation error' });
  }
};

// Mock authentication middleware for now - in a real app, this would validate JWT tokens
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For development, we'll use a mock user ID
  // In production, this would verify JWT tokens and extract user info
  req.user = {
    id: req.headers['x-user-id'] as string || 'mock-user-id',
    email: req.headers['x-user-email'] as string || 'mock@example.com',
  };
  
  if (!req.user.id) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  next();
};

// Rate limiting middleware for AI endpoints
export const aiRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Simple in-memory rate limiting for demo
  // In production, use Redis or another store
  const requests = (global as any).__ai_requests || new Map();
  (global as any).__ai_requests = requests;
  
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute
  
  const userRequests = requests.get(clientId) || [];
  const validRequests = userRequests.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return res.status(429).json({ 
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
  
  validRequests.push(now);
  requests.set(clientId, validRequests);
  
  next();
};

// Error handling middleware for AI services
export const aiErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('AI Service Error:', error);
  
  if (error.message.includes('Content validation failed')) {
    return res.status(400).json({
      error: 'Content validation failed',
      message: 'Your request appears to be outside the academic scope. Please ensure your request is related to education or learning.',
    });
  }
  
  if (error.message.includes('Failed to parse AI response')) {
    return res.status(500).json({
      error: 'AI service error',
      message: 'Failed to process AI response. Please try again.',
    });
  }
  
  if (error.message.includes('OPENAI_API_KEY')) {
    return res.status(500).json({
      error: 'Service configuration error',
      message: 'AI service is not properly configured.',
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again.',
  });
};