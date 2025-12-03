"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_1 = require("../../services/ai");
class AIController {
    constructor() {
        this.aiService = new ai_1.AIService();
        this.contextService = new ai_1.ContextIntegrationService();
    }
    async breakdownTask(req, res) {
        try {
            const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(req.user.id, req.body);
            const result = await this.aiService.breakdownTask(enrichedRequest);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async generateDailyStudyPlan(req, res) {
        try {
            const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(req.user.id, req.body);
            const result = await this.aiService.generateDailyStudyPlan(enrichedRequest);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getRecommendations(req, res) {
        try {
            const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(req.user.id, req.body);
            const result = await this.aiService.getRecommendations(enrichedRequest);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getStudySessionHints(req, res) {
        try {
            const enrichedRequest = await this.contextService.enrichAIRequestWithcontext(req.user.id, req.body);
            const result = await this.aiService.getStudySessionHints(enrichedRequest);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async healthCheck(req, res) {
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
        }
        catch (error) {
            res.status(503).json({
                success: false,
                service: 'ai-planning-service',
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
exports.AIController = AIController;
//# sourceMappingURL=aiController.js.map