import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/aiValidation';
export declare class AIController {
    private aiService;
    private contextService;
    constructor();
    breakdownTask(req: AuthenticatedRequest, res: Response): Promise<void>;
    generateDailyStudyPlan(req: AuthenticatedRequest, res: Response): Promise<void>;
    getRecommendations(req: AuthenticatedRequest, res: Response): Promise<void>;
    getStudySessionHints(req: AuthenticatedRequest, res: Response): Promise<void>;
    healthCheck(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=aiController.d.ts.map