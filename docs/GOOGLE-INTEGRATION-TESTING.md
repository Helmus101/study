# Google Integration Testing Guide

This guide walks through testing the Google OAuth and sync features.

## Prerequisites

1. **Google Cloud Console Setup**:
   - Create a project at https://console.cloud.google.com/
   - Enable APIs: Google Docs, Google Drive, Google Calendar
   - Create OAuth 2.0 credentials (Web application)
   - Add redirect URI: `http://localhost:4000/auth/google/callback`
   - Copy Client ID and Client Secret to `.env` file

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env and add your Google credentials:
   # GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   # GOOGLE_CLIENT_SECRET=your-actual-secret
   ```

3. **Start the Service**:
   ```bash
   npm install
   npm run dev
   ```

## Test Scenarios

### 1. Google OAuth Connection

**Test**: User connects their Google account

```bash
# Step 1: Get OAuth URL
curl http://localhost:4000/auth/google?userId=student123

# Response:
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}

# Step 2: Visit the authUrl in browser, authorize the app
# You'll be redirected to: http://localhost:4000/auth/google/callback?code=...&state=student123

# Step 3: Verify connection status
curl http://localhost:4000/google/status?userId=student123

# Expected Response:
{
  "connected": true,
  "userId": "student123",
  "scopes": "https://www.googleapis.com/auth/documents ..."
}
```

### 2. Sync Google Calendar Events

**Test**: Fetch and cache Google Calendar events

```bash
# Sync next 30 days of calendar events
curl -X POST http://localhost:4000/sync/google/calendar \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "student123",
    "daysAhead": 30
  }'

# Expected Response:
{
  "status": "success",
  "eventsSynced": 15
}

# Verify events were stored
curl "http://localhost:4000/calendar/events?startDate=$(date -u +%Y-%m-%dT%H:%M:%SZ)&endDate=$(date -u -d '+30 days' +%Y-%m-%dT%H:%M:%SZ)"
```

### 3. Create Google Doc for Task Note

**Prerequisites**: Create a task first via Pronote sync

```bash
# Trigger Pronote sync (creates demo tasks)
curl -X POST http://localhost:4000/sync/pronote

# Get tasks to find a task ID
curl http://localhost:4000/tasks

# Create/sync Google Doc for a task
curl -X POST http://localhost:4000/tasks/TASK_ID_HERE/sync-note \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123"}'

# Expected Response:
{
  "status": "success",
  "googleDocId": "1abc...xyz",
  "googleDocUrl": "https://docs.google.com/document/d/1abc...xyz/edit"
}

# Visit the googleDocUrl in browser to see the created Google Doc
```

### 4. Get Merged Calendar (Pronote + Google)

**Test**: View combined events from both sources

```bash
# Get merged events for December 2024
curl "http://localhost:4000/calendar/merged?startDate=2024-12-01T00:00:00Z&endDate=2024-12-31T23:59:59Z"

# Expected Response:
{
  "data": [
    {
      "id": "...",
      "source": "pronote",
      "title": "Mathematics - Prof. Martin",
      "startTime": "2024-12-03T08:00:00Z",
      "endTime": "2024-12-03T09:00:00Z",
      ...
    },
    {
      "id": "...",
      "source": "google-calendar",
      "title": "Study Group Meeting",
      "startTime": "2024-12-03T10:00:00Z",
      "endTime": "2024-12-03T10:30:00Z",
      ...
    }
  ],
  "sources": ["google-calendar", "pronote"]
}
```

### 5. Exam Countdown

**Test**: Get upcoming exams with countdown

```bash
# Get exam countdown (requires calendar events with "exam" in title)
curl http://localhost:4000/calendar/exams?userId=student123

# Expected Response:
{
  "data": [
    {
      "title": "Math Final Exam",
      "daysUntil": 12,
      "date": "2024-12-15T09:00:00Z"
    },
    {
      "title": "Physics Test",
      "daysUntil": 18,
      "date": "2024-12-21T14:00:00Z"
    }
  ]
}
```

### 6. Disconnect Google Account

**Test**: Revoke Google integration

```bash
curl -X POST http://localhost:4000/google/disconnect \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123"}'

# Expected Response:
{
  "status": "success",
  "message": "Google account disconnected"
}

# Verify disconnection
curl http://localhost:4000/google/status?userId=student123

# Expected:
{
  "connected": false,
  "userId": "student123"
}
```

## Mock Testing (Without Real Google Account)

For development without Google credentials, the system uses defaults:

```bash
# Set mock mode in .env
GOOGLE_CLIENT_ID=demo-google-client-id
GOOGLE_CLIENT_SECRET=demo-google-client-secret

# Start the service
npm run dev

# The OAuth URLs will still be generated, but won't work without real credentials
# You can test the API structure and responses
```

## Acceptance Criteria Checklist

- [x] User can connect Google account via OAuth flow
- [x] Backend stores refresh tokens securely in database
- [x] Mock task note creates Google Doc with task details
- [x] Updating task note updates the linked Google Doc
- [x] Calendar endpoint returns merged Pronote + Google events
- [x] Events are properly sorted by start time
- [x] Exam countdown identifies exam events from calendar
- [x] README documents Google integration setup
- [x] Mini-calendar prototypes demonstrate UI decision
- [x] Decision document (`DECISION-MINI-CALENDAR-UI.md`) explains trade-offs

## Troubleshooting

### Error: "Failed to exchange authorization code"
- Verify `GOOGLE_REDIRECT_URI` matches exactly in Google Cloud Console
- Check that the authorization code hasn't expired (valid for 10 minutes)

### Error: "No Google OAuth token found"
- User needs to complete OAuth flow first
- Check database for token: `SELECT * FROM google_oauth_tokens WHERE user_id='student123'`

### Error: "Insufficient Permission"
- Verify all required scopes are enabled in Google Cloud Console
- User may need to re-authorize with updated scopes

### Calendar Events Not Appearing
- Ensure Google Calendar has events in the date range
- Check that calendar is not private/hidden
- Verify user authorized Calendar API scope

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [Google Docs API](https://developers.google.com/docs/api/how-tos/overview)
- [Google Drive API](https://developers.google.com/drive/api/guides/about-sdk)
