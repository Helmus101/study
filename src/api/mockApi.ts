import type { DashboardResponse, TasksResponse, StudySession, UserPreferences, ComponentLayout } from '../types'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  getDashboard: async (): Promise<DashboardResponse> => {
    await delay(500)
    return {
      insights: [
        {
          id: '1',
          title: 'Upcoming Math Exam',
          summary: 'Your Math exam is in 3 days. AI recommends reviewing chapters 4-6.',
          source: 'pronote',
          sentiment: 'warning',
          tags: ['exam', 'math'],
          actionLabel: 'Review Now'
        },
        {
          id: '2',
          title: 'Collaborative Essay Progress',
          summary: 'Sarah updated the shared Google Doc. 2 new sections added.',
          source: 'google',
          sentiment: 'positive',
          tags: ['essay', 'collaboration']
        },
        {
          id: '3',
          title: 'Focus Time Opportunity',
          summary: 'AI detected a 2-hour window tomorrow morning for deep work.',
          source: 'ai',
          sentiment: 'positive',
          tags: ['focus', 'scheduling']
        },
        {
          id: '4',
          title: 'Chemistry Notes Need Review',
          summary: 'You haven\'t opened your Chemistry notes in 5 days.',
          source: 'ai',
          sentiment: 'neutral',
          tags: ['chemistry', 'review']
        }
      ],
      plan: [
        {
          id: 'p1',
          title: 'Morning Focus Block',
          timeframe: 'morning',
          tasks: 3,
          completion: 0,
          focus: 'Mathematics',
          recommendedStart: '09:00'
        },
        {
          id: 'p2',
          title: 'Collaboration Time',
          timeframe: 'afternoon',
          tasks: 2,
          completion: 1,
          focus: 'Essay Writing',
          recommendedStart: '14:00'
        },
        {
          id: 'p3',
          title: 'Review & Consolidate',
          timeframe: 'evening',
          tasks: 4,
          completion: 0,
          focus: 'Mixed Subjects',
          recommendedStart: '18:30'
        }
      ],
      analytics: {
        focusScore: 78,
        energyLevel: 65,
        pronoteSyncLevel: 95,
        googleDocsSynced: 12,
        aiInsightsToday: 8
      }
    }
  },

  getTasks: async (): Promise<TasksResponse> => {
    await delay(400)
    return {
      today: [
        {
          id: 't1',
          title: 'Complete Math homework Chapter 5',
          description: 'Exercises 1-15, focus on quadratic equations',
          dueDate: new Date().toISOString(),
          status: 'in_progress',
          priority: 'high',
          pronote: true,
          course: 'Mathematics',
          tags: ['homework', 'math'],
          aiGeneratedSubtasks: [
            { id: 's1', label: 'Read theory section', isDone: true, source: 'ai', confidence: 0.9 },
            { id: 's2', label: 'Complete exercises 1-7', isDone: true, source: 'ai', confidence: 0.85 },
            { id: 's3', label: 'Complete exercises 8-15', isDone: false, source: 'ai', confidence: 0.88 }
          ],
          attachments: ['math_ch5.pdf'],
          hasGoogleDoc: false
        },
        {
          id: 't2',
          title: 'Review Chemistry notes',
          description: 'Prepare for next week\'s lab',
          dueDate: new Date().toISOString(),
          status: 'todo',
          priority: 'medium',
          pronote: false,
          tags: ['review', 'chemistry'],
          aiGeneratedSubtasks: [
            { id: 's4', label: 'Read lab instructions', isDone: false, source: 'ai', confidence: 0.82 },
            { id: 's5', label: 'Summarize safety protocols', isDone: false, source: 'ai', confidence: 0.91 }
          ],
          attachments: [],
          hasGoogleDoc: true
        }
      ],
      week: [
        {
          id: 't3',
          title: 'History essay draft',
          description: 'First draft of WWI essay',
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
          status: 'in_progress',
          priority: 'high',
          pronote: true,
          course: 'History',
          tags: ['essay', 'writing'],
          aiGeneratedSubtasks: [
            { id: 's6', label: 'Create outline', isDone: true, source: 'ai', confidence: 0.93 },
            { id: 's7', label: 'Write introduction', isDone: false, source: 'ai', confidence: 0.87 },
            { id: 's8', label: 'Draft body paragraphs', isDone: false, source: 'ai', confidence: 0.89 }
          ],
          attachments: ['wwi_sources.pdf', 'essay_rubric.pdf'],
          hasGoogleDoc: true
        }
      ],
      upcoming: [
        {
          id: 't4',
          title: 'Physics problem set',
          description: 'Thermodynamics chapter exercises',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          status: 'todo',
          priority: 'medium',
          pronote: true,
          course: 'Physics',
          tags: ['homework', 'physics'],
          aiGeneratedSubtasks: [],
          attachments: [],
          hasGoogleDoc: false
        }
      ],
      overdue: [
        {
          id: 't5',
          title: 'English reading assignment',
          description: 'Chapters 3-5 of "To Kill a Mockingbird"',
          dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          status: 'overdue',
          priority: 'high',
          pronote: true,
          course: 'English',
          tags: ['reading', 'literature'],
          aiGeneratedSubtasks: [
            { id: 's9', label: 'Read Chapter 3', isDone: true, source: 'ai', confidence: 0.95 },
            { id: 's10', label: 'Read Chapter 4', isDone: false, source: 'ai', confidence: 0.95 },
            { id: 's11', label: 'Read Chapter 5', isDone: false, source: 'ai', confidence: 0.95 }
          ],
          attachments: [],
          hasGoogleDoc: false
        }
      ]
    }
  },

  getStudySession: async (sessionId: string): Promise<StudySession> => {
    await delay(600)
    return {
      id: sessionId,
      docId: 'gdoc-123',
      docTitle: 'History Essay - World War I Analysis',
      docOwner: 'student@school.edu',
      docContent: '# World War I Analysis\n\n## Introduction\nThe Great War, known as World War I, fundamentally reshaped the political landscape of Europe...\n\n## Main Body\n[Write your analysis here]',
      focusArea: 'History Essay',
      aiSuggestions: [
        'Consider adding more context about the Treaty of Versailles',
        'Your introduction could benefit from a stronger thesis statement',
        'Link this paragraph to your previous point about nationalism'
      ],
      calendar: [
        { date: new Date().toISOString(), focus: 'Essay draft', workload: 7, highlightedTaskId: 't3' },
        { date: new Date(Date.now() + 86400000).toISOString(), focus: 'Math homework', workload: 5 },
        { date: new Date(Date.now() + 2 * 86400000).toISOString(), focus: 'Review', workload: 4 }
      ],
      checklist: [
        { id: 'c1', label: 'Draft introduction', completed: true },
        { id: 'c2', label: 'Research sources', completed: true },
        { id: 'c3', label: 'Write body paragraph 1', completed: false },
        { id: 'c4', label: 'Write body paragraph 2', completed: false },
        { id: 'c5', label: 'Draft conclusion', completed: false }
      ],
      environment: {
        music: 'Classical Study Mix',
        pomodoroPhase: 'focus',
        pomodoroRemaining: 1500,
        scene: 'Cozy Library'
      },
      attachments: [
        { id: 'a1', name: 'WWI_sources.pdf', type: 'pdf', updatedAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'a2', name: 'essay_rubric.pdf', type: 'pdf', updatedAt: new Date(Date.now() - 7200000).toISOString() },
        { id: 'a3', name: 'Research notes', type: 'doc', updatedAt: new Date(Date.now() - 1800000).toISOString() }
      ],
      flashcards: [
        { id: 'f1', prompt: 'What year did WWI begin?', confidence: 'solid' },
        { id: 'f2', prompt: 'Name three major causes of WWI', confidence: 'wobbly' },
        { id: 'f3', prompt: 'What was the Schlieffen Plan?', confidence: 'unknown' }
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which event directly triggered WWI?',
          options: [
            'Sinking of Lusitania',
            'Assassination of Archduke Franz Ferdinand',
            'German invasion of Belgium',
            'Treaty of Versailles'
          ],
          answer: 1
        }
      ]
    }
  },

  updateTask: async (taskId: string, status: string): Promise<void> => {
    await delay(300)
    console.log(`Mock API: Updated task ${taskId} to ${status}`)
  },

  updateSubtask: async (taskId: string, subtaskId: string, isDone: boolean): Promise<void> => {
    await delay(200)
    console.log(`Mock API: Updated subtask ${subtaskId} in task ${taskId} to ${isDone}`)
  },

  updateDocContent: async (docId: string, content: string): Promise<void> => {
    await delay(400)
    console.log(`Mock API: Updated doc ${docId} with ${content.length} characters`)
  },

  updateChecklistItem: async (itemId: string, completed: boolean): Promise<void> => {
    await delay(200)
    console.log(`Mock API: Updated checklist item ${itemId} to ${completed}`)
  },

  updateEnvironment: async (environment: Partial<StudySession['environment']>): Promise<void> => {
    await delay(250)
    console.log('Mock API: Updated environment', environment)
  },

  sendAiPrompt: async (prompt: string): Promise<{ response: string }> => {
    await delay(500)
    const response = `AI is thinking about: "${prompt}"`
    console.log('Mock API: AI prompt processed', { prompt })
    return { response }
  },

  // User Preferences API
  getUserPreferences: async (userId: string): Promise<UserPreferences> => {
    await delay(300)
    // Default layout configuration
    const defaultLayout: ComponentLayout[] = [
      {
        id: 'ai-assistant',
        x: 0,
        y: 0,
        width: 384,
        height: 600,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
        minSize: { width: 300, height: 400 },
        maxSize: { width: 500, height: 800 }
      },
      {
        id: 'doc-editor',
        x: 384,
        y: 0,
        width: 600,
        height: 500,
        zIndex: 2,
        isDraggable: true,
        isResizable: true,
        minSize: { width: 400, height: 300 },
        maxSize: { width: 1200, height: 800 }
      },
      {
        id: 'right-panel',
        x: 984,
        y: 0,
        width: 384,
        height: 600,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
        minSize: { width: 300, height: 400 },
        maxSize: { width: 500, height: 800 }
      },
      {
        id: 'file-viewer',
        x: 384,
        y: 500,
        width: 600,
        height: 200,
        zIndex: 3,
        isDraggable: true,
        isResizable: true,
        minSize: { width: 400, height: 150 },
        maxSize: { width: 1200, height: 400 }
      },
      {
        id: 'environment-controls',
        x: 0,
        y: 600,
        width: 1368,
        height: 80,
        zIndex: 4,
        isDraggable: false,
        isResizable: false
      }
    ]

    return {
      id: 'pref-1',
      userId,
      canvasLayout: defaultLayout,
      theme: 'auto',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },

  updateUserPreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    await delay(400)
    console.log('Mock API: Updated user preferences', { userId, preferences })
    const existing = await mockApi.getUserPreferences(userId)
    return {
      ...existing,
      ...preferences,
      updatedAt: new Date()
    }
  },

  updateCanvasLayout: async (userId: string, layout: ComponentLayout[]): Promise<UserPreferences> => {
    await delay(300)
    console.log('Mock API: Updated canvas layout', { userId, layoutCount: layout.length })
    return mockApi.updateUserPreferences(userId, { canvasLayout: layout })
  }
}
