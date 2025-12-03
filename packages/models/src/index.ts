// User entity
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subject entity
export interface Subject {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task entity
export interface Task {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Note entity
export interface Note {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  content: string;
  googleDocsId?: string;
  syncedAt?: Date;
  localOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// StudySession entity
export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// CalendarEvent entity
export interface CalendarEvent {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

// File entity
export interface File {
  id: string;
  userId: string;
  subjectId?: string;
  noteId?: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
