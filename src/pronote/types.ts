export interface PawnoteAuthResponse {
  accessToken: string;
  expiresIn: number; // seconds
}

export interface PawnoteHomework {
  id: string;
  subject: string;
  description: string;
  dueDate: string;
  timeEstimateMinutes?: number;
  attachments?: Array<{ name: string; url: string }>;
}

export interface PawnoteDeadline {
  id: string;
  label: string;
  dueDate: string;
  details?: string;
}

export interface PawnoteGrade {
  id: string;
  subject: string;
  score: number;
  outOf: number;
  average?: number;
  recordedAt: string;
  comment?: string;
}

export interface PawnoteLesson {
  id: string;
  subject: string;
  teacher?: string;
  room?: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface PawnoteTimetableEntry {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  metadata?: Record<string, unknown>;
}

export interface PawnoteApiOptions {
  mode: 'mock' | 'live';
  baseUrl?: string;
  schoolId: string;
  studentId: string;
  clientId: string;
  clientSecret: string;
}

export interface PawnoteFetchPayload<T> {
  meta: {
    fetchedAt: string;
    count: number;
  };
  data: T[];
}
