import { GoogleAuthService } from '../src/google/auth';
import { GoogleApiConfig } from '../src/config';

describe('Google Integration', () => {
  const mockConfig: GoogleApiConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:4000/auth/google/callback',
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/calendar.readonly'
    ]
  };

  describe('GoogleAuthService', () => {
    it('should generate OAuth URL with correct parameters', () => {
      const authService = new GoogleAuthService(mockConfig);
      const authUrl = authService.getAuthUrl('test-user');
      
      expect(authUrl).toContain('accounts.google.com/o/oauth2/v2/auth');
      expect(authUrl).toContain('client_id=test-client-id');
      expect(authUrl).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fgoogle%2Fcallback');
      expect(authUrl).toContain('scope=');
      expect(authUrl).toContain('access_type=offline');
      expect(authUrl).toContain('state=test-user');
    });

    it('should include all required scopes in OAuth URL', () => {
      const authService = new GoogleAuthService(mockConfig);
      const authUrl = authService.getAuthUrl();
      
      expect(authUrl).toContain('documents');
      expect(authUrl).toContain('drive.readonly');
      expect(authUrl).toContain('calendar.readonly');
    });
  });
});
