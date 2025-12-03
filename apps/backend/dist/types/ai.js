"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySessionHintsResponseSchema = exports.StudyHintSchema = exports.RecommendationsResponseSchema = exports.RecommendationSchema = exports.DailyStudyPlanResponseSchema = exports.StudyBlockSchema = exports.TaskBreakdownResponseSchema = exports.SubtaskSchema = exports.StudySessionHintsRequestSchema = exports.RecommendationsRequestSchema = exports.DailyStudyPlanRequestSchema = exports.TaskBreakdownRequestSchema = exports.BaseAIRequestSchema = void 0;
const zod_1 = require("zod");
// Base AI request schema
exports.BaseAIRequestSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    context: zod_1.z.object({
        subjects: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            description: zod_1.z.string().optional(),
        })).optional(),
        currentTasks: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            title: zod_1.z.string(),
            description: zod_1.z.string().optional(),
            priority: zod_1.z.enum(['low', 'medium', 'high']),
            dueDate: zod_1.z.string().optional(),
        })).optional(),
        upcomingEvents: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            title: zod_1.z.string(),
            startTime: zod_1.z.string(),
            endTime: zod_1.z.string(),
        })).optional(),
    }).optional(),
});
// Task breakdown request
exports.TaskBreakdownRequestSchema = exports.BaseAIRequestSchema.extend({
    taskTitle: zod_1.z.string(),
    taskDescription: zod_1.z.string().optional(),
    subjectId: zod_1.z.string().optional(),
    complexity: zod_1.z.enum(['simple', 'medium', 'complex']).default('medium'),
});
// Daily study plan request
exports.DailyStudyPlanRequestSchema = exports.BaseAIRequestSchema.extend({
    date: zod_1.z.string(),
    availableHours: zod_1.z.number().min(0.5).max(16),
    focusSubjects: zod_1.z.array(zod_1.z.string()).optional(),
    goals: zod_1.z.array(zod_1.z.string()).optional(),
    energyLevel: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
});
// Recommendations request
exports.RecommendationsRequestSchema = exports.BaseAIRequestSchema.extend({
    type: zod_1.z.enum(['study_tips', 'time_management', 'subject_specific', 'motivation']),
    subjectId: zod_1.z.string().optional(),
    currentChallenge: zod_1.z.string().optional(),
});
// Study session hints request
exports.StudySessionHintsRequestSchema = exports.BaseAIRequestSchema.extend({
    subjectId: zod_1.z.string(),
    topic: zod_1.z.string(),
    sessionDuration: zod_1.z.number().min(15).max(240),
    learningObjective: zod_1.z.string().optional(),
    currentProgress: zod_1.z.string().optional(),
});
// AI response schemas
exports.SubtaskSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    estimatedMinutes: zod_1.z.number(),
    priority: zod_1.z.enum(['low', 'medium', 'high']),
    dependencies: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.TaskBreakdownResponseSchema = zod_1.z.object({
    subtasks: zod_1.z.array(exports.SubtaskSchema),
    totalEstimatedMinutes: zod_1.z.number(),
    complexity: zod_1.z.enum(['simple', 'medium', 'complex']),
    suggestions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.StudyBlockSchema = zod_1.z.object({
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    subject: zod_1.z.string(),
    activity: zod_1.z.string(),
    goals: zod_1.z.array(zod_1.z.string()),
    breaks: zod_1.z.array(zod_1.z.object({
        time: zod_1.z.string(),
        duration: zod_1.z.number(),
        type: zod_1.z.enum(['short', 'long', 'meal']),
    })).optional(),
});
exports.DailyStudyPlanResponseSchema = zod_1.z.object({
    date: zod_1.z.string(),
    totalStudyHours: zod_1.z.number(),
    blocks: zod_1.z.array(exports.StudyBlockSchema),
    tips: zod_1.z.array(zod_1.z.string()).optional(),
    warnings: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.RecommendationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    type: zod_1.z.string(),
    actionable: zod_1.z.boolean(),
    priority: zod_1.z.enum(['low', 'medium', 'high']),
});
exports.RecommendationsResponseSchema = zod_1.z.object({
    recommendations: zod_1.z.array(exports.RecommendationSchema),
    context: zod_1.z.string().optional(),
});
exports.StudyHintSchema = zod_1.z.object({
    hint: zod_1.z.string(),
    category: zod_1.z.enum(['concept', 'technique', 'resource', 'common_mistake']),
    importance: zod_1.z.enum(['low', 'medium', 'high']),
    actionableSteps: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.StudySessionHintsResponseSchema = zod_1.z.object({
    hints: zod_1.z.array(exports.StudyHintSchema),
    sessionPlan: zod_1.z.object({
        introduction: zod_1.z.string(),
        mainActivities: zod_1.z.array(zod_1.z.string()),
        conclusion: zod_1.z.string(),
    }).optional(),
});
//# sourceMappingURL=ai.js.map