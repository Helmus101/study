# AI Planning Service API Documentation

This document provides sample requests and responses for the AI Planning Service endpoints.

## Base URL
```
http://localhost:3001/api/ai
```

## Authentication
All endpoints require authentication. For development, use the `x-user-id` header:
```
x-user-id: test-user-123
```

## Endpoints

### 1. Task Breakdown
Breaks down academic tasks into manageable subtasks.

**POST** `/task-breakdown`

#### Sample Request
```json
{
  "taskTitle": "Write research paper on photosynthesis",
  "taskDescription": "5-page paper for AP Biology class with citations",
  "complexity": "medium",
  "context": {
    "subjects": [
      {
        "id": "bio-101",
        "name": "Biology",
        "description": "AP Biology - Plant Systems"
      }
    ],
    "currentTasks": [
      {
        "id": "task-1",
        "title": "Complete math homework",
        "priority": "high",
        "dueDate": "2024-01-16T23:59:59Z"
      }
    ],
    "upcomingEvents": [
      {
        "id": "event-1",
        "title": "Biology Test",
        "startTime": "2024-01-18T10:00:00Z",
        "endTime": "2024-01-18T11:30:00Z"
      }
    ]
  }
}
```

#### Sample Response
```json
{
  "success": true,
  "data": {
    "subtasks": [
      {
        "title": "Research photosynthesis fundamentals",
        "description": "Study the basic process of photosynthesis, light-dependent and light-independent reactions",
        "estimatedMinutes": 45,
        "priority": "high",
        "dependencies": []
      },
      {
        "title": "Find scholarly sources",
        "description": "Locate 3-5 peer-reviewed articles and reliable educational resources",
        "estimatedMinutes": 30,
        "priority": "high",
        "dependencies": ["Research photosynthesis fundamentals"]
      },
      {
        "title": "Create outline",
        "description": "Structure the paper with introduction, body paragraphs on each phase, and conclusion",
        "estimatedMinutes": 25,
        "priority": "medium",
        "dependencies": ["Find scholarly sources"]
      },
      {
        "title": "Write first draft",
        "description": "Complete the initial draft focusing on content over perfection",
        "estimatedMinutes": 60,
        "priority": "medium",
        "dependencies": ["Create outline"]
      },
      {
        "title": "Add citations and references",
        "description": "Properly cite all sources and create bibliography",
        "estimatedMinutes": 20,
        "priority": "high",
        "dependencies": ["Write first draft"]
      }
    ],
    "totalEstimatedMinutes": 180,
    "complexity": "medium",
    "suggestions": [
      "Start with reliable educational sources before diving into research papers",
      "Keep track of all sources as you research to make citation easier",
      "Consider using a citation management tool"
    ]
  }
}
```

### 2. Daily Study Plan
Generates an optimized daily study schedule.

**POST** `/daily-study-plan`

#### Sample Request
```json
{
  "date": "2024-01-15",
  "availableHours": 5,
  "focusSubjects": ["Mathematics", "Biology", "Chemistry"],
  "goals": ["Complete calculus problem set", "Review biology chapter", "Study for chemistry quiz"],
  "energyLevel": "medium",
  "context": {
    "subjects": [
      {
        "id": "math-101",
        "name": "Mathematics",
        "description": "AP Calculus AB"
      },
      {
        "id": "bio-101",
        "name": "Biology",
        "description": "AP Biology"
      },
      {
        "id": "chem-101",
        "name": "Chemistry",
        "description": "AP Chemistry"
      }
    ],
    "currentTasks": [
      {
        "id": "task-1",
        "title": "Calculus homework - derivatives",
        "priority": "high",
        "dueDate": "2024-01-16T23:59:59Z"
      }
    ],
    "upcomingEvents": [
      {
        "id": "event-1",
        "title": "Chemistry Quiz",
        "startTime": "2024-01-17T09:00:00Z",
        "endTime": "2024-01-17T09:30:00Z"
      }
    ]
  }
}
```

#### Sample Response
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalStudyHours": 5,
    "blocks": [
      {
        "startTime": "09:00",
        "endTime": "10:30",
        "subject": "Chemistry",
        "activity": "Review quiz material and practice problems",
        "goals": ["Master stoichiometry concepts", "Complete practice quiz"],
        "breaks": [
          {
            "time": "10:30",
            "duration": 15,
            "type": "short"
          }
        ]
      },
      {
        "startTime": "10:45",
        "endTime": "12:15",
        "subject": "Mathematics",
        "activity": "Complete calculus derivatives homework",
        "goals": ["Finish problem set 3.2", "Review chain rule"],
        "breaks": [
          {
            "time": "12:15",
            "duration": 45,
            "type": "meal"
          }
        ]
      },
      {
        "startTime": "13:00",
        "endTime": "14:30",
        "subject": "Biology",
        "activity": "Review photosynthesis chapter",
        "goals": ["Complete reading notes", "Create concept map"],
        "breaks": []
      }
    ],
    "tips": [
      "Study chemistry first since quiz is tomorrow",
      "Take a proper lunch break to maintain energy",
      "Use the afternoon for biology when energy is lower but focus is still needed"
    ],
    "warnings": [
      "Avoid studying calculus right after lunch when energy might be low",
      "Make sure to start chemistry review with fresh mind"
    ]
  }
}
```

### 3. Recommendations
Provides personalized academic recommendations.

**POST** `/recommendations`

#### Sample Request
```json
{
  "type": "study_tips",
  "subjectId": "math-101",
  "currentChallenge": "Struggling with understanding calculus concepts",
  "context": {
    "subjects": [
      {
        "id": "math-101",
        "name": "Mathematics",
        "description": "AP Calculus AB"
      }
    ],
    "currentTasks": [
      {
        "id": "task-1",
        "title": "Calculus derivatives practice",
        "priority": "high"
      }
    ]
  }
}
```

#### Sample Response
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "Use visual learning techniques",
        "description": "Create graphs and diagrams to visualize derivative concepts. Draw functions and their derivatives side by side to see the relationship.",
        "type": "study_tips",
        "actionable": true,
        "priority": "high"
      },
      {
        "title": "Practice with real-world applications",
        "description": "Connect calculus concepts to physics problems or real-world scenarios like velocity and acceleration to make abstract concepts more concrete.",
        "type": "study_tips",
        "actionable": true,
        "priority": "medium"
      },
      {
        "title": "Form a study group",
        "description": "Work with classmates to explain concepts to each other. Teaching others helps solidify your own understanding.",
        "type": "study_tips",
        "actionable": true,
        "priority": "medium"
      }
    ],
    "context": "Based on your challenge with calculus concepts, these recommendations focus on visual learning and practical application to improve understanding."
  }
}
```

### 4. Study Session Hints
Provides targeted hints for specific study sessions.

**POST** `/study-session-hints`

#### Sample Request
```json
{
  "subjectId": "bio-101",
  "topic": "Cellular respiration",
  "sessionDuration": 60,
  "learningObjective": "Understand the stages of cellular respiration and ATP production",
  "currentProgress": "Completed glycolysis, struggling with Krebs cycle",
  "context": {
    "subjects": [
      {
        "id": "bio-101",
        "name": "Biology",
        "description": "AP Biology"
      }
    ]
  }
}
```

#### Sample Response
```json
{
  "success": true,
  "data": {
    "hints": [
      {
        "hint": "Focus on the big picture: Cellular respiration is about breaking down glucose to make ATP",
        "category": "concept",
        "importance": "high",
        "actionableSteps": [
          "Draw the overall process showing inputs and outputs",
          "Memorize the ATP yield for each stage"
        ]
      },
      {
        "hint": "Use the acronym 'OIL RIG' for redox reactions: Oxidation Is Loss, Reduction Is Gain",
        "category": "technique",
        "importance": "medium",
        "actionableSteps": [
          "Identify what gets oxidized and reduced in each stage",
          "Track electron carriers (NADH, FADH2)"
        ]
      },
      {
        "hint": "Common mistake: Forgetting that oxygen is the final electron acceptor",
        "category": "common_mistake",
        "importance": "high",
        "actionableSteps": [
          "Always trace the path of electrons to their final destination",
          "Remember why we need to breathe oxygen"
        ]
      },
      {
        "hint": "Khan Academy's cellular respiration videos provide excellent animations",
        "category": "resource",
        "importance": "medium",
        "actionableSteps": [
          "Watch the step-by-step animations",
          "Pause and draw each stage yourself"
        ]
      }
    ],
    "sessionPlan": {
      "introduction": "Start by reviewing glycolysis since you've mastered it, then connect it to the next stages",
      "mainActivities": [
        "Create a detailed diagram of the Krebs cycle with all inputs and outputs",
        "Practice calculating total ATP production from one glucose molecule",
        "Work through practice problems identifying each stage's contribution"
      ],
      "conclusion": "Summarize the entire process by creating a flow chart and testing yourself with rapid-fire questions"
    }
  }
}
```

### 5. Health Check
Checks the health of the AI service.

**GET** `/health`

#### Sample Response (Healthy)
```json
{
  "success": true,
  "service": "ai-planning-service",
  "status": "healthy",
  "provider": "openai",
  "modelsAvailable": true
}
```

#### Sample Response (Unhealthy)
```json
{
  "success": false,
  "service": "ai-planning-service",
  "status": "unhealthy",
  "error": "OPENAI_API_KEY is not configured"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Invalid request data",
  "details": [
    {
      "field": "taskTitle",
      "message": "Required"
    },
    {
      "field": "availableHours",
      "message": "Number must be greater than or equal to 0.5"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Authentication required"
}
```

### Rate Limit Error (429)
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

### Content Validation Error (400)
```json
{
  "error": "Content validation failed",
  "message": "Your request appears to be outside the academic scope. Please ensure your request is related to education or learning."
}
```

### Service Error (500)
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred. Please try again."
}
```

## Academic Guardrails

The AI service includes strict academic guardrails:
- Only processes educational and academic content
- Rejects requests for entertainment, personal advice, or non-academic topics
- Maintains professional, educational tone in all responses
- Focuses on evidence-based learning strategies

## Rate Limiting
- 10 requests per minute per IP address
- Includes burst protection
- Automatic retry-after header included in rate limit responses