import OpenAI from 'openai';
import {
  TaskBreakdownRequest,
  TaskBreakdownResponse,
  DailyStudyPlanRequest,
  DailyStudyPlanResponse,
  RecommendationsRequest,
  RecommendationsResponse,
  StudySessionHintsRequest,
  StudySessionHintsResponse,
} from '../../types/ai';

export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async validateAcademicContent(content: string): Promise<boolean> {
    const moderationResponse = await this.openai.moderations.create({
      input: content,
    });

    // Check if content is flagged
    if (moderationResponse.results[0].flagged) {
      return false;
    }

    // Additional academic context validation
    const academicCheckResponse = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an academic content validator. Your only job is to determine if the given content is related to education, learning, or academic studies.
          
          Respond with ONLY "true" if the content is academic/educational, or "false" if it's not.
          Examples of academic content: homework help, study planning, subject explanations, learning strategies.
          Examples of non-academic content: entertainment, personal advice unrelated to learning, commercial activities.`
        },
        {
          role: 'user',
          content: `Is this content academic/educational? "${content.substring(0, 500)}..."`
        }
      ],
      max_tokens: 10,
      temperature: 0,
    });

    const response = academicCheckResponse.choices[0]?.message?.content?.toLowerCase().trim();
    return response === 'true';
  }

  private buildSystemPrompt(context: string = ''): string {
    return `You are an AI academic assistant for a study platform. Your purpose is to help students with educational planning, task management, and learning strategies.

CRITICAL RULES:
1. ONLY provide assistance related to education, learning, and academic activities
2. Decline any requests that are not academic in nature
3. Keep responses concise, actionable, and student-focused
4. Consider the student's current context and constraints
5. Provide structured, practical advice that can be immediately implemented

${context ? `STUDENT CONTEXT:\n${context}\n\n` : ''}
Always maintain a supportive, encouraging tone while being practical and realistic about study demands.`;
  }

  async breakdownTask(request: TaskBreakdownRequest): Promise<TaskBreakdownResponse> {
    const prompt = `Break down this academic task into manageable subtasks:

Task: ${request.taskTitle}
${request.taskDescription ? `Description: ${request.taskDescription}` : ''}
${request.complexity ? `Complexity Level: ${request.complexity}` : ''}

${request.context?.subjects ? `Current Subjects: ${request.context.subjects.map((s: any) => s.name).join(', ')}` : ''}
${request.context?.currentTasks ? `Other Current Tasks: ${request.context.currentTasks.map((t: any) => t.title).join(', ')}` : ''}

Provide a structured breakdown with:
1. Specific subtasks with time estimates
2. Logical ordering and dependencies
3. Priority levels for each subtask
4. Brief descriptions for clarity

Respond in JSON format:
{
  "subtasks": [
    {
      "title": "Subtask title",
      "description": "Brief description",
      "estimatedMinutes": 30,
      "priority": "high|medium|low",
      "dependencies": ["previous subtask title if any"]
    }
  ],
  "totalEstimatedMinutes": 120,
  "complexity": "simple|medium|complex",
  "suggestions": ["Additional tips or considerations"]
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    if (!(await this.validateAcademicContent(content))) {
      throw new Error('Content validation failed - request appears to be non-academic');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse AI response for task breakdown');
    }
  }

  async generateDailyStudyPlan(request: DailyStudyPlanRequest): Promise<DailyStudyPlanResponse> {
    const prompt = `Create a structured daily study plan for:

Date: ${request.date}
Available Hours: ${request.availableHours}
Energy Level: ${request.energyLevel}

${request.focusSubjects ? `Focus Subjects: ${request.focusSubjects.join(', ')}` : ''}
${request.goals ? `Goals: ${request.goals.join(', ')}` : ''}

${request.context?.subjects ? `All Subjects: ${request.context.subjects.map((s: any) => s.name).join(', ')}` : ''}
${request.context?.currentTasks ? `Current Tasks: ${request.context.currentTasks.map((t: any) => `${t.title} (${t.priority})`).join(', ')}` : ''}
${request.context?.upcomingEvents ? `Upcoming Events: ${request.context.upcomingEvents.map((e: any) => `${e.title} at ${e.startTime}`).join(', ')}` : ''}

Create a realistic, balanced study schedule that includes:
1. Specific time blocks with subjects and activities
2. Built-in breaks and rest periods
3. Clear objectives for each study block
4. Consideration of energy levels throughout the day

Respond in JSON format:
{
  "date": "${request.date}",
  "totalStudyHours": 6,
  "blocks": [
    {
      "startTime": "09:00",
      "endTime": "10:30",
      "subject": "Mathematics",
      "activity": "Complete calculus exercises",
      "goals": ["Finish problem set 3.1", "Review integration techniques"],
      "breaks": [
        {
          "time": "10:30",
          "duration": 15,
          "type": "short"
        }
      ]
    }
  ],
  "tips": ["Study tips for the day"],
  "warnings": ["Potential issues to watch out for"]
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    if (!(await this.validateAcademicContent(content))) {
      throw new Error('Content validation failed - request appears to be non-academic');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse AI response for daily study plan');
    }
  }

  async getRecommendations(request: RecommendationsRequest): Promise<RecommendationsResponse> {
    const contextInfo = request.context?.subjects?.find((s: any) => s.id === request.subjectId);
    const prompt = `Provide academic recommendations for:

Recommendation Type: ${request.type}
${request.subjectId ? `Subject: ${contextInfo?.name || 'Unknown Subject'}` : ''}
${request.currentChallenge ? `Current Challenge: ${request.currentChallenge}` : ''}

${request.context?.subjects ? `Current Subjects: ${request.context.subjects.map((s: any) => s.name).join(', ')}` : ''}
${request.context?.currentTasks ? `Current Tasks: ${request.context.currentTasks.map((t: any) => t.title).join(', ')}` : ''}

Provide specific, actionable recommendations that students can immediately implement. Focus on evidence-based learning strategies and practical advice.

Respond in JSON format:
{
  "recommendations": [
    {
      "title": "Clear recommendation title",
      "description": "Detailed explanation of the recommendation",
      "type": "${request.type}",
      "actionable": true,
      "priority": "high|medium|low"
    }
  ],
  "context": "Brief context explaining why these recommendations are relevant"
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    if (!(await this.validateAcademicContent(content))) {
      throw new Error('Content validation failed - request appears to be non-academic');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse AI response for recommendations');
    }
  }

  async getStudySessionHints(request: StudySessionHintsRequest): Promise<StudySessionHintsResponse> {
    const contextInfo = request.context?.subjects?.find((s: any) => s.id === request.subjectId);
    const prompt = `Provide study session hints for:

Subject: ${contextInfo?.name || 'Unknown Subject'}
Topic: ${request.topic}
Session Duration: ${request.sessionDuration} minutes
${request.learningObjective ? `Learning Objective: ${request.learningObjective}` : ''}
${request.currentProgress ? `Current Progress: ${request.currentProgress}` : ''}

${request.context?.subjects ? `All Subjects: ${request.context.subjects.map((s: any) => s.name).join(', ')}` : ''}

Provide targeted hints and guidance for this specific study session. Include:
1. Concept explanations or clarification points
2. Study techniques specific to this subject/topic
3. Resource suggestions
4. Common mistakes to avoid
5. Actionable steps for the session

Respond in JSON format:
{
  "hints": [
    {
      "hint": "Specific hint or guidance",
      "category": "concept|technique|resource|common_mistake",
      "importance": "high|medium|low",
      "actionableSteps": ["Step 1", "Step 2"]
    }
  ],
  "sessionPlan": {
    "introduction": "How to start the session",
    "mainActivities": ["Activity 1", "Activity 2"],
    "conclusion": "How to wrap up and review"
  }
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: this.buildSystemPrompt() },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    if (!(await this.validateAcademicContent(content))) {
      throw new Error('Content validation failed - request appears to be non-academic');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse AI response for study session hints');
    }
  }
}