import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import { GoogleOAuthToken } from '../types';
import { logger } from '../logger';

export class GoogleTokenRepository {
  constructor(private db: Pool) {}

  private async query(text: string, params: unknown[] = []) {
    return this.db.query(text, params);
  }

  async upsertToken(
    userId: string,
    accessToken: string,
    refreshToken: string,
    scope: string,
    expiryDate: number
  ): Promise<GoogleOAuthToken> {
    const id = uuidv4();
    const sql = `
      INSERT INTO google_oauth_tokens (id, user_id, access_token, refresh_token, scope, token_type, expiry_date, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET 
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        scope = EXCLUDED.scope,
        expiry_date = EXCLUDED.expiry_date,
        updated_at = NOW()
      RETURNING *
    `;
    const result = await this.query(sql, [id, userId, accessToken, refreshToken, scope, 'Bearer', expiryDate]);
    logger.info('Upserted Google OAuth token', { userId });
    return this.mapRow(result.rows[0]);
  }

  async getTokenByUserId(userId: string): Promise<GoogleOAuthToken | null> {
    const sql = `SELECT * FROM google_oauth_tokens WHERE user_id = $1`;
    const result = await this.query(sql, [userId]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async deleteTokenByUserId(userId: string): Promise<void> {
    const sql = `DELETE FROM google_oauth_tokens WHERE user_id = $1`;
    await this.query(sql, [userId]);
    logger.info('Deleted Google OAuth token', { userId });
  }

  private mapRow(row: any): GoogleOAuthToken {
    return {
      id: row.id,
      userId: row.user_id,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      scope: row.scope,
      tokenType: row.token_type,
      expiryDate: parseInt(row.expiry_date),
      createdAt: row.created_at?.toISOString(),
      updatedAt: row.updated_at?.toISOString()
    };
  }
}
