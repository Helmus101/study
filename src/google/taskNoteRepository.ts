import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import { TaskNote } from '../types';
import { logger } from '../logger';

export class TaskNoteRepository {
  constructor(private db: Pool) {}

  private async query(text: string, params: unknown[] = []) {
    return this.db.query(text, params);
  }

  async createTaskNote(
    taskId: string,
    googleDocId?: string,
    googleDocUrl?: string,
    content?: string
  ): Promise<TaskNote> {
    const id = uuidv4();
    const sql = `
      INSERT INTO task_notes (id, task_id, google_doc_id, google_doc_url, content, synced_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const syncedAt = googleDocId ? new Date().toISOString() : null;
    const result = await this.query(sql, [id, taskId, googleDocId, googleDocUrl, content, syncedAt]);
    logger.info('Created task note', { taskId, googleDocId });
    return this.mapRow(result.rows[0]);
  }

  async updateTaskNote(
    taskId: string,
    googleDocId?: string,
    googleDocUrl?: string,
    content?: string
  ): Promise<TaskNote | null> {
    const syncedAt = googleDocId ? new Date().toISOString() : null;
    const sql = `
      UPDATE task_notes
      SET google_doc_id = $1, google_doc_url = $2, content = $3, synced_at = $4, updated_at = NOW()
      WHERE task_id = $5
      RETURNING *
    `;
    const result = await this.query(sql, [googleDocId, googleDocUrl, content, syncedAt, taskId]);
    if (result.rows.length > 0) {
      logger.info('Updated task note', { taskId, googleDocId });
      return this.mapRow(result.rows[0]);
    }
    return null;
  }

  async upsertTaskNote(
    taskId: string,
    googleDocId?: string,
    googleDocUrl?: string,
    content?: string
  ): Promise<TaskNote> {
    const existing = await this.getTaskNoteByTaskId(taskId);
    if (existing) {
      return (await this.updateTaskNote(taskId, googleDocId, googleDocUrl, content))!;
    } else {
      return this.createTaskNote(taskId, googleDocId, googleDocUrl, content);
    }
  }

  async getTaskNoteByTaskId(taskId: string): Promise<TaskNote | null> {
    const sql = `SELECT * FROM task_notes WHERE task_id = $1`;
    const result = await this.query(sql, [taskId]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async getAllTaskNotes(): Promise<TaskNote[]> {
    const sql = `SELECT * FROM task_notes ORDER BY created_at DESC`;
    const result = await this.query(sql);
    return result.rows.map(row => this.mapRow(row));
  }

  private mapRow(row: any): TaskNote {
    return {
      id: row.id,
      taskId: row.task_id,
      googleDocId: row.google_doc_id,
      googleDocUrl: row.google_doc_url,
      content: row.content,
      syncedAt: row.synced_at?.toISOString(),
      createdAt: row.created_at?.toISOString(),
      updatedAt: row.updated_at?.toISOString()
    };
  }
}
