import type {
  PawnoteDeadline,
  PawnoteGrade,
  PawnoteHomework,
  PawnoteLesson,
  PawnoteTimetableEntry
} from './types';

export const mockHomework: PawnoteHomework[] = [
  {
    id: 'hw-math-001',
    subject: 'Mathematics',
    description: 'Complete exercises 5 through 12 on page 42.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeEstimateMinutes: 45,
    attachments: [{ name: 'worksheet.pdf', url: 'https://files.example/worksheet.pdf' }]
  },
  {
    id: 'hw-hist-002',
    subject: 'History',
    description: 'Read chapter 3 and prepare a short summary.',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    timeEstimateMinutes: 30
  }
];

export const mockDeadlines: PawnoteDeadline[] = [
  {
    id: 'exam-phy-2024',
    label: 'Physics mid-term exam',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    details: 'Bring calculator and lab notes.'
  }
];

export const mockGrades: PawnoteGrade[] = [
  {
    id: 'grade-fr-15',
    subject: 'French',
    score: 15,
    outOf: 20,
    average: 12,
    recordedAt: new Date().toISOString(),
    comment: 'Great participation.'
  }
];

export const mockLessons: PawnoteLesson[] = [
  {
    id: 'lesson-chem-1',
    subject: 'Chemistry',
    teacher: 'Dr. Curie',
    room: 'Lab 2',
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    notes: 'Safety goggles mandatory.'
  }
];

export const mockTimetable: PawnoteTimetableEntry[] = [
  {
    id: 'timetable-mon-1',
    title: 'Mathematics',
    day: new Date().toISOString().slice(0, 10),
    startTime: '08:00',
    endTime: '09:00',
    metadata: { room: 'A204', teacher: 'Mrs. Euler' }
  }
];
