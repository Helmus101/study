"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aiService_1 = require("../services/ai/aiService");
// Mock OpenAI responses
const mockTaskBreakdownResponse = {
    choices: [{
            message: {
                content: JSON.stringify({
                    subtasks: [
                        {
                            title: "Research topic fundamentals",
                            description: "Gather initial information about the topic",
                            estimatedMinutes: 30,
                            priority: "high",
                            dependencies: []
                        },
                        {
                            title: "Create outline",
                            description: "Structure the main points and arguments",
                            estimatedMinutes: 45,
                            priority: "high",
                            dependencies: ["Research topic fundamentals"]
                        }
                    ],
                    totalEstimatedMinutes: 75,
                    complexity: "medium",
                    suggestions: ["Start with reliable sources", "Keep track of references"]
                })
            }
        }]
};
const mockDailyStudyPlanResponse = {
    choices: [{
            message: {
                content: JSON.stringify({
                    date: "2024-01-15",
                    totalStudyHours: 4,
                    blocks: [
                        {
                            startTime: "09:00",
                            endTime: "10:30",
                            subject: "Mathematics",
                            activity: "Complete calculus exercises",
                            goals: ["Finish problem set 3.1"],
                            breaks: [
                                {
                                    time: "10:30",
                                    duration: 15,
                                    type: "short"
                                }
                            ]
                        }
                    ],
                    tips: ["Review previous material before starting"],
                    warnings: ["Avoid studying similar subjects back-to-back"]
                })
            }
        }]
};
const mockRecommendationsResponse = {
    choices: [{
            message: {
                content: JSON.stringify({
                    recommendations: [
                        {
                            title: "Use Pomodoro Technique",
                            description: "Study in focused 25-minute intervals with 5-minute breaks",
                            type: "time_management",
                            actionable: true,
                            priority: "high"
                        }
                    ],
                    context: "Based on your current study patterns"
                })
            }
        }]
};
const mockStudySessionHintsResponse = {
    choices: [{
            message: {
                content: JSON.stringify({
                    hints: [
                        {
                            hint: "Focus on understanding the core concepts before memorizing formulas",
                            category: "concept",
                            importance: "high",
                            actionableSteps: ["Read the textbook chapter", "Work through examples"]
                        }
                    ],
                    sessionPlan: {
                        introduction: "Review previous lesson material",
                        mainActivities: ["Practice problems", "Concept mapping"],
                        conclusion: "Summarize key takeaways"
                    }
                })
            }
        }]
};
describe('AIService', () => {
    let aiService;
    let mockOpenAI;
    beforeEach(() => {
        aiService = new aiService_1.AIService();
        mockOpenAI = aiService.openai;
        // Reset all mocks
        jest.clearAllMocks();
    });
    describe('breakdownTask', () => {
        it('should break down a task into subtasks successfully', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockTaskBreakdownResponse);
            const request = {
                userId: 'test-user',
                taskTitle: 'Write research paper on photosynthesis',
                taskDescription: '5-page paper for biology class',
                complexity: 'medium',
                context: {
                    subjects: [
                        { id: '1', name: 'Biology', description: 'Study of living organisms' }
                    ]
                }
            };
            const result = await aiService.breakdownTask(request);
            expect(result).toHaveProperty('subtasks');
            expect(result.subtasks).toHaveLength(2);
            expect(result.subtasks[0]).toHaveProperty('title');
            expect(result.subtasks[0]).toHaveProperty('estimatedMinutes');
            expect(result).toHaveProperty('totalEstimatedMinutes');
            expect(result).toHaveProperty('complexity');
            expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(2);
        });
        it('should throw error for non-academic content', async () => {
            // Mock moderation check - flagged
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: true }]
            });
            const request = {
                userId: 'test-user',
                taskTitle: 'Plan weekend party',
                complexity: 'simple'
            };
            await expect(aiService.breakdownTask(request)).rejects.toThrow('Content validation failed');
        });
        it('should handle invalid AI response', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'invalid json response' } }]
            });
            const request = {
                userId: 'test-user',
                taskTitle: 'Study calculus',
                complexity: 'medium'
            };
            await expect(aiService.breakdownTask(request)).rejects.toThrow('Failed to parse AI response');
        });
    });
    describe('generateDailyStudyPlan', () => {
        it('should generate a daily study plan successfully', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockDailyStudyPlanResponse);
            const request = {
                userId: 'test-user',
                date: '2024-01-15',
                availableHours: 4,
                focusSubjects: ['Mathematics', 'Biology'],
                energyLevel: 'medium',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics' },
                        { id: '2', name: 'Biology' }
                    ]
                }
            };
            const result = await aiService.generateDailyStudyPlan(request);
            expect(result).toHaveProperty('date', '2024-01-15');
            expect(result).toHaveProperty('totalStudyHours', 4);
            expect(result).toHaveProperty('blocks');
            expect(result.blocks).toHaveLength(1);
            expect(result.blocks[0]).toHaveProperty('startTime');
            expect(result.blocks[0]).toHaveProperty('subject');
            expect(result).toHaveProperty('tips');
            expect(result).toHaveProperty('warnings');
        });
        it('should handle empty focus subjects', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check and response
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockDailyStudyPlanResponse);
            const request = {
                userId: 'test-user',
                date: '2024-01-15',
                availableHours: 2,
                energyLevel: 'low'
            };
            const result = await aiService.generateDailyStudyPlan(request);
            expect(result).toHaveProperty('blocks');
            expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(2);
        });
    });
    describe('getRecommendations', () => {
        it('should provide academic recommendations successfully', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockRecommendationsResponse);
            const request = {
                userId: 'test-user',
                type: 'study_tips',
                subjectId: '1',
                currentChallenge: 'Difficulty focusing during long study sessions',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics', description: 'Advanced calculus' }
                    ]
                }
            };
            const result = await aiService.getRecommendations(request);
            expect(result).toHaveProperty('recommendations');
            expect(result.recommendations).toHaveLength(1);
            expect(result.recommendations[0]).toHaveProperty('title');
            expect(result.recommendations[0]).toHaveProperty('type', 'study_tips');
            expect(result.recommendations[0]).toHaveProperty('actionable', true);
            expect(result).toHaveProperty('context');
        });
        it('should handle different recommendation types', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check and response
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockRecommendationsResponse);
            const request = {
                userId: 'test-user',
                type: 'time_management'
            };
            const result = await aiService.getRecommendations(request);
            expect(result.recommendations[0].type).toBe('time_management');
        });
    });
    describe('getStudySessionHints', () => {
        it('should provide study session hints successfully', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockStudySessionHintsResponse);
            const request = {
                userId: 'test-user',
                subjectId: '1',
                topic: 'Derivatives and limits',
                sessionDuration: 60,
                learningObjective: 'Understand the concept of derivatives',
                currentProgress: 'Completed basic calculus review',
                context: {
                    subjects: [
                        { id: '1', name: 'Mathematics', description: 'Calculus' }
                    ]
                }
            };
            const result = await aiService.getStudySessionHints(request);
            expect(result).toHaveProperty('hints');
            expect(result.hints).toHaveLength(1);
            expect(result.hints[0]).toHaveProperty('hint');
            expect(result.hints[0]).toHaveProperty('category');
            expect(result.hints[0]).toHaveProperty('importance');
            expect(result).toHaveProperty('sessionPlan');
            expect(result.sessionPlan).toHaveProperty('introduction');
            expect(result.sessionPlan).toHaveProperty('mainActivities');
            expect(result.sessionPlan).toHaveProperty('conclusion');
        });
        it('should handle minimal session hints request', async () => {
            // Mock moderation check
            mockOpenAI.moderations.create.mockResolvedValue({
                results: [{ flagged: false }]
            });
            // Mock academic content check and response
            mockOpenAI.chat.completions.create
                .mockResolvedValueOnce({
                choices: [{ message: { content: 'true' } }]
            })
                .mockResolvedValueOnce(mockStudySessionHintsResponse);
            const request = {
                userId: 'test-user',
                subjectId: '2',
                topic: 'Cell biology basics',
                sessionDuration: 30
            };
            const result = await aiService.getStudySessionHints(request);
            expect(result).toHaveProperty('hints');
            expect(result.hints[0].hint).toBeTruthy();
        });
    });
});
//# sourceMappingURL=aiService.test.js.map