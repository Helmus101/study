import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../logger';
import { CalendarEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class GoogleCalendarService {
  async listEvents(
    auth: OAuth2Client,
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 50
  ): Promise<CalendarEvent[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin?.toISOString(),
        timeMax: timeMax?.toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = (response.data.items || []).map(event => this.mapGoogleEvent(event));
      logger.info('Listed Calendar events', { count: events.length });
      return events;
    } catch (error) {
      logger.error('Failed to list Calendar events', { error });
      throw error;
    }
  }

  async getUpcomingEvents(auth: OAuth2Client, daysAhead: number = 30): Promise<CalendarEvent[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + daysAhead);
    
    return this.listEvents(auth, now, future);
  }

  async getExamEvents(auth: OAuth2Client): Promise<CalendarEvent[]> {
    try {
      const calendar = google.calendar({ version: 'v3', auth });
      
      const now = new Date();
      const future = new Date();
      future.setMonth(now.getMonth() + 6);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: future.toISOString(),
        q: 'exam OR test OR quiz OR examen',
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = (response.data.items || []).map(event => {
        const calEvent = this.mapGoogleEvent(event);
        return { ...calEvent, eventType: 'exam' };
      });

      logger.info('Listed exam events', { count: events.length });
      return events;
    } catch (error) {
      logger.error('Failed to list exam events', { error });
      throw error;
    }
  }

  private mapGoogleEvent(event: any): CalendarEvent {
    const startTime = event.start?.dateTime || event.start?.date || new Date().toISOString();
    const endTime = event.end?.dateTime || event.end?.date || new Date().toISOString();

    return {
      id: uuidv4(),
      source: 'google-calendar',
      sourceId: event.id || uuidv4(),
      title: event.summary || 'Untitled Event',
      description: event.description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      location: event.location,
      eventType: 'calendar',
      metadata: {
        googleEventId: event.id,
        hangoutLink: event.hangoutLink,
        htmlLink: event.htmlLink,
        status: event.status,
        creator: event.creator,
        organizer: event.organizer
      }
    };
  }
}
