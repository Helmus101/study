import { AppConfig } from '../config';
import { logger, Logger } from '../logger';
import { PronoteRepository } from '../db/repository';
import { PawnoteClient } from './pawnoteClient';
import {
  mapDeadlineToRecord,
  mapGradeToRecord,
  mapHomeworkToTask,
  mapLessonToRecord,
  mapTimetableEntryToRecord
} from './mapper';
import { SyncResult } from '../types';

export class PronoteSyncService {
  constructor(
    private readonly client: PawnoteClient,
    private readonly repository: PronoteRepository,
    private readonly config: AppConfig,
    private readonly log: Logger = logger
  ) {}

  async runFullSync(triggeredBy: string): Promise<SyncResult> {
    this.log.info('Starting Pronote sync', { triggeredBy });
    try {
      const [homework, deadlines, grades, lessons, timetable] = await Promise.all([
        this.client.fetchHomework(),
        this.client.fetchDeadlines(),
        this.client.fetchGrades(),
        this.client.fetchLessons(),
        this.client.fetchTimetable()
      ]);

      const taskRecords = homework.map((hw) =>
        mapHomeworkToTask(hw, { defaultTimeEstimateMinutes: this.config.pronote.defaultTimeEstimateMinutes })
      );
      const deadlineRecords = deadlines.map(mapDeadlineToRecord);
      const gradeRecords = grades.map(mapGradeToRecord);
      const lessonRecords = lessons.map(mapLessonToRecord);
      const timetableRecords = timetable.map(mapTimetableEntryToRecord);

      await Promise.all([
        this.repository.upsertTasks(taskRecords),
        this.repository.upsertDeadlines(deadlineRecords),
        this.repository.upsertGrades(gradeRecords),
        this.repository.upsertLessons(lessonRecords),
        this.repository.upsertTimetableEntries(timetableRecords)
      ]);

      const result: SyncResult = {
        tasks: taskRecords.length,
        deadlines: deadlineRecords.length,
        grades: gradeRecords.length,
        lessons: lessonRecords.length,
        timetableEntries: timetableRecords.length,
        triggeredBy
      };

      this.log.info('Pronote sync completed', result);
      return result;
    } catch (error) {
      this.log.error('Pronote sync failed', { error, triggeredBy });
      throw error;
    }
  }
}
