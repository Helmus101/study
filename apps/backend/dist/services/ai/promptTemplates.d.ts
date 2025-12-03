export declare class PromptTemplates {
    private static readonly ACADEMIC_GUARDRAIL;
    private static readonly CONTEXT_PREFIX;
    static taskBreakdown(request: {
        taskTitle: string;
        taskDescription?: string;
        complexity: string;
        context?: any;
    }): string;
    static dailyStudyPlan(request: {
        date: string;
        availableHours: number;
        focusSubjects?: string[];
        goals?: string[];
        energyLevel: string;
        context?: any;
    }): string;
    static recommendations(request: {
        type: string;
        subjectId?: string;
        currentChallenge?: string;
        context?: any;
    }): string;
    static studySessionHints(request: {
        subjectId: string;
        topic: string;
        sessionDuration: number;
        learningObjective?: string;
        currentProgress?: string;
        context?: any;
    }): string;
    static academicValidation(content: string): string;
}
//# sourceMappingURL=promptTemplates.d.ts.map