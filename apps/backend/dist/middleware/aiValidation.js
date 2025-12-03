"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiErrorHandler = exports.aiRateLimit = exports.authenticateUser = exports.validateStudySessionHintsRequest = exports.validateRecommendationsRequest = exports.validateDailyStudyPlanRequest = exports.validateTaskBreakdownRequest = void 0;
const zod_1 = require("zod");
const ai_1 = require("../types/ai");
const validateTaskBreakdownRequest = async (req, res, next) => {
    try {
        // Add userId from authenticated user
        const requestData = {
            ...req.body,
            userId: req.user?.id || req.body.userId,
        };
        const validated = ai_1.TaskBreakdownRequestSchema.parse(requestData);
        req.body = validated;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateTaskBreakdownRequest = validateTaskBreakdownRequest;
const validateDailyStudyPlanRequest = async (req, res, next) => {
    try {
        const requestData = {
            ...req.body,
            userId: req.user?.id || req.body.userId,
        };
        const validated = ai_1.DailyStudyPlanRequestSchema.parse(requestData);
        req.body = validated;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateDailyStudyPlanRequest = validateDailyStudyPlanRequest;
const validateRecommendationsRequest = async (req, res, next) => {
    try {
        const requestData = {
            ...req.body,
            userId: req.user?.id || req.body.userId,
        };
        const validated = ai_1.RecommendationsRequestSchema.parse(requestData);
        req.body = validated;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateRecommendationsRequest = validateRecommendationsRequest;
const validateStudySessionHintsRequest = async (req, res, next) => {
    try {
        const requestData = {
            ...req.body,
            userId: req.user?.id || req.body.userId,
        };
        const validated = ai_1.StudySessionHintsRequestSchema.parse(requestData);
        req.body = validated;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
exports.validateStudySessionHintsRequest = validateStudySessionHintsRequest;
// Mock authentication middleware for now - in a real app, this would validate JWT tokens
const authenticateUser = (req, res, next) => {
    // For development, we'll use a mock user ID
    // In production, this would verify JWT tokens and extract user info
    req.user = {
        id: req.headers['x-user-id'] || 'mock-user-id',
        email: req.headers['x-user-email'] || 'mock@example.com',
    };
    if (!req.user.id) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
exports.authenticateUser = authenticateUser;
// Rate limiting middleware for AI endpoints
const aiRateLimit = (req, res, next) => {
    // Simple in-memory rate limiting for demo
    // In production, use Redis or another store
    const requests = global.__ai_requests || new Map();
    global.__ai_requests = requests;
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10; // 10 requests per minute
    const userRequests = requests.get(clientId) || [];
    const validRequests = userRequests.filter((timestamp) => now - timestamp < windowMs);
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
exports.aiRateLimit = aiRateLimit;
// Error handling middleware for AI services
const aiErrorHandler = (error, req, res, next) => {
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
exports.aiErrorHandler = aiErrorHandler;
//# sourceMappingURL=aiValidation.js.map