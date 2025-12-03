import { PawnoteDeadline, PawnoteGrade, PawnoteHomework, PawnoteLesson, PawnoteTimetableEntry } from './types';
import {
  DeadlineRecord,
  GradeRecord,
  LessonRecord,
  TaskRecord,
  TimetableEntryRecord
} from '../types';

interface MapperOptions {
  defaultTimeEstimateMinutes: number;
}

const SOURCE = 'pronote';

export const mapHomeworkToTask = (
  hw: PawnoteHomework,
  options: MapperOptions
): TaskRecord => ({
  id: hw.id,
  source: SOURCE,
  sourceId: hw.id,
  title: `${hw.subject} homework`,
  description: hw.description,
  dueDate: hw.dueDate,
  estimatedMinutes: hw.timeEstimateMinutes ?? options.defaultTimeEstimateMinutes,
  origin: {
    system: SOURCE,
    category: 'homework',
    referenceId: hw.id
  },
  metadata: {
    subject: hw.subject,
    attachments: hw.attachments ?? []
  }
});

export const mapDeadlineToRecord = (deadline: PawnoteDeadline): DeadlineRecord => ({
  id: deadline.id,
  source: SOURCE,
  sourceId: deadline.id,
  label: deadline.label,
  dueDate: deadline.dueDate,
  metadata: deadline.details ? { details: deadline.details } : {}
});

export const mapGradeToRecord = (grade: PawnoteGrade): GradeRecord => ({
  id: grade.id,
  source: SOURCE,
  sourceId: grade.id,
  subject: grade.subject,
  score: grade.score,
  outOf: grade.outOf,
  average: grade.average,
  recordedAt: grade.recordedAt,
  metadata: grade.comment ? { comment: grade.comment } : {}
});

export const mapLessonToRecord = (lesson: PawnoteLesson): LessonRecord => ({
  id: lesson.id,
  source: SOURCE,
  sourceId: lesson.id,
  subject: lesson.subject,
  teacher: lesson.teacher,
  room: lesson.room,
  startTime: lesson.startTime,
  endTime: lesson.endTime,
  metadata: lesson.notes ? { notes: lesson.notes } : {}
});

export const mapTimetableEntryToRecord = (entry: PawnoteTimetableEntry): TimetableEntryRecord => ({
  id: entry.id,
  source: SOURCE,
  sourceId: entry.id,
  title: entry.title,
  day: entry.day,
  startTime: entry.startTime,
  endTime: entry.endTime,
  metadata: entry.metadata ?? {}
});
