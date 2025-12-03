import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { Server } from 'http';
import { AppConfig } from './config';
import { PronoteRepository } from './db/repository';
import { PronoteSyncQueue } from './queue/syncQueue';
import { buildResolvers, typeDefs } from './graphql/schema';
import { logger, Logger } from './logger';

interface BuildServerOptions {
  config: AppConfig;
  repository: PronoteRepository;
  syncQueue: PronoteSyncQueue;
  log?: Logger;
}

export const buildServer = async ({ config, repository, syncQueue, log = logger }: BuildServerOptions): Promise<{
  app: express.Application;
  server: Server;
  apolloServer: ApolloServer<any>;
}> => {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/tasks', async (_req, res, next) => {
    try {
      const tasks = await repository.getTasks();
      res.json({ data: tasks });
    } catch (error) {
      next(error);
    }
  });

  app.get('/dashboard', async (_req, res, next) => {
    try {
      const [tasks, deadlines, grades, lessons, timetable] = await Promise.all([
        repository.getTasks(),
        repository.getDeadlines(),
        repository.getGrades(),
        repository.getLessons(),
        repository.getTimetable()
      ]);
      res.json({ data: { tasks, deadlines, grades, lessons, timetable } });
    } catch (error) {
      next(error);
    }
  });

  app.post('/sync/pronote', async (_req, res, next) => {
    try {
      await syncQueue.triggerManualSync('rest');
      res.status(202).json({ status: 'accepted' });
    } catch (error) {
      next(error);
    }
  });

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: buildResolvers(repository)
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    log.error('API error', { error });
    res.status(500).json({ error: 'Internal Server Error' });
  });

  const server = app.listen(config.port, () => {
    log.info(`Server listening on port ${config.port}`);
  });

  return { app, server, apolloServer };
};
