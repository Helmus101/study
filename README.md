# Pronote Sync Service with Google Integration

This service ingests data from the Pawnote/Pronote API and Google services (Docs, Drive, Calendar), exposing it over REST and GraphQL for dashboard consumption. It keeps local state in PostgreSQL (or an in-memory `pg-mem` fallback) and enriches tasks with Pronote origin metadata and time estimates.

## Features

### Pronote Integration
- Pawnote API client with token management and mock mode for local development.
- Fetchers for homework, deadlines, grades, lessons and timetable entries with data mappers to the Postgres schema.
- Upsertion repository that keeps the latest Pronote data and ensures metadata integrity.
- Manual REST sync endpoint plus scheduled BullMQ/Cron worker; falls back to inline execution when Redis is unavailable.

### Google Integration
- **Google OAuth 2.0** with refresh token storage for long-lived access
- **Google Docs Sync**: Auto-create and sync Google Docs per task note with bidirectional updates
- **Google Drive**: Query and mirror Drive files referenced by tasks
- **Google Calendar**: Fetch calendar events and merge with Pronote schedule
- **Exam Countdown**: Automatically detect exam events and calculate days until due
- **Mini-Calendar**: View merged Pronote + Google Calendar events in unified interface

### API & Observability
- REST endpoints (`/tasks`, `/dashboard`, `/calendar/merged`) and GraphQL endpoint (`/graphql`)
- Structured logging via Winston so sync failures are observable
- Jest unit tests for data mappers

## Getting started

```bash
# install dependencies
npm install

# run tests
npm test

# start the service in dev mode
npm run dev
```

The default configuration uses mock Pawnote responses and the in-memory database so you can run the service without any external systems. To run the compiled build use:

```bash
npm run build
npm start
```

## Configuration

Environment variables are parsed through `src/config.ts` (validated with `zod`). Create a `.env` file or export the variables below:

### Core Configuration

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | API port | `4000` |
| `NODE_ENV` | `development`, `test`, `production` | `development` |
| `DATABASE_URL` | Postgres connection string. When omitted, `pg-mem` is used. | _none_ |
| `REDIS_URL` | Redis connection string for BullMQ. When omitted, jobs run inline without Redis. | _none_ |
| `SYNC_CRON_SCHEDULE` | Cron expression for scheduled syncs. | `0 * * * *` |
| `RUN_INITIAL_SYNC_ON_STARTUP` | Whether to perform a sync during boot. | `true` |
| `LOG_LEVEL` | Winston log level. | `info` |

### Pronote Configuration

| Variable | Description | Default |
| --- | --- | --- |
| `PRONOTE_API_MODE` | `mock` or `live`. | `mock` |
| `PRONOTE_BASE_URL` | Pawnote base URL (required when `PRONOTE_API_MODE=live`). | _none_ |
| `PRONOTE_SCHOOL_ID` | Pronote school identifier. | `demo-school` |
| `PRONOTE_STUDENT_ID` | Pronote student identifier. | `demo-student` |
| `PRONOTE_CLIENT_ID` | Pawnote OAuth client ID. | `demo-client` |
| `PRONOTE_CLIENT_SECRET` | Pawnote OAuth client secret. | `demo-secret` |
| `PRONOTE_DEFAULT_TIME_ESTIMATE_MINUTES` | Default task estimate when the API does not provide one. | `45` |

### Google Integration Configuration

| Variable | Description | Default |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID from Google Cloud Console | `demo-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret | `demo-google-client-secret` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL (must match Google Cloud Console) | `http://localhost:4000/auth/google/callback` |
| `GOOGLE_SCOPES` | Comma-separated OAuth scopes | Auto: `documents,drive.readonly,calendar.readonly` |

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Google Docs API
   - Google Drive API
   - Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:4000/auth/google/callback` (development)
   - `https://your-domain.com/auth/google/callback` (production)
7. Copy the Client ID and Client Secret to your `.env` file

## API surface

### Core Endpoints

- `GET /health` – readiness probe.
- `GET /tasks` – list of tasks with Pronote `origin` metadata and `estimatedMinutes`.
- `GET /dashboard` – aggregate of tasks, deadlines, grades, lessons, timetable entries.
- `POST /sync/pronote` – triggers a manual sync via BullMQ or inline fallback. Returns HTTP 202 when accepted.

### Google OAuth Endpoints

- `GET /auth/google?userId=<userId>` – generates Google OAuth URL for user to authenticate. Returns `{ authUrl }`.
- `GET /auth/google/callback?code=<code>&state=<userId>` – OAuth callback that exchanges code for tokens and stores refresh token.
- `GET /google/status?userId=<userId>` – check if user has connected Google account. Returns `{ connected, userId, scopes }`.
- `POST /google/disconnect` – disconnect Google account (body: `{ userId }`).

### Google Sync Endpoints

- `POST /sync/google/calendar` – sync Google Calendar events (body: `{ userId, daysAhead }`). Returns `{ status, eventsSynced }`.
- `POST /tasks/:taskId/sync-note` – create or update Google Doc for task note (body: `{ userId }`). Returns `{ status, googleDocId, googleDocUrl }`.

### Calendar & Events Endpoints

- `GET /calendar/events?startDate=<iso>&endDate=<iso>` – get Google Calendar events in date range.
- `GET /calendar/merged?startDate=<iso>&endDate=<iso>` – **get merged Pronote + Google Calendar events**. Returns events from both sources sorted by time.
- `GET /calendar/exams?userId=<userId>` – get exam countdown with days until each exam.

### GraphQL Endpoint

- `POST /graphql` (served at `/graphql`) – GraphQL endpoint exposing `tasks` and `dashboardSummary` queries. Example:

```graphql
query DashboardSummary {
  dashboardSummary {
    tasks { id title dueDate estimatedMinutes origin { system category referenceId } }
    deadlines { id label dueDate }
  }
}
```

## Sync worker & observability

The `PronoteSyncQueue` wires BullMQ with a cron trigger. When `REDIS_URL` is set the queue persists jobs to Redis; otherwise the service executes syncs inline and still respects the cron schedule. All sync lifecycle events (`start`, `completed`, `failed`) are logged via Winston so they can be scraped by your logging stack.

## Testing strategy

Mapper unit tests live under `tests/pronoteMapper.test.ts` and verify the translation between Pawnote payloads and DB records. Additional tests can be added for repositories or resolvers by following the same Jest setup defined in `jest.config.ts`.

## Google Integration Usage Examples

### 1. Connect Google Account

```bash
# Get OAuth URL
curl http://localhost:4000/auth/google?userId=student123

# User visits the authUrl and authorizes
# They are redirected to /auth/google/callback which stores the tokens
```

### 2. Sync Google Calendar Events

```bash
# Sync next 30 days of events
curl -X POST http://localhost:4000/sync/google/calendar \
  -H "Content-Type: application/json" \
  -d '{"userId":"student123","daysAhead":30}'
```

### 3. Create/Update Google Doc for Task Note

```bash
# Create a Google Doc linked to a task
curl -X POST http://localhost:4000/tasks/task-123/sync-note \
  -H "Content-Type: application/json" \
  -d '{"userId":"student123"}'

# Returns: { status: "success", googleDocId: "...", googleDocUrl: "..." }
```

### 4. Get Merged Calendar (Pronote + Google)

```bash
# Get all events from both sources
curl "http://localhost:4000/calendar/merged?startDate=2024-12-01T00:00:00Z&endDate=2024-12-31T23:59:59Z"

# Returns merged events with source indicators (pronote/google-calendar)
```

### 5. Get Exam Countdown

```bash
curl http://localhost:4000/calendar/exams?userId=student123

# Returns: { data: [{ title: "Math Final", daysUntil: 12, date: "..." }] }
```

## Mini-Calendar UI Decision

We have prototyped two approaches for the mini-calendar interface:

- **Prototype A**: Fixed Canvas Layout (`prototypes/mini-calendar-fixed.html`)
- **Prototype B**: Customizable Layout (`prototypes/mini-calendar-customizable.html`)

**Decision**: We chose **Fixed Canvas Layout** for the MVP (Phase 1) to:
- Accelerate time to market (2-3 days vs 7-10 days)
- Validate core data merging first
- Ensure mobile-first responsiveness
- Simplify accessibility compliance

See `docs/DECISION-MINI-CALENDAR-UI.md` for full analysis, comparison matrix, technical implications, and migration path to customizable layout in future phases.

## Database Schema

The Postgres schema is defined in `src/db/schema.ts` and includes:

**Core Tables:**
- `tasks` - Task records with Pronote origin metadata
- `deadlines` - Deadline records
- `grades` - Grade records
- `lessons` - Lesson/class records
- `timetable_entries` - Timetable entries

**Google Integration Tables:**
- `google_oauth_tokens` - Stores refresh tokens per user (secure, long-lived access)
- `task_notes` - Links tasks to Google Docs with sync status
- `calendar_events` - Cached Google Calendar events merged with Pronote

To evolve the schema against a real Postgres instance, point `DATABASE_URL` at your database and let the service bootstrap run to execute the DDL statements. For production deployments replace the in-memory database with a managed Postgres service and provide real Pawnote credentials, Google OAuth credentials, and a Redis instance for the queue.

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Pawnote API   │      │   Google APIs    │      │   PostgreSQL    │
│   (Pronote)     │      │ (Docs/Drive/Cal) │      │   or pg-mem     │
└────────┬────────┘      └────────┬─────────┘      └────────┬────────┘
         │                        │                         │
         │                        │                         │
         ▼                        ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Sync Service (Express)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Pronote   │  │    Google    │  │   Repository Layer     │ │
│  │ Sync Worker │  │ Sync Service │  │  (Task/Calendar/Token) │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         │                        │                         │
         └────────────────────────┴─────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   REST + GraphQL APIs    │
                    │  - /tasks, /dashboard    │
                    │  - /calendar/merged      │
                    │  - /auth/google          │
                    │  - /graphql              │
                    └──────────────────────────┘
```

## Extending the schema

To add new tables or modify existing ones, update `src/db/schema.ts` and restart the service. The DDL statements will be executed automatically on startup.
