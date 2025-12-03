import { Router, Request, Response, NextFunction } from 'express';
import { GoogleAuthService } from './auth';
import { GoogleTokenRepository } from './tokenRepository';
import { GoogleSyncService } from './googleSyncService';
import { CalendarEventRepository } from './calendarRepository';
import { PronoteRepository } from '../db/repository';
import { logger } from '../logger';

interface GoogleRoutesOptions {
  authService: GoogleAuthService;
  tokenRepo: GoogleTokenRepository;
  syncService: GoogleSyncService;
  calendarRepo: CalendarEventRepository;
  pronoteRepo: PronoteRepository;
}

export const createGoogleRoutes = ({
  authService,
  tokenRepo,
  syncService,
  calendarRepo,
  pronoteRepo
}: GoogleRoutesOptions): Router => {
  const router = Router();

  router.get('/auth/google', (req: Request, res: Response) => {
    const userId = req.query.userId as string || 'demo-user';
    const authUrl = authService.getAuthUrl(userId);
    res.json({ authUrl });
  });

  router.get('/auth/google/callback', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;
      const userId = req.query.state as string || 'demo-user';

      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
      }

      const tokens = await authService.getTokensFromCode(code);
      
      if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
        return res.status(500).json({ error: 'Failed to obtain tokens' });
      }

      await tokenRepo.upsertToken(
        userId,
        tokens.access_token,
        tokens.refresh_token,
        tokens.scope || 'google-apis',
        tokens.expiry_date
      );

      logger.info('Google OAuth successful', { userId });
      res.json({ 
        status: 'success', 
        message: 'Google account connected successfully',
        userId 
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/google/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.userId as string || 'demo-user';
      const token = await tokenRepo.getTokenByUserId(userId);
      
      res.json({ 
        connected: !!token,
        userId,
        scopes: token?.scope
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/google/disconnect', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId || 'demo-user';
      await tokenRepo.deleteTokenByUserId(userId);
      
      logger.info('Disconnected Google account', { userId });
      res.json({ status: 'success', message: 'Google account disconnected' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/sync/google/calendar', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.userId || 'demo-user';
      const daysAhead = req.body.daysAhead || 30;
      
      const count = await syncService.syncCalendarEvents(userId, daysAhead);
      res.json({ status: 'success', eventsSynced: count });
    } catch (error) {
      next(error);
    }
  });

  router.post('/tasks/:taskId/sync-note', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const userId = req.body.userId || 'demo-user';
      
      const tasks = await pronoteRepo.getTasks();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const result = await syncService.syncTaskNote(task, userId);
      res.json({ 
        status: 'success', 
        googleDocId: result.docId,
        googleDocUrl: result.url
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/calendar/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string) 
        : new Date();
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate as string) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const events = await calendarRepo.getEventsByDateRange(startDate, endDate);
      res.json({ data: events });
    } catch (error) {
      next(error);
    }
  });

  router.get('/calendar/merged', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string) 
        : new Date();
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate as string) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const googleEvents = await calendarRepo.getEventsByDateRange(startDate, endDate);
      
      const lessons = await pronoteRepo.getLessons();
      const pronoteEvents = lessons
        .filter(lesson => {
          const start = new Date(lesson.startTime);
          return start >= startDate && start <= endDate;
        })
        .map(lesson => ({
          id: lesson.id,
          source: lesson.source as any,
          sourceId: lesson.sourceId,
          title: `${lesson.subject}${lesson.teacher ? ` - ${lesson.teacher}` : ''}`,
          description: lesson.room ? `Room: ${lesson.room}` : undefined,
          startTime: lesson.startTime,
          endTime: lesson.endTime,
          location: lesson.room,
          eventType: 'lesson',
          metadata: lesson.metadata
        }));

      const mergedEvents = [...googleEvents, ...pronoteEvents].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      res.json({ data: mergedEvents, sources: ['google-calendar', 'pronote'] });
    } catch (error) {
      next(error);
    }
  });

  router.get('/calendar/exams', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.userId as string || 'demo-user';
      const countdown = await syncService.getExamCountdown(userId);
      res.json({ data: countdown });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
