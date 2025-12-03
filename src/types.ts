export type DataSource = 'pronote' | 'google-calendar';

export interface TaskRecord {
  id: string;
  source: DataSource;
  sourceId: string;
  title: string;
  description?: string;
  dueDate?: string;
  estimatedMinutes: number;
  origin: TaskOrigin;
  metadata: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskOrigin {
  system: DataSource;
  category: 'homework' | 'deadline' | 'manual';
  referenceId: string;
}

export interface DeadlineRecord {
  id: string;
  source: DataSource;
  sourceId: string;
  label: string;
  dueDate: string;
  metadata: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface GradeRecord {
  id: string;
  source: DataSource;
  sourceId: string;
  subject: string;
  score: number;
  outOf: number;
  average?: number;
  metadata: Record<string, unknown>;
  recordedAt: string;
}

export interface LessonRecord {
  id: string;
  source: DataSource;
  sourceId: string;
  subject: string;
  teacher?: string;
  room?: string;
  startTime: string;
  endTime: string;
  metadata: Record<string, unknown>;
}

export interface TimetableEntryRecord {
  id: string;
  source: DataSource;
  sourceId: string;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  metadata: Record<string, unknown>;
}

export interface SyncResult {
  tasks: number;
  deadlines: number;
  grades: number;
  lessons: number;
  timetableEntries: number;
  triggeredBy: string;
}

export interface GoogleOAuthToken {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiryDate: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskNote {
  id: string;
  taskId: string;
  googleDocId?: string;
  googleDocUrl?: string;
  content?: string;
  syncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarEvent {
  id: string;
  source: DataSource;
  sourceId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  eventType?: string;
  metadata: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
