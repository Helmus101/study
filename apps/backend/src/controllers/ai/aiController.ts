import { Response } from 'express';
import { AIService, ContextIntegrationService } from '../../services/ai';
import { AuthenticatedRequest } from '../../middleware/aiValidation';

export class AIController {
  private aiService: AIService;
  private contextService: ContextIntegrationService;

  constructor() {
    this.aiService = new AIService();
    this.contextService = new ContextIntegrationService();
  }

  async breakdownTask(req: AuthenticatedRequest, res: Response) {
    try {
      const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(
        req.user!.id, 
        req.body
      );
      const result = await this.aiService.breakdownTask(enrichedRequest);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  async generateDailyStudyPlan(req: AuthenticatedRequest, res: Response) {
    try {
      const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(
        req.user!.id, 
        req.body
      );
      const result = await this.aiService.generateDailyStudyPlan(enrichedRequest);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  async getRecommendations(req: AuthenticatedRequest, res: Response) {
    try {
      const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(
        req.user!.id, 
        req.body
      );
      const result = await this.aiService.getRecommendations(enrichedRequest);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  async getStudySessionHints(req: AuthenticatedRequest, res: Response) {
    try {
      const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(
        req.user!.id, 
        req.body
      );
      const result = await this.aiService.getStudySessionHints(enrichedRequest);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }

  async healthCheck(req: AuthenticatedRequest, res: Response) {
    try {
      // Test if OpenAI API is accessible
      const testResponse = await this.aiService['openai'].models.list();
      
      res.json({
        success: true,
        service: 'ai-planning-service',
        status: 'healthy',
        provider: 'openai',
        modelsAvailable: testResponse.data.length > 0,
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        service: 'ai-planning-service',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}