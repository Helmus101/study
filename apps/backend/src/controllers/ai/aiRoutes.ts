import { Router } from 'express';
import { AIController } from './aiController';
import {
  authenticateUser,
  aiRateLimit,
  validateTaskBreakdownRequest,
  validateDailyStudyPlanRequest,
  validateRecommendationsRequest,
  validateStudySessionHintsRequest,
  aiErrorHandler,
} from '../../middleware/aiValidation';

const router = Router();
const aiController = new AIController();

// Apply authentication and rate limiting to all AI routes
router.use(authenticateUser);
router.use(aiRateLimit);

// Task breakdown endpoint
router.post('/task-breakdown', 
  validateTaskBreakdownRequest,
  aiController.breakdownTask.bind(aiController)
);

// Daily study plan generation endpoint
router.post('/daily-study-plan',
  validateDailyStudyPlanRequest,
  aiController.generateDailyStudyPlan.bind(aiController)
);

// Recommendations endpoint
router.post('/recommendations',
  validateRecommendationsRequest,
  aiController.getRecommendations.bind(aiController)
);

// Study session hints endpoint
router.post('/study-session-hints',
  validateStudySessionHintsRequest,
  aiController.getStudySessionHints.bind(aiController)
);

// AI service health check
router.get('/health',
  aiController.healthCheck.bind(aiController)
);

// Apply error handling middleware
router.use(aiErrorHandler);

export default router;