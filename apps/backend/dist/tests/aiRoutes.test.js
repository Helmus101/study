"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const aiRoutes_1 = __importDefault(require("../controllers/ai/aiRoutes"));
// Mock the AIService
jest.mock('../services/ai/aiService');
describe('AI Routes', () => {
    let app;
    beforeEach(() => {
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/ai', aiRoutes_1.default);
        // Clear all mocks
        jest.clearAllMocks();
    });
    describe('POST /api/ai/task-breakdown', () => {
        it('should return task breakdown for valid request', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockBreakdownTask = jest.fn().mockResolvedValue({
                subtasks: [
                    {
                        title: 'Research topic',
                        description: 'Gather information',
                        estimatedMinutes: 30,
                        priority: 'high',
                        dependencies: []
                    }
                ],
                totalEstimatedMinutes: 30,
                complexity: 'simple',
                suggestions: ['Start with reliable sources']
            });
            AIService.mockImplementation(() => ({
                breakdownTask: mockBreakdownTask,
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: jest.fn(),
                getStudySessionHints: jest.fn(),
                healthCheck: jest.fn()
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/task-breakdown')
                .set('x-user-id', 'test-user')
                .send({
                taskTitle: 'Study biology',
                complexity: 'simple'
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.subtasks).toHaveLength(1);
            expect(response.body.data.subtasks[0].title).toBe('Research topic');
            expect(mockBreakdownTask).toHaveBeenCalledWith({
                userId: 'test-user',
                taskTitle: 'Study biology',
                complexity: 'simple'
            });
        });
        it('should return 400 for invalid request', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/task-breakdown')
                .set('x-user-id', 'test-user')
                .send({
                // Missing required taskTitle
                complexity: 'simple'
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid request data');
            expect(response.body.details).toBeDefined();
        });
        it('should return 401 without authentication', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/task-breakdown')
                .send({
                taskTitle: 'Study biology',
                complexity: 'simple'
            });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Authentication required');
        });
    });
    describe('POST /api/ai/daily-study-plan', () => {
        it('should return daily study plan for valid request', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockGeneratePlan = jest.fn().mockResolvedValue({
                date: '2024-01-15',
                totalStudyHours: 4,
                blocks: [
                    {
                        startTime: '09:00',
                        endTime: '10:30',
                        subject: 'Mathematics',
                        activity: 'Complete exercises',
                        goals: ['Finish problem set'],
                        breaks: []
                    }
                ],
                tips: ['Take regular breaks'],
                warnings: []
            });
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn(),
                generateDailyStudyPlan: mockGeneratePlan,
                getRecommendations: jest.fn(),
                getStudySessionHints: jest.fn(),
                healthCheck: jest.fn()
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/daily-study-plan')
                .set('x-user-id', 'test-user')
                .send({
                date: '2024-01-15',
                availableHours: 4,
                energyLevel: 'medium'
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.date).toBe('2024-01-15');
            expect(response.body.data.blocks).toHaveLength(1);
            expect(mockGeneratePlan).toHaveBeenCalledWith({
                userId: 'test-user',
                date: '2024-01-15',
                availableHours: 4,
                energyLevel: 'medium'
            });
        });
        it('should validate availableHours range', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/daily-study-plan')
                .set('x-user-id', 'test-user')
                .send({
                date: '2024-01-15',
                availableHours: 20, // Over maximum of 16
                energyLevel: 'medium'
            });
            expect(response.status).toBe(400);
            expect(response.body.details).toBeDefined();
        });
    });
    describe('POST /api/ai/recommendations', () => {
        it('should return recommendations for valid request', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockGetRecommendations = jest.fn().mockResolvedValue({
                recommendations: [
                    {
                        title: 'Use Pomodoro Technique',
                        description: 'Study in focused intervals',
                        type: 'time_management',
                        actionable: true,
                        priority: 'high'
                    }
                ],
                context: 'Based on your study patterns'
            });
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn(),
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: mockGetRecommendations,
                getStudySessionHints: jest.fn(),
                healthCheck: jest.fn()
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/recommendations')
                .set('x-user-id', 'test-user')
                .send({
                type: 'time_management',
                currentChallenge: 'Difficulty focusing'
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.recommendations).toHaveLength(1);
            expect(response.body.data.recommendations[0].type).toBe('time_management');
            expect(mockGetRecommendations).toHaveBeenCalledWith({
                userId: 'test-user',
                type: 'time_management',
                currentChallenge: 'Difficulty focusing'
            });
        });
        it('should validate recommendation type', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/recommendations')
                .set('x-user-id', 'test-user')
                .send({
                type: 'invalid_type'
            });
            expect(response.status).toBe(400);
            expect(response.body.details).toBeDefined();
        });
    });
    describe('POST /api/ai/study-session-hints', () => {
        it('should return study session hints for valid request', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockGetHints = jest.fn().mockResolvedValue({
                hints: [
                    {
                        hint: 'Focus on core concepts first',
                        category: 'concept',
                        importance: 'high',
                        actionableSteps: ['Read textbook', 'Review examples']
                    }
                ],
                sessionPlan: {
                    introduction: 'Review previous material',
                    mainActivities: ['Practice problems'],
                    conclusion: 'Summarize key points'
                }
            });
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn(),
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: jest.fn(),
                getStudySessionHints: mockGetHints,
                healthCheck: jest.fn()
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/study-session-hints')
                .set('x-user-id', 'test-user')
                .send({
                subjectId: 'Mathematics',
                topic: 'Calculus derivatives',
                sessionDuration: 60
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.hints).toHaveLength(1);
            expect(response.body.data.hints[0].category).toBe('concept');
            expect(response.body.data.sessionPlan).toBeDefined();
            expect(mockGetHints).toHaveBeenCalledWith({
                userId: 'test-user',
                subjectId: 'Mathematics',
                topic: 'Calculus derivatives',
                sessionDuration: 60
            });
        });
        it('should validate session duration range', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/ai/study-session-hints')
                .set('x-user-id', 'test-user')
                .send({
                subjectId: 'Mathematics',
                topic: 'Calculus',
                sessionDuration: 10 // Below minimum of 15
            });
            expect(response.status).toBe(400);
            expect(response.body.details).toBeDefined();
        });
    });
    describe('GET /api/ai/health', () => {
        it('should return health status', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockHealthCheck = jest.fn().mockResolvedValue({
                success: true,
                service: 'ai-planning-service',
                status: 'healthy',
                provider: 'openai',
                modelsAvailable: true
            });
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn(),
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: jest.fn(),
                getStudySessionHints: jest.fn(),
                healthCheck: mockHealthCheck
            }));
            const response = await (0, supertest_1.default)(app)
                .get('/api/ai/health')
                .set('x-user-id', 'test-user');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.service).toBe('ai-planning-service');
            expect(response.body.status).toBe('healthy');
            expect(mockHealthCheck).toHaveBeenCalled();
        });
        it('should handle service unhealthy state', async () => {
            const { AIService } = require('../../services/ai/aiService');
            const mockHealthCheck = jest.fn().mockRejectedValue(new Error('API key invalid'));
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn(),
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: jest.fn(),
                getStudySessionHints: jest.fn(),
                healthCheck: mockHealthCheck
            }));
            const response = await (0, supertest_1.default)(app)
                .get('/api/ai/health')
                .set('x-user-id', 'test-user');
            expect(response.status).toBe(503);
            expect(response.body.success).toBe(false);
            expect(response.body.status).toBe('unhealthy');
            expect(response.body.error).toBe('API key invalid');
        });
    });
    describe('Rate Limiting', () => {
        it('should apply rate limiting', async () => {
            const { AIService } = require('../../services/ai/aiService');
            AIService.mockImplementation(() => ({
                breakdownTask: jest.fn().mockResolvedValue({ subtasks: [] }),
                generateDailyStudyPlan: jest.fn(),
                getRecommendations: jest.fn(),
                getStudySessionHints: jest.fn(),
                healthCheck: jest.fn()
            }));
            // Make multiple requests quickly
            const requests = Array(12).fill(null).map(() => (0, supertest_1.default)(app)
                .post('/api/ai/task-breakdown')
                .set('x-user-id', 'test-user')
                .send({
                taskTitle: 'Study',
                complexity: 'simple'
            }));
            const responses = await Promise.all(requests);
            // Some requests should be rate limited
            const rateLimitedResponses = responses.filter(res => res.status === 429);
            expect(rateLimitedResponses.length).toBeGreaterThan(0);
            const rateLimitedResponse = rateLimitedResponses[0];
            expect(rateLimitedResponse.body.error).toBe('Too many requests');
            expect(rateLimitedResponse.body.retryAfter).toBeDefined();
        });
    });
});
//# sourceMappingURL=aiRoutes.test.js.map