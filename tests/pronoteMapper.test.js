"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapper_1 = require("../src/pronote/mapper");
describe('Pronote mapper', () => {
    it('maps homework to task with defaults', () => {
        const homework = {
            id: 'hw-1',
            subject: 'Biology',
            description: 'Complete lab report',
            dueDate: '2024-01-01T10:00:00.000Z'
        };
        const task = (0, mapper_1.mapHomeworkToTask)(homework, { defaultTimeEstimateMinutes: 50 });
        expect(task).toMatchObject({
            id: 'hw-1',
            source: 'pronote',
            title: 'Biology homework',
            estimatedMinutes: 50,
            origin: { system: 'pronote', category: 'homework', referenceId: 'hw-1' },
            metadata: { subject: 'Biology' }
        });
    });
    it('keeps Pronote provided time estimates', () => {
        const homework = {
            id: 'hw-2',
            subject: 'Math',
            description: 'Worksheet',
            dueDate: '2024-01-02T10:00:00.000Z',
            timeEstimateMinutes: 35
        };
        const task = (0, mapper_1.mapHomeworkToTask)(homework, { defaultTimeEstimateMinutes: 50 });
        expect(task.estimatedMinutes).toBe(35);
    });
    it('maps deadlines with metadata', () => {
        const deadline = {
            id: 'dl-1',
            label: 'Essay submission',
            dueDate: '2024-02-04T10:00:00.000Z',
            details: 'Submit via portal'
        };
        const record = (0, mapper_1.mapDeadlineToRecord)(deadline);
        expect(record).toEqual({
            id: 'dl-1',
            source: 'pronote',
            sourceId: 'dl-1',
            label: 'Essay submission',
            dueDate: '2024-02-04T10:00:00.000Z',
            metadata: { details: 'Submit via portal' }
        });
    });
    it('maps grades correctly', () => {
        const grade = {
            id: 'gr-1',
            subject: 'Physics',
            score: 17,
            outOf: 20,
            recordedAt: '2024-02-01T11:00:00.000Z',
            average: 14,
            comment: 'Well done'
        };
        const record = (0, mapper_1.mapGradeToRecord)(grade);
        expect(record).toEqual({
            id: 'gr-1',
            source: 'pronote',
            sourceId: 'gr-1',
            subject: 'Physics',
            score: 17,
            outOf: 20,
            average: 14,
            recordedAt: '2024-02-01T11:00:00.000Z',
            metadata: { comment: 'Well done' }
        });
    });
    it('maps lessons and timetable entries', () => {
        const lesson = {
            id: 'lesson-1',
            subject: 'Chemistry',
            teacher: 'Dr. Curie',
            room: 'Lab',
            startTime: '2024-02-03T09:00:00.000Z',
            endTime: '2024-02-03T10:00:00.000Z'
        };
        const lessonRecord = (0, mapper_1.mapLessonToRecord)(lesson);
        expect(lessonRecord).toEqual({
            id: 'lesson-1',
            source: 'pronote',
            sourceId: 'lesson-1',
            subject: 'Chemistry',
            teacher: 'Dr. Curie',
            room: 'Lab',
            startTime: '2024-02-03T09:00:00.000Z',
            endTime: '2024-02-03T10:00:00.000Z',
            metadata: {}
        });
        const entry = {
            id: 'tt-1',
            title: 'Chemistry',
            day: '2024-02-03',
            startTime: '09:00',
            endTime: '10:00'
        };
        const timetableRecord = (0, mapper_1.mapTimetableEntryToRecord)(entry);
        expect(timetableRecord).toEqual({
            id: 'tt-1',
            source: 'pronote',
            sourceId: 'tt-1',
            title: 'Chemistry',
            day: '2024-02-03',
            startTime: '09:00',
            endTime: '10:00',
            metadata: {}
        });
    });
});
