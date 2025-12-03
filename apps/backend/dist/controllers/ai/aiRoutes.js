"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("./aiController");
const aiValidation_1 = require("../../middleware/aiValidation");
const router = (0, express_1.Router)();
const aiController = new aiController_1.AIController();
// Apply authentication and rate limiting to all AI routes
router.use(aiValidation_1.authenticateUser);
router.use(aiValidation_1.aiRateLimit);
// Task breakdown endpoint
router.post('/task-breakdown', aiValidation_1.validateTaskBreakdownRequest, aiController.breakdownTask.bind(aiController));
// Daily study plan generation endpoint
router.post('/daily-study-plan', aiValidation_1.validateDailyStudyPlanRequest, aiController.generateDailyStudyPlan.bind(aiController));
// Recommendations endpoint
router.post('/recommendations', aiValidation_1.validateRecommendationsRequest, aiController.getRecommendations.bind(aiController));
// Study session hints endpoint
router.post('/study-session-hints', aiValidation_1.validateStudySessionHintsRequest, aiController.getStudySessionHints.bind(aiController));
// AI service health check
router.get('/health', aiController.healthCheck.bind(aiController));
// Apply error handling middleware
router.use(aiValidation_1.aiErrorHandler);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map