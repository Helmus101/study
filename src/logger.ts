import winston from 'winston';
import { loadConfig } from './config';

const config = loadConfig();

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

export type Logger = typeof logger;
