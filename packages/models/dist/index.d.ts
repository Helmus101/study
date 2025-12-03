export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Subject {
    id: string;
    userId: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}
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
//# sourceMappingURL=index.d.ts.map