import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../logger';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  size?: string;
  modifiedTime?: string;
}

export class GoogleDriveService {
  async listFiles(auth: OAuth2Client, query?: string, pageSize: number = 10): Promise<DriveFile[]> {
    try {
      const drive = google.drive({ version: 'v3', auth });
      
      const response = await drive.files.list({
        pageSize: pageSize,
        q: query,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink, thumbnailLink, size, modifiedTime)'
      });

      const files = (response.data.files || []).map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        webViewLink: file.webViewLink || undefined,
        webContentLink: file.webContentLink || undefined,
        thumbnailLink: file.thumbnailLink || undefined,
        size: file.size || undefined,
        modifiedTime: file.modifiedTime || undefined
      }));

      logger.info('Listed Drive files', { count: files.length });
      return files;
    } catch (error) {
      logger.error('Failed to list Drive files', { error });
      throw error;
    }
  }

  async getFile(auth: OAuth2Client, fileId: string): Promise<DriveFile> {
    try {
      const drive = google.drive({ version: 'v3', auth });
      
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, webViewLink, webContentLink, thumbnailLink, size, modifiedTime'
      });

      const file = response.data;
      logger.info('Retrieved Drive file', { fileId, name: file.name });
      
      return {
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        webViewLink: file.webViewLink || undefined,
        webContentLink: file.webContentLink || undefined,
        thumbnailLink: file.thumbnailLink || undefined,
        size: file.size || undefined,
        modifiedTime: file.modifiedTime || undefined
      };
    } catch (error) {
      logger.error('Failed to get Drive file', { error, fileId });
      throw error;
    }
  }

  async searchFilesByName(auth: OAuth2Client, name: string): Promise<DriveFile[]> {
    const query = `name contains '${name}' and trashed = false`;
    return this.listFiles(auth, query, 20);
  }
}
