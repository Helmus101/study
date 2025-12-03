import { PrismaClient } from '@prisma/client';

export interface ContextData {
  subjects: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  currentTasks: Array<{
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
  }>;
  recentNotes: Array<{
    id: string;
    title: string;
    subject: string;
    updatedAt: string;
  }>;
  studyStats: {
    totalStudyTimeThisWeek: number;
    averageSessionDuration: number;
    mostStudiedSubject: string;
    subjectsStudiedThisWeek: string[];
  };
}

export class ContextIntegrationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getContextForUser(userId: string): Promise<ContextData> {
    try {
      // Get user's subjects
      const subjects = await this.prisma.subject.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      // Get current tasks (not completed, with due dates)
      const currentTasks = await this.prisma.task.findMany({
        where: {
          userId,
          completed: false,
          OR: [
            { dueDate: { gte: new Date() } },
            { dueDate: null }
          ]
        },
        select: {
          id: true,
          title: true,
          description: true,
          priority: true,
          dueDate: true,
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' }
        ],
        take: 10,
      });

      // Get upcoming calendar events (next 7 days)
      const upcomingEvents = await this.prisma.calendarEvent.findMany({
        where: {
          userId,
          startTime: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          }
        },
        select: {
          id: true,
          title: true,
          description: true,
          startTime: true,
          endTime: true,
          location: true,
        },
        orderBy: { startTime: 'asc' },
        take: 10,
      });

      // Get recent notes (last 7 days)
      const recentNotes = await this.prisma.note.findMany({
        where: {
          userId,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        },
        select: {
          id: true,
          title: true,
          subject: {
            select: {
              name: true,
            },
          },
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      });

      // Calculate study statistics
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const studySessions = await this.prisma.studySession.findMany({
        where: {
          userId,
          startTime: { gte: weekAgo }
        },
        include: {
          subject: {
            select: { name: true }
          }
        }
      });

      const studyStats = this.calculateStudyStats(studySessions);

      // Simulate Pronote data integration
      const pronoteData = await this.simulatePronoteIntegration(userId);

      // Simulate Google data integration
      const googleData = await this.simulateGoogleIntegration(userId);

      return {
        subjects,
        currentTasks,
        upcomingEvents,
        recentNotes: recentNotes.map((note: any) => ({
          ...note,
          subject: note.subject.name,
          updatedAt: note.updatedAt.toISOString(),
        })),
        studyStats,
        // Combine simulated external data
        ...pronoteData,
        ...googleData,
      };
    } catch (error) {
      console.error('Error fetching context data:', error);
      // Return empty context if there's an error
      return {
        subjects: [],
        currentTasks: [],
        upcomingEvents: [],
        recentNotes: [],
        studyStats: {
          totalStudyTimeThisWeek: 0,
          averageSessionDuration: 0,
          mostStudiedSubject: '',
          subjectsStudiedThisWeek: [],
        },
      };
    }
  }

  private calculateStudyStats(sessions: any[]) {
    if (sessions.length === 0) {
      return {
        totalStudyTimeThisWeek: 0,
        averageSessionDuration: 0,
        mostStudiedSubject: '',
        subjectsStudiedThisWeek: [],
      };
    }

    const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    const subjectTimes = sessions.reduce((acc, session) => {
      const subjectName = session.subject.name;
      acc[subjectName] = (acc[subjectName] || 0) + session.durationMinutes;
      return acc;
    }, {} as Record<string, number>);

    const mostStudiedSubject = Object.entries(subjectTimes)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || '';

    return {
      totalStudyTimeThisWeek: totalMinutes,
      averageSessionDuration: Math.round(totalMinutes / sessions.length),
      mostStudiedSubject,
      subjectsStudiedThisWeek: Object.keys(subjectTimes),
    };
  }

  private async simulatePronoteIntegration(userId: string) {
    // Simulate Pronote data - in a real implementation, this would call Pronote API
    // For demo purposes, we'll return mock data that might come from Pronote
    
    const mockPronoteData = {
      pronoteAssignments: [
        {
          id: 'pronote-1',
          title: 'Math homework - Chapter 5 exercises',
          description: 'Complete odd-numbered problems 1-25',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          subject: 'Mathematics',
          type: 'homework'
        },
        {
          id: 'pronote-2',
          title: 'Biology lab report',
          description: 'Write up the photosynthesis experiment results',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          subject: 'Biology',
          type: 'assignment'
        }
      ],
      pronoteGrades: [
        {
          subject: 'Mathematics',
          assignment: 'Chapter 4 Quiz',
          grade: 92,
          maxGrade: 100,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          subject: 'Biology',
          assignment: 'Lab Report 1',
          grade: 88,
          maxGrade: 100,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    return mockPronoteData;
  }

  private async simulateGoogleIntegration(userId: string) {
    // Simulate Google data integration (Calendar, Drive, etc.)
    // In a real implementation, this would use Google APIs
    
    const mockGoogleData = {
      googleCalendarEvents: [
        {
          id: 'google-1',
          title: 'Study Group - Calculus',
          description: 'Group study session for upcoming exam',
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Library Room 201',
          source: 'google-calendar'
        },
        {
          id: 'google-2',
          title: 'Teacher Office Hours - Math',
          description: 'Extra help with calculus concepts',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          location: 'Math Building Room 105',
          source: 'google-calendar'
        }
      ],
      googleDriveFiles: [
        {
          id: 'drive-1',
          title: 'Calculus Study Notes.pdf',
          description: 'Comprehensive notes for calculus exam',
          subject: 'Mathematics',
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'google-drive'
        },
        {
          id: 'drive-2',
          title: 'Biology Diagrams.docx',
          description: 'Cell structure and function diagrams',
          subject: 'Biology',
          lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: 'google-drive'
        }
      ]
    };

    return mockGoogleData;
  }

  async enrichAIRequestWithcontext(userId: string, baseRequest: any) {
    const context = await this.getContextForUser(userId);
    
    return {
      ...baseRequest,
      context: {
        subjects: context.subjects,
        currentTasks: context.currentTasks,
        upcomingEvents: [
          ...context.upcomingEvents,
          ...(context as any).googleCalendarEvents || []
        ],
        recentNotes: context.recentNotes,
        studyStats: context.studyStats,
        externalData: {
          pronoteAssignments: (context as any).pronoteAssignments || [],
          pronoteGrades: (context as any).pronoteGrades || [],
          googleDriveFiles: (context as any).googleDriveFiles || []
        }
      }
    };
  }

  async close() {
    await this.prisma.$disconnect();
  }
}