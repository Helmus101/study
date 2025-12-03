import { GoogleAuthService } from './auth';
import { GoogleDocsService } from './docsService';
import { GoogleDriveService } from './driveService';
import { GoogleCalendarService } from './calendarService';
import { GoogleTokenRepository } from './tokenRepository';
import { TaskNoteRepository } from './taskNoteRepository';
import { CalendarEventRepository } from './calendarRepository';
import { TaskRecord } from '../types';
import { logger } from '../logger';

export class GoogleSyncService {
  constructor(
    private authService: GoogleAuthService,
    private docsService: GoogleDocsService,
    private driveService: GoogleDriveService,
    private calendarService: GoogleCalendarService,
    private tokenRepo: GoogleTokenRepository,
    private taskNoteRepo: TaskNoteRepository,
    private calendarRepo: CalendarEventRepository
  ) {}

  async syncTaskNote(task: TaskRecord, userId: string): Promise<{ docId: string; url: string }> {
    try {
      const tokenRecord = await this.tokenRepo.getTokenByUserId(userId);
      if (!tokenRecord) {
        throw new Error(`No Google OAuth token found for user ${userId}`);
      }

      const auth = this.authService.getClient(tokenRecord.accessToken, tokenRecord.refreshToken);
      const existingNote = await this.taskNoteRepo.getTaskNoteByTaskId(task.id);

      const noteContent = this.generateNoteContent(task);

      if (existingNote?.googleDocId) {
        await this.docsService.updateDoc(auth, existingNote.googleDocId, noteContent);
        await this.taskNoteRepo.updateTaskNote(task.id, existingNote.googleDocId, existingNote.googleDocUrl, noteContent);
        logger.info('Updated task note Google Doc', { taskId: task.id, docId: existingNote.googleDocId });
        return { docId: existingNote.googleDocId, url: existingNote.googleDocUrl! };
      } else {
        const { docId, url } = await this.docsService.createDoc(auth, `Task: ${task.title}`, noteContent);
        await this.taskNoteRepo.upsertTaskNote(task.id, docId, url, noteContent);
        logger.info('Created task note Google Doc', { taskId: task.id, docId });
        return { docId, url };
      }
    } catch (error) {
      logger.error('Failed to sync task note', { error, taskId: task.id });
      throw error;
    }
  }

  async syncCalendarEvents(userId: string, daysAhead: number = 30): Promise<number> {
    try {
      const tokenRecord = await this.tokenRepo.getTokenByUserId(userId);
      if (!tokenRecord) {
        throw new Error(`No Google OAuth token found for user ${userId}`);
      }

      const auth = this.authService.getClient(tokenRecord.accessToken, tokenRecord.refreshToken);
      const events = await this.calendarService.getUpcomingEvents(auth, daysAhead);
      
      const count = await this.calendarRepo.upsertEvents(events);
      logger.info('Synced Google Calendar events', { userId, count });
      return count;
    } catch (error) {
      logger.error('Failed to sync calendar events', { error, userId });
      throw error;
    }
  }

  async getExamCountdown(userId: string): Promise<Array<{ title: string; daysUntil: number; date: string }>> {
    try {
      const tokenRecord = await this.tokenRepo.getTokenByUserId(userId);
      if (!tokenRecord) {
        logger.warn('No Google OAuth token found for exam countdown', { userId });
        return [];
      }

      const auth = this.authService.getClient(tokenRecord.accessToken, tokenRecord.refreshToken);
      const examEvents = await this.calendarService.getExamEvents(auth);
      
      const now = new Date();
      return examEvents.map(event => {
        const examDate = new Date(event.startTime);
        const daysUntil = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          title: event.title,
          daysUntil,
          date: event.startTime
        };
      });
    } catch (error) {
      logger.error('Failed to get exam countdown', { error, userId });
      return [];
    }
  }

  private generateNoteContent(task: TaskRecord): string {
    let content = `Task: ${task.title}\n\n`;
    
    if (task.description) {
      content += `Description:\n${task.description}\n\n`;
    }
    
    if (task.dueDate) {
      content += `Due Date: ${new Date(task.dueDate).toLocaleString()}\n`;
    }
    
    content += `Estimated Time: ${task.estimatedMinutes} minutes\n`;
    content += `Source: ${task.source}\n\n`;
    content += `--- Task Notes ---\n`;
    content += `Add your notes here...\n`;
    
    return content;
  }
}
