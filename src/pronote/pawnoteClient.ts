import axios, { AxiosInstance } from 'axios';
import { logger, Logger } from '../logger';
import {
  PawnoteApiOptions,
  PawnoteDeadline,
  PawnoteFetchPayload,
  PawnoteGrade,
  PawnoteHomework,
  PawnoteLesson,
  PawnoteTimetableEntry
} from './types';
import { mockDeadlines, mockGrades, mockHomework, mockLessons, mockTimetable } from './mockData';

interface AccessToken {
  value: string;
  expiresAt: number;
}

export class PawnoteClient {
  private token?: AccessToken;
  private axiosInstance?: AxiosInstance;

  constructor(private readonly options: PawnoteApiOptions, private readonly log: Logger = logger) {
    if (options.mode === 'live') {
      if (!options.baseUrl) {
        throw new Error('Pawnote baseUrl is required in live mode');
      }
      this.axiosInstance = axios.create({
        baseURL: options.baseUrl,
        timeout: 8000
      });
    }
  }

  private tokenValid(): boolean {
    return Boolean(this.token && this.token.expiresAt > Date.now() + 30_000);
  }

  private async authenticate(): Promise<string> {
    if (this.options.mode === 'mock') {
      this.token = { value: 'mock-token', expiresAt: Date.now() + 60 * 60 * 1000 };
      return this.token.value;
    }

    if (this.tokenValid()) {
      return this.token!.value;
    }

    const response = await this.axiosInstance!.post<PawnoteFetchPayload<{ token: string; expiresIn: number }>>(
      '/oauth/token',
      {
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        grant_type: 'client_credentials'
      }
    );

    const payload = (Array.isArray(response.data?.data) ? response.data.data[0] : null) ??
      ((response.data as unknown) as { token?: string; expiresIn?: number });
    const token = payload?.token;
    const expiresIn = payload?.expiresIn ?? 3600;

    if (!token) {
      throw new Error('Pawnote authentication failed: missing token');
    }

    this.token = { value: token, expiresAt: Date.now() + expiresIn * 1000 };
    return this.token.value;
  }

  private async fetchCollection<T>(path: string, mockData: T[]): Promise<T[]> {
    if (this.options.mode === 'mock') {
      return mockData;
    }
    const token = await this.authenticate();
    const response = await this.axiosInstance!.get<PawnoteFetchPayload<T>>(path, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data ?? [];
  }

  async fetchHomework(): Promise<PawnoteHomework[]> {
    return this.fetchCollection(
      `/schools/${this.options.schoolId}/students/${this.options.studentId}/homework`,
      mockHomework
    );
  }

  async fetchDeadlines(): Promise<PawnoteDeadline[]> {
    return this.fetchCollection(
      `/schools/${this.options.schoolId}/students/${this.options.studentId}/deadlines`,
      mockDeadlines
    );
  }

  async fetchGrades(): Promise<PawnoteGrade[]> {
    return this.fetchCollection(
      `/schools/${this.options.schoolId}/students/${this.options.studentId}/grades`,
      mockGrades
    );
  }

  async fetchLessons(): Promise<PawnoteLesson[]> {
    return this.fetchCollection(
      `/schools/${this.options.schoolId}/students/${this.options.studentId}/lessons`,
      mockLessons
    );
  }

  async fetchTimetable(): Promise<PawnoteTimetableEntry[]> {
    return this.fetchCollection(
      `/schools/${this.options.schoolId}/students/${this.options.studentId}/timetable`,
      mockTimetable
    );
  }
}
