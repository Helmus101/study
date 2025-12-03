import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';
import { CalendarEvent } from '../types';
import { logger } from '../logger';

export class CalendarEventRepository {
  constructor(private db: Pool) {}

  private async query(text: string, params: unknown[] = []) {
    return this.db.query(text, params);
  }

  async upsertEvents(events: CalendarEvent[]): Promise<number> {
    let count = 0;
    for (const event of events) {
      await this.upsertEvent(event);
      count++;
    }
    logger.info('Upserted calendar events', { count });
    return count;
  }

  async upsertEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const sql = `
      INSERT INTO calendar_events (id, source, source_id, title, description, start_time, end_time, location, event_type, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (source, source_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        location = EXCLUDED.location,
        event_type = EXCLUDED.event_type,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
      RETURNING *
    `;
    const result = await this.query(sql, [
      event.id,
      event.source,
      event.sourceId,
      event.title,
      event.description,
      event.startTime,
      event.endTime,
      event.location,
      event.eventType,
      JSON.stringify(event.metadata)
    ]);
    return this.mapRow(result.rows[0]);
  }

  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const sql = `
      SELECT * FROM calendar_events
      WHERE start_time >= $1 AND start_time <= $2
      ORDER BY start_time ASC
    `;
    const result = await this.query(sql, [startDate.toISOString(), endDate.toISOString()]);
    return result.rows.map(row => this.mapRow(row));
  }

  async getExamEvents(): Promise<CalendarEvent[]> {
    const sql = `
      SELECT * FROM calendar_events
      WHERE event_type = 'exam' AND start_time >= NOW()
      ORDER BY start_time ASC
    `;
    const result = await this.query(sql);
    return result.rows.map(row => this.mapRow(row));
  }

  async getAllEvents(): Promise<CalendarEvent[]> {
    const sql = `SELECT * FROM calendar_events ORDER BY start_time DESC LIMIT 100`;
    const result = await this.query(sql);
    return result.rows.map(row => this.mapRow(row));
  }

  private mapRow(row: any): CalendarEvent {
    return {
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      title: row.title,
      description: row.description,
      startTime: new Date(row.start_time).toISOString(),
      endTime: new Date(row.end_time).toISOString(),
      location: row.location,
      eventType: row.event_type,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      createdAt: row.created_at?.toISOString(),
      updatedAt: row.updated_at?.toISOString()
    };
  }
}
