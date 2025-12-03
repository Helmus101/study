# Pronote Sync Service

This service ingests data from the Pawnote/Pronote API and exposes it over REST and GraphQL for dashboard consumption. It keeps local state in PostgreSQL (or an in-memory `pg-mem` fallback) and enriches tasks with Pronote origin metadata and time estimates.

## Features

- Pawnote API client with token management and mock mode for local development.
- Fetchers for homework, deadlines, grades, lessons and timetable entries with data mappers to the Postgres schema.
- Upsertion repository that keeps the latest Pronote data and ensures metadata integrity.
- Manual REST sync endpoint plus scheduled BullMQ/Cron worker; falls back to inline execution when Redis is unavailable.
- REST endpoints (`/tasks`, `/dashboard`) and a GraphQL endpoint (`/graphql`) exposing dashboard-ready resources.
- Structured logging via Winston so sync failures are observable.
- Jest unit tests for the data mappers.

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

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | API port | `4000` |
| `NODE_ENV` | `development`, `test`, `production` | `development` |
| `DATABASE_URL` | Postgres connection string. When omitted, `pg-mem` is used. | _none_ |
| `REDIS_URL` | Redis connection string for BullMQ. When omitted, jobs run inline without Redis. | _none_ |
| `SYNC_CRON_SCHEDULE` | Cron expression for scheduled syncs. | `0 * * * *` |
| `RUN_INITIAL_SYNC_ON_STARTUP` | Whether to perform a sync during boot. | `true` |
| `LOG_LEVEL` | Winston log level. | `info` |
| `PRONOTE_API_MODE` | `mock` or `live`. | `mock` |
| `PRONOTE_BASE_URL` | Pawnote base URL (required when `PRONOTE_API_MODE=live`). | _none_ |
| `PRONOTE_SCHOOL_ID` | Pronote school identifier. | `demo-school` |
| `PRONOTE_STUDENT_ID` | Pronote student identifier. | `demo-student` |
| `PRONOTE_CLIENT_ID` | Pawnote OAuth client ID. | `demo-client` |
| `PRONOTE_CLIENT_SECRET` | Pawnote OAuth client secret. | `demo-secret` |
| `PRONOTE_DEFAULT_TIME_ESTIMATE_MINUTES` | Default task estimate when the API does not provide one. | `45` |

## API surface

- `GET /health` – readiness probe.
- `GET /tasks` – list of tasks with Pronote `origin` metadata and `estimatedMinutes`.
- `GET /dashboard` – aggregate of tasks, deadlines, grades, lessons, timetable entries.
- `POST /sync/pronote` – triggers a manual sync via BullMQ or inline fallback. Returns HTTP 202 when accepted.
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

## Extending the schema

The Postgres schema is defined in `src/db/schema.ts`. To evolve the schema against a real Postgres instance, point `DATABASE_URL` at your database and let the service bootstrap run to execute the DDL statements. For production deployments replace the in-memory database with a managed Postgres service and provide real Pawnote credentials plus a Redis instance for the queue.
