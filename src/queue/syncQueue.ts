import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import Redis from 'ioredis';
import cron, { ScheduledTask } from 'node-cron';
import { AppConfig } from '../config';
import { logger, Logger } from '../logger';
import { PronoteSyncService } from '../pronote/syncService';

export class PronoteSyncQueue {
  private queue?: Queue;
  private worker?: Worker;
  private queueEvents?: QueueEvents;
  private cronTask?: ScheduledTask;
  private connection?: Redis;

  constructor(
    private readonly service: PronoteSyncService,
    private readonly config: AppConfig,
    private readonly log: Logger = logger
  ) {
    if (config.redisUrl) {
      this.connection = new Redis(config.redisUrl);
      this.queue = new Queue('pronote-sync', { connection: this.connection });
      this.worker = new Worker(
        'pronote-sync',
        async (job) => {
          this.log.info('Processing Pronote sync job', { jobId: job.id, reason: job.data?.reason });
          return this.service.runFullSync(job.data?.reason ?? 'queue');
        },
        { connection: this.connection }
      );
      this.queueEvents = new QueueEvents('pronote-sync', { connection: new Redis(config.redisUrl) });
      this.queueEvents.on('failed', (event) => this.log.error('Pronote sync job failed', event));
      this.queueEvents.on('completed', (event) => this.log.info('Pronote sync job completed', event));
    } else {
      this.log.warn('Redis URL missing - Pronote sync jobs will run inline');
    }

    if (config.syncCronSchedule) {
      this.cronTask = cron.schedule(config.syncCronSchedule, () => {
        this.log.info('Cron trigger for Pronote sync');
        if (this.queue) {
          this.queue
            .add('scheduled-sync', { reason: 'cron' }, this.defaultJobOptions())
            .catch((error) => this.log.error('Unable to enqueue Pronote sync job', { error }));
        } else {
          this.service.runFullSync('cron').catch((error) => this.log.error('Inline cron sync failed', { error }));
        }
      });
      this.cronTask.start();
    }
  }

  private defaultJobOptions(): JobsOptions {
    return {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5_000
      }
    };
  }

  async triggerManualSync(reason = 'manual'): Promise<void> {
    if (this.queue) {
      await this.queue.add('manual-sync', { reason }, this.defaultJobOptions());
      return;
    }
    await this.service.runFullSync(reason);
  }

  async shutdown(): Promise<void> {
    this.cronTask?.stop();
    await this.worker?.close();
    await this.queue?.close();
    await this.queueEvents?.close();
    await this.connection?.quit();
  }
}
