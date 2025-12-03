import { z } from 'zod';
export declare const BaseAIRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    context: z.ZodOptional<z.ZodObject<{
        subjects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description?: string | undefined;
        }, {
            id: string;
            name: string;
            description?: string | undefined;
        }>, "many">>;
        currentTasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }>, "many">>;
        upcomingEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
}, {
    userId: string;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
}>;
export declare const TaskBreakdownRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    context: z.ZodOptional<z.ZodObject<{
        subjects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description?: string | undefined;
        }, {
            id: string;
            name: string;
            description?: string | undefined;
        }>, "many">>;
        currentTasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }>, "many">>;
        upcomingEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>>;
} & {
    taskTitle: z.ZodString;
    taskDescription: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodOptional<z.ZodString>;
    complexity: z.ZodDefault<z.ZodEnum<["simple", "medium", "complex"]>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    taskTitle: string;
    complexity: "medium" | "simple" | "complex";
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    taskDescription?: string | undefined;
    subjectId?: string | undefined;
}, {
    userId: string;
    taskTitle: string;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    taskDescription?: string | undefined;
    subjectId?: string | undefined;
    complexity?: "medium" | "simple" | "complex" | undefined;
}>;
export declare const DailyStudyPlanRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    context: z.ZodOptional<z.ZodObject<{
        subjects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description?: string | undefined;
        }, {
            id: string;
            name: string;
            description?: string | undefined;
        }>, "many">>;
        currentTasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }>, "many">>;
        upcomingEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>>;
} & {
    date: z.ZodString;
    availableHours: z.ZodNumber;
    focusSubjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    goals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    energyLevel: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    date: string;
    availableHours: number;
    energyLevel: "low" | "medium" | "high";
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    focusSubjects?: string[] | undefined;
    goals?: string[] | undefined;
}, {
    userId: string;
    date: string;
    availableHours: number;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    focusSubjects?: string[] | undefined;
    goals?: string[] | undefined;
    energyLevel?: "low" | "medium" | "high" | undefined;
}>;
export declare const RecommendationsRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    context: z.ZodOptional<z.ZodObject<{
        subjects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description?: string | undefined;
        }, {
            id: string;
            name: string;
            description?: string | undefined;
        }>, "many">>;
        currentTasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }>, "many">>;
        upcomingEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>>;
} & {
    type: z.ZodEnum<["study_tips", "time_management", "subject_specific", "motivation"]>;
    subjectId: z.ZodOptional<z.ZodString>;
    currentChallenge: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    type: "study_tips" | "time_management" | "subject_specific" | "motivation";
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    subjectId?: string | undefined;
    currentChallenge?: string | undefined;
}, {
    userId: string;
    type: "study_tips" | "time_management" | "subject_specific" | "motivation";
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    subjectId?: string | undefined;
    currentChallenge?: string | undefined;
}>;
export declare const StudySessionHintsRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    context: z.ZodOptional<z.ZodObject<{
        subjects: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description?: string | undefined;
        }, {
            id: string;
            name: string;
            description?: string | undefined;
        }>, "many">>;
        currentTasks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            dueDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }, {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }>, "many">>;
        upcomingEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }, {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }, {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    }>>;
} & {
    subjectId: z.ZodString;
    topic: z.ZodString;
    sessionDuration: z.ZodNumber;
    learningObjective: z.ZodOptional<z.ZodString>;
    currentProgress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    subjectId: string;
    topic: string;
    sessionDuration: number;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    learningObjective?: string | undefined;
    currentProgress?: string | undefined;
}, {
    userId: string;
    subjectId: string;
    topic: string;
    sessionDuration: number;
    context?: {
        subjects?: {
            id: string;
            name: string;
            description?: string | undefined;
        }[] | undefined;
        currentTasks?: {
            id: string;
            title: string;
            priority: "low" | "medium" | "high";
            description?: string | undefined;
            dueDate?: string | undefined;
        }[] | undefined;
        upcomingEvents?: {
            id: string;
            title: string;
            startTime: string;
            endTime: string;
        }[] | undefined;
    } | undefined;
    learningObjective?: string | undefined;
    currentProgress?: string | undefined;
}>;
export declare const SubtaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    estimatedMinutes: z.ZodNumber;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    priority: "low" | "medium" | "high";
    estimatedMinutes: number;
    dependencies?: string[] | undefined;
}, {
    description: string;
    title: string;
    priority: "low" | "medium" | "high";
    estimatedMinutes: number;
    dependencies?: string[] | undefined;
}>;
export declare const TaskBreakdownResponseSchema: z.ZodObject<{
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        estimatedMinutes: z.ZodNumber;
        priority: z.ZodEnum<["low", "medium", "high"]>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        estimatedMinutes: number;
        dependencies?: string[] | undefined;
    }, {
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        estimatedMinutes: number;
        dependencies?: string[] | undefined;
    }>, "many">;
    totalEstimatedMinutes: z.ZodNumber;
    complexity: z.ZodEnum<["simple", "medium", "complex"]>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    complexity: "medium" | "simple" | "complex";
    subtasks: {
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        estimatedMinutes: number;
        dependencies?: string[] | undefined;
    }[];
    totalEstimatedMinutes: number;
    suggestions?: string[] | undefined;
}, {
    complexity: "medium" | "simple" | "complex";
    subtasks: {
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        estimatedMinutes: number;
        dependencies?: string[] | undefined;
    }[];
    totalEstimatedMinutes: number;
    suggestions?: string[] | undefined;
}>;
export declare const StudyBlockSchema: z.ZodObject<{
    startTime: z.ZodString;
    endTime: z.ZodString;
    subject: z.ZodString;
    activity: z.ZodString;
    goals: z.ZodArray<z.ZodString, "many">;
    breaks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        duration: z.ZodNumber;
        type: z.ZodEnum<["short", "long", "meal"]>;
    }, "strip", z.ZodTypeAny, {
        type: "short" | "long" | "meal";
        time: string;
        duration: number;
    }, {
        type: "short" | "long" | "meal";
        time: string;
        duration: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    endTime: string;
    goals: string[];
    subject: string;
    activity: string;
    breaks?: {
        type: "short" | "long" | "meal";
        time: string;
        duration: number;
    }[] | undefined;
}, {
    startTime: string;
    endTime: string;
    goals: string[];
    subject: string;
    activity: string;
    breaks?: {
        type: "short" | "long" | "meal";
        time: string;
        duration: number;
    }[] | undefined;
}>;
export declare const DailyStudyPlanResponseSchema: z.ZodObject<{
    date: z.ZodString;
    totalStudyHours: z.ZodNumber;
    blocks: z.ZodArray<z.ZodObject<{
        startTime: z.ZodString;
        endTime: z.ZodString;
        subject: z.ZodString;
        activity: z.ZodString;
        goals: z.ZodArray<z.ZodString, "many">;
        breaks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            time: z.ZodString;
            duration: z.ZodNumber;
            type: z.ZodEnum<["short", "long", "meal"]>;
        }, "strip", z.ZodTypeAny, {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }, {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        startTime: string;
        endTime: string;
        goals: string[];
        subject: string;
        activity: string;
        breaks?: {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }[] | undefined;
    }, {
        startTime: string;
        endTime: string;
        goals: string[];
        subject: string;
        activity: string;
        breaks?: {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }[] | undefined;
    }>, "many">;
    tips: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    warnings: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    date: string;
    totalStudyHours: number;
    blocks: {
        startTime: string;
        endTime: string;
        goals: string[];
        subject: string;
        activity: string;
        breaks?: {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }[] | undefined;
    }[];
    tips?: string[] | undefined;
    warnings?: string[] | undefined;
}, {
    date: string;
    totalStudyHours: number;
    blocks: {
        startTime: string;
        endTime: string;
        goals: string[];
        subject: string;
        activity: string;
        breaks?: {
            type: "short" | "long" | "meal";
            time: string;
            duration: number;
        }[] | undefined;
    }[];
    tips?: string[] | undefined;
    warnings?: string[] | undefined;
}>;
export declare const RecommendationSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodString;
    actionable: z.ZodBoolean;
    priority: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    type: string;
    description: string;
    title: string;
    priority: "low" | "medium" | "high";
    actionable: boolean;
}, {
    type: string;
    description: string;
    title: string;
    priority: "low" | "medium" | "high";
    actionable: boolean;
}>;
export declare const RecommendationsResponseSchema: z.ZodObject<{
    recommendations: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        type: z.ZodString;
        actionable: z.ZodBoolean;
        priority: z.ZodEnum<["low", "medium", "high"]>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        actionable: boolean;
    }, {
        type: string;
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        actionable: boolean;
    }>, "many">;
    context: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    recommendations: {
        type: string;
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        actionable: boolean;
    }[];
    context?: string | undefined;
}, {
    recommendations: {
        type: string;
        description: string;
        title: string;
        priority: "low" | "medium" | "high";
        actionable: boolean;
    }[];
    context?: string | undefined;
}>;
export declare const StudyHintSchema: z.ZodObject<{
    hint: z.ZodString;
    category: z.ZodEnum<["concept", "technique", "resource", "common_mistake"]>;
    importance: z.ZodEnum<["low", "medium", "high"]>;
    actionableSteps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    hint: string;
    category: "concept" | "technique" | "resource" | "common_mistake";
    importance: "low" | "medium" | "high";
    actionableSteps?: string[] | undefined;
}, {
    hint: string;
    category: "concept" | "technique" | "resource" | "common_mistake";
    importance: "low" | "medium" | "high";
    actionableSteps?: string[] | undefined;
}>;
export declare const StudySessionHintsResponseSchema: z.ZodObject<{
    hints: z.ZodArray<z.ZodObject<{
        hint: z.ZodString;
        category: z.ZodEnum<["concept", "technique", "resource", "common_mistake"]>;
        importance: z.ZodEnum<["low", "medium", "high"]>;
        actionableSteps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        hint: string;
        category: "concept" | "technique" | "resource" | "common_mistake";
        importance: "low" | "medium" | "high";
        actionableSteps?: string[] | undefined;
    }, {
        hint: string;
        category: "concept" | "technique" | "resource" | "common_mistake";
        importance: "low" | "medium" | "high";
        actionableSteps?: string[] | undefined;
    }>, "many">;
    sessionPlan: z.ZodOptional<z.ZodObject<{
        introduction: z.ZodString;
        mainActivities: z.ZodArray<z.ZodString, "many">;
        conclusion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        introduction: string;
        mainActivities: string[];
        conclusion: string;
    }, {
        introduction: string;
        mainActivities: string[];
        conclusion: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    hints: {
        hint: string;
        category: "concept" | "technique" | "resource" | "common_mistake";
        importance: "low" | "medium" | "high";
        actionableSteps?: string[] | undefined;
    }[];
    sessionPlan?: {
        introduction: string;
        mainActivities: string[];
        conclusion: string;
    } | undefined;
}, {
    hints: {
        hint: string;
        category: "concept" | "technique" | "resource" | "common_mistake";
        importance: "low" | "medium" | "high";
        actionableSteps?: string[] | undefined;
    }[];
    sessionPlan?: {
        introduction: string;
        mainActivities: string[];
        conclusion: string;
    } | undefined;
}>;
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
//# sourceMappingURL=ai.d.ts.map