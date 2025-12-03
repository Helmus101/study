import { Pool } from 'pg';
import {
  DeadlineRecord,
  GradeRecord,
  LessonRecord,
  TaskRecord,
  TimetableEntryRecord
} from '../types';

const nowSql = 'NOW()';

const parseJson = (value: unknown): Record<string, unknown> => {
  if (value === null || value === undefined) {
    return {};
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return { raw: value, error: (error as Error).message };
    }
  }
  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
};

const toIsoString = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  }
  return undefined;
};

const toDateOnly = (value: unknown): string => {
  const iso = toIsoString(value);
  if (iso) {
    return iso.slice(0, 10);
  }
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  return String(value ?? '');
};

export class PronoteRepository {
  constructor(private readonly pool: Pool) {}

  async upsertTasks(tasks: TaskRecord[]): Promise<void> {
    for (const task of tasks) {
      await this.pool.query(
        `INSERT INTO tasks (id, source, source_id, title, description, due_date, estimated_minutes, origin, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)
         ON CONFLICT (source, source_id)
         DO UPDATE SET title = EXCLUDED.title,
                       description = EXCLUDED.description,
                       due_date = EXCLUDED.due_date,
                       estimated_minutes = EXCLUDED.estimated_minutes,
                       origin = EXCLUDED.origin,
                       metadata = EXCLUDED.metadata,
                       updated_at = ${nowSql};`,
        [
          task.id,
          task.source,
          task.sourceId,
          task.title,
          task.description ?? null,
          task.dueDate ?? null,
          task.estimatedMinutes,
          JSON.stringify(task.origin ?? {}),
          JSON.stringify(task.metadata ?? {})
        ]
      );
    }
  }

  async upsertDeadlines(deadlines: DeadlineRecord[]): Promise<void> {
    for (const deadline of deadlines) {
      await this.pool.query(
        `INSERT INTO deadlines (id, source, source_id, label, due_date, metadata)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb)
         ON CONFLICT (source, source_id)
         DO UPDATE SET label = EXCLUDED.label,
                       due_date = EXCLUDED.due_date,
                       metadata = EXCLUDED.metadata,
                       updated_at = ${nowSql};`,
        [deadline.id, deadline.source, deadline.sourceId, deadline.label, deadline.dueDate, JSON.stringify(deadline.metadata ?? {})]
      );
    }
  }

  async upsertGrades(grades: GradeRecord[]): Promise<void> {
    for (const grade of grades) {
      await this.pool.query(
        `INSERT INTO grades (id, source, source_id, subject, score, out_of, average, recorded_at, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
         ON CONFLICT (source, source_id)
         DO UPDATE SET subject = EXCLUDED.subject,
                       score = EXCLUDED.score,
                       out_of = EXCLUDED.out_of,
                       average = EXCLUDED.average,
                       recorded_at = EXCLUDED.recorded_at,
                       metadata = EXCLUDED.metadata,
                       updated_at = ${nowSql};`,
        [
          grade.id,
          grade.source,
          grade.sourceId,
          grade.subject,
          grade.score,
          grade.outOf,
          grade.average ?? null,
          grade.recordedAt,
          JSON.stringify(grade.metadata ?? {})
        ]
      );
    }
  }

  async upsertLessons(lessons: LessonRecord[]): Promise<void> {
    for (const lesson of lessons) {
      await this.pool.query(
        `INSERT INTO lessons (id, source, source_id, subject, teacher, room, start_time, end_time, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
         ON CONFLICT (source, source_id)
         DO UPDATE SET subject = EXCLUDED.subject,
                       teacher = EXCLUDED.teacher,
                       room = EXCLUDED.room,
                       start_time = EXCLUDED.start_time,
                       end_time = EXCLUDED.end_time,
                       metadata = EXCLUDED.metadata;`,
        [
          lesson.id,
          lesson.source,
          lesson.sourceId,
          lesson.subject,
          lesson.teacher ?? null,
          lesson.room ?? null,
          lesson.startTime,
          lesson.endTime,
          JSON.stringify(lesson.metadata ?? {})
        ]
      );
    }
  }

  async upsertTimetableEntries(entries: TimetableEntryRecord[]): Promise<void> {
    for (const entry of entries) {
      await this.pool.query(
        `INSERT INTO timetable_entries (id, source, source_id, title, day, start_time, end_time, metadata)
         VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8::jsonb)
         ON CONFLICT (source, source_id)
         DO UPDATE SET title = EXCLUDED.title,
                       day = EXCLUDED.day,
                       start_time = EXCLUDED.start_time,
                       end_time = EXCLUDED.end_time,
                       metadata = EXCLUDED.metadata;`,
        [
          entry.id,
          entry.source,
          entry.sourceId,
          entry.title,
          entry.day,
          entry.startTime,
          entry.endTime,
          JSON.stringify(entry.metadata ?? {})
        ]
      );
    }
  }

  async getTasks(): Promise<TaskRecord[]> {
    const result = await this.pool.query(
      `SELECT id, source, source_id, title, description, due_date, estimated_minutes, origin, metadata, created_at, updated_at
       FROM tasks
       ORDER BY COALESCE(due_date, created_at)`
    );
    return result.rows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      title: row.title,
      description: row.description ?? undefined,
      dueDate: toIsoString(row.due_date),
      estimatedMinutes: row.estimated_minutes,
      origin: parseJson(row.origin) as unknown as TaskRecord['origin'],
      metadata: parseJson(row.metadata),
      createdAt: toIsoString(row.created_at),
      updatedAt: toIsoString(row.updated_at)
    }));
  }

  async getDeadlines(): Promise<DeadlineRecord[]> {
    const result = await this.pool.query(
      `SELECT id, source, source_id, label, due_date, metadata, created_at, updated_at FROM deadlines ORDER BY due_date`
    );
    return result.rows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      label: row.label,
      dueDate: toIsoString(row.due_date)!,
      metadata: parseJson(row.metadata),
      createdAt: toIsoString(row.created_at),
      updatedAt: toIsoString(row.updated_at)
    }));
  }

  async getGrades(): Promise<GradeRecord[]> {
    const result = await this.pool.query(
      `SELECT id, source, source_id, subject, score, out_of, average, recorded_at, metadata FROM grades ORDER BY recorded_at DESC`
    );
    return result.rows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      subject: row.subject,
      score: Number(row.score),
      outOf: Number(row.out_of),
      average: row.average !== null ? Number(row.average) : undefined,
      recordedAt: toIsoString(row.recorded_at)!,
      metadata: parseJson(row.metadata)
    }));
  }

  async getLessons(): Promise<LessonRecord[]> {
    const result = await this.pool.query(
      `SELECT id, source, source_id, subject, teacher, room, start_time, end_time, metadata FROM lessons ORDER BY start_time`
    );
    return result.rows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      subject: row.subject,
      teacher: row.teacher ?? undefined,
      room: row.room ?? undefined,
      startTime: toIsoString(row.start_time)!,
      endTime: toIsoString(row.end_time)!,
      metadata: parseJson(row.metadata)
    }));
  }

  async getTimetable(): Promise<TimetableEntryRecord[]> {
    const result = await this.pool.query(
      `SELECT id, source, source_id, title, day, start_time, end_time, metadata FROM timetable_entries ORDER BY day, start_time`
    );
    return result.rows.map((row) => ({
      id: row.id,
      source: row.source,
      sourceId: row.source_id,
      title: row.title,
      day: toDateOnly(row.day),
      startTime: row.start_time,
      endTime: row.end_time,
      metadata: parseJson(row.metadata)
    }));
  }
}
