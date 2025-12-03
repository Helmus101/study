import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GoogleApiConfig } from '../config';
import { logger } from '../logger';

export class GoogleAuthService {
  private oauth2Client: OAuth2Client;
  private scopes: string[];

  constructor(private config: GoogleApiConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    this.scopes = config.scopes;
  }

  getAuthUrl(state?: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      prompt: 'consent',
      state: state
    });
  }

  async getTokensFromCode(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      logger.info('Successfully exchanged authorization code for tokens');
      return tokens;
    } catch (error) {
      logger.error('Failed to exchange authorization code for tokens', { error });
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      logger.info('Successfully refreshed access token');
      return credentials;
    } catch (error) {
      logger.error('Failed to refresh access token', { error });
      throw error;
    }
  }

  getClient(accessToken: string, refreshToken: string): OAuth2Client {
    const client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );
    client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    return client;
  }
}
