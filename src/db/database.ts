import { Pool } from 'pg';
import { newDb } from 'pg-mem';
import { AppConfig } from '../config';
import { SCHEMA_SQL } from './schema';
import { logger, Logger } from '../logger';

export interface DatabaseContext {
  pool: Pool;
  kind: 'memory' | 'postgres';
  dispose: () => Promise<void>;
}

export const createDatabase = async (
  config: AppConfig,
  log: Logger = logger
): Promise<DatabaseContext> => {
  let pool: Pool;
  let kind: DatabaseContext['kind'] = 'memory';

  if (config.databaseUrl) {
    pool = new Pool({ connectionString: config.databaseUrl });
    kind = 'postgres';
  } else {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    const adapter = db.adapters.createPg();
    pool = new adapter.Pool();
  }

  for (const statement of SCHEMA_SQL) {
    await pool.query(statement);
  }

  log.info(`Database initialized using ${kind === 'postgres' ? 'Postgres connection' : 'in-memory pg-mem instance'}`);

  return {
    pool,
    kind,
    dispose: async () => {
      await pool.end();
    }
  };
};
