import { loadConfig } from './config';
import { logger } from './logger';
import { createDatabase } from './db/database';
import { PronoteRepository } from './db/repository';
import { PawnoteClient } from './pronote/pawnoteClient';
import { PronoteSyncService } from './pronote/syncService';
import { PronoteSyncQueue } from './queue/syncQueue';
import { GoogleAuthService } from './google/auth';
import { GoogleDocsService } from './google/docsService';
import { GoogleDriveService } from './google/driveService';
import { GoogleCalendarService } from './google/calendarService';
import { GoogleTokenRepository } from './google/tokenRepository';
import { TaskNoteRepository } from './google/taskNoteRepository';
import { CalendarEventRepository } from './google/calendarRepository';
import { GoogleSyncService } from './google/googleSyncService';
import { buildServer } from './server';

const bootstrap = async () => {
  const config = loadConfig();
  const db = await createDatabase(config, logger);
  const repository = new PronoteRepository(db.pool);
  const client = new PawnoteClient(config.pronote, logger);
  const syncService = new PronoteSyncService(client, repository, config, logger);
  const syncQueue = new PronoteSyncQueue(syncService, config, logger);

  const googleAuthService = new GoogleAuthService(config.google);
  const googleDocsService = new GoogleDocsService();
  const googleDriveService = new GoogleDriveService();
  const googleCalendarService = new GoogleCalendarService();
  const googleTokenRepo = new GoogleTokenRepository(db.pool);
  const taskNoteRepo = new TaskNoteRepository(db.pool);
  const calendarRepo = new CalendarEventRepository(db.pool);
  const googleSyncService = new GoogleSyncService(
    googleAuthService,
    googleDocsService,
    googleDriveService,
    googleCalendarService,
    googleTokenRepo,
    taskNoteRepo,
    calendarRepo
  );

  if (config.runInitialSyncOnStartup) {
    try {
      await syncService.runFullSync('startup');
    } catch (error) {
      logger.error('Initial Pronote sync failed', { error });
    }
  }

  const { server } = await buildServer({ 
    config, 
    repository, 
    syncQueue, 
    googleAuthService,
    googleTokenRepo,
    googleSyncService,
    calendarRepo,
    log: logger 
  });

  const shutdown = async () => {
    logger.info('Shutting down Pronote sync service');
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          logger.error('Error closing HTTP server', { error });
          reject(error);
          return;
        }
        resolve();
      });
    }).catch(() => undefined);
    await syncQueue.shutdown();
    await db.dispose();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

bootstrap().catch((error) => {
  logger.error('Fatal error bootstrapping Pronote service', { error });
  process.exit(1);
});
