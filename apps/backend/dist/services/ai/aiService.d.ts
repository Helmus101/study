import { TaskBreakdownRequest, TaskBreakdownResponse, DailyStudyPlanRequest, DailyStudyPlanResponse, RecommendationsRequest, RecommendationsResponse, StudySessionHintsRequest, StudySessionHintsResponse } from '../../types/ai';
export declare class AIService {
    private openai;
    constructor();
    private validateAcademicContent;
    private buildSystemPrompt;
    breakdownTask(request: TaskBreakdownRequest): Promise<TaskBreakdownResponse>;
    generateDailyStudyPlan(request: DailyStudyPlanRequest): Promise<DailyStudyPlanResponse>;
    getRecommendations(request: RecommendationsRequest): Promise<RecommendationsResponse>;
    getStudySessionHints(request: StudySessionHintsRequest): Promise<StudySessionHintsResponse>;
}
//# sourceMappingURL=aiService.d.ts.map