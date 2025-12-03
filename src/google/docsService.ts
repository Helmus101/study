import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { logger } from '../logger';

export class GoogleDocsService {
  async createDoc(auth: OAuth2Client, title: string, content?: string): Promise<{ docId: string; url: string }> {
    try {
      const docs = google.docs({ version: 'v1', auth });
      
      const createResponse = await docs.documents.create({
        requestBody: {
          title: title
        }
      });

      const docId = createResponse.data.documentId!;
      const url = `https://docs.google.com/document/d/${docId}/edit`;

      if (content) {
        await docs.documents.batchUpdate({
          documentId: docId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: {
                    index: 1
                  },
                  text: content
                }
              }
            ]
          }
        });
      }

      logger.info('Created Google Doc', { docId, title });
      return { docId, url };
    } catch (error) {
      logger.error('Failed to create Google Doc', { error, title });
      throw error;
    }
  }

  async updateDoc(auth: OAuth2Client, docId: string, content: string): Promise<void> {
    try {
      const docs = google.docs({ version: 'v1', auth });
      
      const doc = await docs.documents.get({ documentId: docId });
      const endIndex = doc.data.body?.content?.[0]?.endIndex || 1;

      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              deleteContentRange: {
                range: {
                  startIndex: 1,
                  endIndex: endIndex
                }
              }
            },
            {
              insertText: {
                location: {
                  index: 1
                },
                text: content
              }
            }
          ]
        }
      });

      logger.info('Updated Google Doc', { docId });
    } catch (error) {
      logger.error('Failed to update Google Doc', { error, docId });
      throw error;
    }
  }

  async getDocContent(auth: OAuth2Client, docId: string): Promise<string> {
    try {
      const docs = google.docs({ version: 'v1', auth });
      const doc = await docs.documents.get({ documentId: docId });
      
      let content = '';
      doc.data.body?.content?.forEach((element) => {
        if (element.paragraph) {
          element.paragraph.elements?.forEach((el) => {
            if (el.textRun?.content) {
              content += el.textRun.content;
            }
          });
        }
      });

      return content;
    } catch (error) {
      logger.error('Failed to get Google Doc content', { error, docId });
      throw error;
    }
  }
}
