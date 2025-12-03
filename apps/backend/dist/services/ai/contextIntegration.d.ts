export interface ContextData {
    subjects: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
    currentTasks: Array<{
        id: string;
        title: string;
        description?: string;
        priority: 'low' | 'medium' | 'high';
        dueDate?: string;
    }>;
    upcomingEvents: Array<{
        id: string;
        title: string;
        description?: string;
        startTime: string;
        endTime: string;
        location?: string;
    }>;
    recentNotes: Array<{
        id: string;
        title: string;
        subject: string;
        updatedAt: string;
    }>;
    studyStats: {
        totalStudyTimeThisWeek: number;
        averageSessionDuration: number;
        mostStudiedSubject: string;
        subjectsStudiedThisWeek: string[];
    };
}
export declare class ContextIntegrationService {
    private prisma;
    constructor();
    getContextForUser(userId: string): Promise<ContextData>;
    private calculateStudyStats;
    private simulatePronoteIntegration;
    private simulateGoogleIntegration;
    enrichAIRequestWithcontext(userId: string, baseRequest: any): Promise<any>;
    close(): Promise<void>;
}
//# sourceMappingURL=contextIntegration.d.ts.map