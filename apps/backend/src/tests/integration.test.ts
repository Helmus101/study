import { AIService, ContextIntegrationService } from '../services/ai';

describe('AI Service Integration Tests', () => {
  let aiService: AIService;
  let contextService: ContextIntegrationService;
  let mockOpenAI: any;

  beforeEach(() => {
    aiService = new AIService();
    contextService = new ContextIntegrationService();
    mockOpenAI = (aiService as any).openai;
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Complete Workflow Tests', () => {
    it('should handle task breakdown with context', async () => {
      // Mock all OpenAI calls
      mockOpenAI.moderations.create.mockResolvedValue({
        results: [{ flagged: false }]
      });

      mockOpenAI.chat.completions.create
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'true' } }]
        })
        .mockResolvedValueOnce({
          choices: [{
            message: {
              content: JSON.stringify({
                subtasks: [
                  {
                    title: "Research fundamentals",
                    description: "Gather initial information",
                    estimatedMinutes: 30,
                    priority: "high",
                    dependencies: []
                  }
                ],
                totalEstimatedMinutes: 30,
                complexity: "medium",
                suggestions: ["Start with reliable sources"]
              })
            }
          }]
        });

      // Mock database context
      const mockContext = {
        subjects: [
          { id: '1', name: 'Mathematics', description: 'Calculus' }
        ],
        currentTasks: [
          { id: '1', title: 'Math homework', priority: 'high' as const, dueDate: '2024-01-16' }
        ],
        upcomingEvents: [],
        recentNotes: [],
        studyStats: {
          totalStudyTimeThisWeek: 120,
          averageSessionDuration: 45,
          mostStudiedSubject: 'Mathematics',
          subjectsStudiedThisWeek: ['Mathematics']
        },
        externalData: {
          pronoteAssignments: [],
          pronoteGrades: [],
          googleDriveFiles: []
        }
      };

      // Mock context service
      jest.spyOn(contextService, 'getContextForUser').mockResolvedValue(mockContext);
      jest.spyOn(contextService, 'enrichAIRequestWithcontext').mockResolvedValue({
        userId: 'test-user',
        taskTitle: 'Study calculus derivatives',
        complexity: 'medium' as const,
        context: mockContext
      });

      const request = {
        userId: 'test-user',
        taskTitle: 'Study calculus derivatives',
        complexity: 'medium' as const
      };

      const enrichedRequest = await contextService.enrichAIRequestWithcontext('test-user', request);
      const result = await aiService.breakdownTask(enrichedRequest);

      // Verify the result
      expect(result).toHaveProperty('subtasks');
      expect(result.subtasks).toHaveLength(1);
      expect(result.subtasks[0].title).toBe('Research fundamentals');
      expect(result).toHaveProperty('totalEstimatedMinutes', 30);
      expect(result).toHaveProperty('complexity', 'medium');
      expect(result).toHaveProperty('suggestions');

      // Verify context was included
      expect(enrichedRequest.context).toBeDefined();
      expect(enrichedRequest.context.subjects).toHaveLength(1);
      expect(enrichedRequest.context.currentTasks).toHaveLength(1);
    });

    it('should reject non-academic content through guardrails', async () => {
      // Mock moderation check - flagged content
      mockOpenAI.moderations.create.mockResolvedValue({
        results: [{ flagged: true }]
      });

      const request = {
        userId: 'test-user',
        taskTitle: 'Plan weekend party',
        complexity: 'simple' as const,
        context: {}
      };

      await expect(aiService.breakdownTask(request)).rejects.toThrow('Content validation failed');
    });
  });
});