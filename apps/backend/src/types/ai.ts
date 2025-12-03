import { z } from 'zod';

// Base AI request schema
export const BaseAIRequestSchema = z.object({
  userId: z.string(),
  context: z.object({
    subjects: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
    })).optional(),
    currentTasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']),
      dueDate: z.string().optional(),
    })).optional(),
    upcomingEvents: z.array(z.object({
      id: z.string(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
  }).optional(),
});

// Task breakdown request
export const TaskBreakdownRequestSchema = BaseAIRequestSchema.extend({
  taskTitle: z.string(),
  taskDescription: z.string().optional(),
  subjectId: z.string().optional(),
  complexity: z.enum(['simple', 'medium', 'complex']).default('medium'),
});

// Daily study plan request
export const DailyStudyPlanRequestSchema = BaseAIRequestSchema.extend({
  date: z.string(),
  availableHours: z.number().min(0.5).max(16),
  focusSubjects: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  energyLevel: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Recommendations request
export const RecommendationsRequestSchema = BaseAIRequestSchema.extend({
  type: z.enum(['study_tips', 'time_management', 'subject_specific', 'motivation']),
  subjectId: z.string().optional(),
  currentChallenge: z.string().optional(),
});

// Study session hints request
export const StudySessionHintsRequestSchema = BaseAIRequestSchema.extend({
  subjectId: z.string(),
  topic: z.string(),
  sessionDuration: z.number().min(15).max(240),
  learningObjective: z.string().optional(),
  currentProgress: z.string().optional(),
});

// AI response schemas
export const SubtaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedMinutes: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
  dependencies: z.array(z.string()).optional(),
});

export const TaskBreakdownResponseSchema = z.object({
  subtasks: z.array(SubtaskSchema),
  totalEstimatedMinutes: z.number(),
  complexity: z.enum(['simple', 'medium', 'complex']),
  suggestions: z.array(z.string()).optional(),
});

export const StudyBlockSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  subject: z.string(),
  activity: z.string(),
  goals: z.array(z.string()),
  breaks: z.array(z.object({
    time: z.string(),
    duration: z.number(),
    type: z.enum(['short', 'long', 'meal']),
  })).optional(),
});

export const DailyStudyPlanResponseSchema = z.object({
  date: z.string(),
  totalStudyHours: z.number(),
  blocks: z.array(StudyBlockSchema),
  tips: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});

export const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  actionable: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
});

export const RecommendationsResponseSchema = z.object({
  recommendations: z.array(RecommendationSchema),
  context: z.string().optional(),
});

export const StudyHintSchema = z.object({
  hint: z.string(),
  category: z.enum(['concept', 'technique', 'resource', 'common_mistake']),
  importance: z.enum(['low', 'medium', 'high']),
  actionableSteps: z.array(z.string()).optional(),
});

export const StudySessionHintsResponseSchema = z.object({
  hints: z.array(StudyHintSchema),
  sessionPlan: z.object({
    introduction: z.string(),
    mainActivities: z.array(z.string()),
    conclusion: z.string(),
  }).optional(),
});

// Export types
export type BaseAIRequest = z.infer<typeof BaseAIRequestSchema>;
export type TaskBreakdownRequest = z.infer<typeof TaskBreakdownRequestSchema>;
export type DailyStudyPlanRequest = z.infer<typeof DailyStudyPlanRequestSchema>;
export type RecommendationsRequest = z.infer<typeof RecommendationsRequestSchema>;
export type StudySessionHintsRequest = z.infer<typeof StudySessionHintsRequestSchema>;

export type Subtask = z.infer<typeof SubtaskSchema>;
export type TaskBreakdownResponse = z.infer<typeof TaskBreakdownResponseSchema>;
export type StudyBlock = z.infer<typeof StudyBlockSchema>;
export type DailyStudyPlanResponse = z.infer<typeof DailyStudyPlanResponseSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;
export type StudyHint = z.infer<typeof StudyHintSchema>;
export type StudySessionHintsResponse = z.infer<typeof StudySessionHintsResponseSchema>;