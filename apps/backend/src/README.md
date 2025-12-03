# AI Planning Service

An intelligent academic planning microservice that provides AI-powered study assistance with strict educational guardrails.

## Features

### 🎯 Core AI Capabilities
- **Task Breakdown**: Decomposes academic tasks into manageable subtasks with time estimates
- **Daily Study Plans**: Generates optimized study schedules based on energy levels and priorities
- **Smart Recommendations**: Provides evidence-based learning strategies and study tips
- **Study Session Hints**: Offers targeted guidance for specific subjects and topics

### 🛡️ Academic Guardrails
- Content filtering using OpenAI's moderation API
- Academic-only validation to ensure educational focus
- Context-aware responses constrained to learning scenarios
- Automatic rejection of non-academic requests

### 🔗 Context Integration
- **Pronote Integration**: Simulated assignment and grade data
- **Google Integration**: Calendar events and Drive file context
- **Study Statistics**: Personalized insights from user's study patterns
- **Real-time Context**: Current tasks, upcoming events, and recent notes

## API Endpoints

### Task Breakdown
```
POST /api/ai/task-breakdown
```
Breaks down academic tasks into structured subtasks.

### Daily Study Plan
```
POST /api/ai/daily-study-plan
```
Creates optimized daily study schedules.

### Recommendations
```
POST /api/ai/recommendations
```
Provides personalized academic recommendations.

### Study Session Hints
```
POST /api/ai/study-session-hints
```
Offers targeted hints for specific study sessions.

### Health Check
```
GET /api/ai/health
```
Checks the health and availability of the AI service.

## Architecture

```
src/
├── controllers/ai/          # API controllers and routes
├── services/ai/            # Core AI service logic
│   ├── aiService.ts        # Main AI service with OpenAI integration
│   ├── promptTemplates.ts   # Structured prompt templates
│   ├── contextIntegration.ts # Data stitching from external sources
│   └── index.ts           # Service exports
├── middleware/             # Validation and error handling
├── types/ai.ts            # TypeScript type definitions
├── tests/                 # Comprehensive test suite
└── docs/                  # API documentation
```

## Configuration

### Environment Variables
```env
# Required
OPENAI_API_KEY=your-openai-api-key-here

# Optional
AI_RATE_LIMIT_REQUESTS_PER_MINUTE=10
AI_MAX_TOKENS_PER_REQUEST=1500
```

### Database Setup
The service integrates with the existing Prisma database schema for:
- User subjects and tasks
- Study sessions and notes
- Calendar events
- File attachments

## Usage Examples

### Task Breakdown Request
```json
{
  "taskTitle": "Write research paper on photosynthesis",
  "taskDescription": "5-page paper for AP Biology class",
  "complexity": "medium"
}
```

### Task Breakdown Response
```json
{
  "success": true,
  "data": {
    "subtasks": [
      {
        "title": "Research photosynthesis fundamentals",
        "description": "Study the basic process of photosynthesis",
        "estimatedMinutes": 45,
        "priority": "high",
        "dependencies": []
      }
    ],
    "totalEstimatedMinutes": 180,
    "complexity": "medium",
    "suggestions": ["Start with reliable educational sources"]
  }
}
```

## Testing

### Running Tests
```bash
cd apps/backend
npm test
```

### Test Coverage
- Unit tests for AI service methods
- Integration tests for complete workflows
- API endpoint testing with validation
- Error handling and edge cases
- Academic guardrail validation

### Test Structure
- `aiService.test.ts` - Core AI service tests
- `promptTemplates.test.ts` - Prompt template validation
- `aiRoutes.test.ts` - API endpoint tests
- `integration.test.ts` - End-to-end workflows

## Academic Guardrails

### Content Validation
1. **OpenAI Moderation**: Automatic filtering for inappropriate content
2. **Academic Context Check**: AI validation to ensure educational relevance
3. **Prompt Engineering**: Structured templates with academic focus
4. **Response Filtering**: Post-processing to maintain educational boundaries

### Allowed Topics
- Study strategies and techniques
- Subject-specific academic help
- Time management for education
- Learning skill development
- Academic planning and organization

### Blocked Topics
- Entertainment recommendations
- Personal advice unrelated to learning
- Commercial activities
- Social topics outside education
- Non-academic content

## Context Integration

### Data Sources
1. **Local Database**: User's subjects, tasks, and study history
2. **Pronote (Simulated)**: Assignments, grades, and academic progress
3. **Google (Simulated)**: Calendar events and study materials

### Context Enrichment
Every AI request is automatically enriched with:
- Current subjects and their descriptions
- Pending tasks with priorities and due dates
- Upcoming calendar events
- Recent study notes and materials
- Study statistics and patterns
- External academic data from integrated services

## Rate Limiting

- **Default**: 10 requests per minute per IP
- **Burst Protection**: Automatic throttling for excessive requests
- **Retry Headers**: Includes `retry-after` for rate-limited responses
- **Configurable**: Adjustable via environment variables

## Error Handling

### Response Codes
- `200` - Success
- `400` - Validation errors or content guardrail violations
- `401` - Authentication required
- `429` - Rate limit exceeded
- `500` - Internal service errors
- `503` - Service unavailable (AI provider issues)

### Error Response Format
```json
{
  "error": "Error type",
  "message": "Human-readable description",
  "details": ["Additional validation details"]
}
```

## Security

### Authentication
- Mock authentication for development (`x-user-id` header)
- Production: JWT token validation recommended
- User isolation ensures data privacy

### Data Privacy
- User data never shared between different users
- Context data filtered for academic relevance only
- No storage of AI conversations or prompts

## Performance

### Optimization
- Connection pooling for database queries
- Cached context data to reduce database calls
- Efficient prompt templates to minimize token usage
- Asynchronous processing for non-blocking operations

### Monitoring
- Health check endpoint for service monitoring
- Error logging for debugging
- Request/response logging in development mode
- Performance metrics collection ready

## Development

### Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npm run db:migrate`
4. Start development server: `npm run dev`

### Adding New AI Features
1. Define request/response types in `types/ai.ts`
2. Create prompt template in `promptTemplates.ts`
3. Implement service method in `aiService.ts`
4. Add validation middleware
5. Create controller endpoint
6. Write comprehensive tests
7. Update API documentation

## Production Deployment

### Requirements
- OpenAI API key with sufficient quota
- PostgreSQL database connection
- Environment variables configured
- Rate limiting appropriately set
- Monitoring and logging configured

### Scaling Considerations
- Horizontal scaling with load balancer
- Redis for distributed rate limiting
- Database connection pooling
- AI service monitoring and alerting
- Graceful degradation for AI provider outages

## License

This service is part of the Study Platform project and follows the same licensing terms.