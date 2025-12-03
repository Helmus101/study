import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const pronoteSchema = z
  .object({
    mode: z.enum(['mock', 'live']).default('mock'),
    baseUrl: z.string().url().optional(),
    schoolId: z.string().min(1),
    studentId: z.string().min(1),
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
    defaultTimeEstimateMinutes: z.coerce.number().int().positive().default(45)
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'live' && !value.baseUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PRONOTE_BASE_URL is required when PRONOTE_API_MODE=live'
      });
    }
  });

const appSchema = z.object({
  env: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().int().positive().default(4000),
  databaseUrl: z.string().url().optional(),
  redisUrl: z.string().url().optional(),
  syncCronSchedule: z.string().default('0 * * * *'),
  runInitialSyncOnStartup: z.coerce.boolean().default(true),
  logLevel: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  pronote: pronoteSchema
});

export type PronoteApiConfig = z.infer<typeof pronoteSchema>;
export type AppConfig = z.infer<typeof appSchema>;

export const loadConfig = (): AppConfig => {
  return appSchema.parse({
    env: process.env.NODE_ENV ?? 'development',
    port: process.env.PORT ?? 4000,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    syncCronSchedule: process.env.SYNC_CRON_SCHEDULE ?? '0 * * * *',
    runInitialSyncOnStartup: process.env.RUN_INITIAL_SYNC_ON_STARTUP ?? 'true',
    logLevel: (process.env.LOG_LEVEL as AppConfig['logLevel']) ?? 'info',
    pronote: {
      mode: (process.env.PRONOTE_API_MODE as PronoteApiConfig['mode']) ?? 'mock',
      baseUrl: process.env.PRONOTE_BASE_URL,
      schoolId: process.env.PRONOTE_SCHOOL_ID ?? 'demo-school',
      studentId: process.env.PRONOTE_STUDENT_ID ?? 'demo-student',
      clientId: process.env.PRONOTE_CLIENT_ID ?? 'demo-client',
      clientSecret: process.env.PRONOTE_CLIENT_SECRET ?? 'demo-secret',
      defaultTimeEstimateMinutes: process.env.PRONOTE_DEFAULT_TIME_ESTIMATE_MINUTES ?? 45
    }
  });
};
