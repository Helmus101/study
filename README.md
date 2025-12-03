# Study Platform - Monorepo

An educational study platform with a modern monorepo structure, featuring a Next.js frontend, Express backend, and shared TypeScript models.

## Architecture Overview

This is a full-stack monorepo using Turborepo for workspace management:

```
study-platform/
├── apps/
│   ├── backend/          # Express.js API server
│   └── frontend/         # Next.js 14 web application
├── packages/
│   └── models/           # Shared TypeScript type definitions
├── docker-compose.yml    # Local development environment
├── package.json          # Root workspace configuration
└── turbo.json            # Turborepo build pipeline config
```

### Technology Stack

#### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type safety
- **ESLint** - Code quality

#### Backend
- **Express.js** - Web framework
- **Prisma** - ORM for database
- **PostgreSQL** - Primary database
- **TypeScript** - Type safety

#### Shared
- **@study-platform/models** - Shared TypeScript interfaces
- **Turborepo** - Monorepo build orchestration
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- Docker and Docker Compose (for local database)
- npm or yarn

### Local Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd study-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example files
   cp .env.example .env.local
   cp apps/backend/.env.example apps/backend/.env.local
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

4. **Start PostgreSQL with Docker Compose:**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run database migrations:**
   ```bash
   npm run --workspace=@study-platform/backend db:push
   ```

6. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
npm run format:check
```

## Database Management

### Migrations

Create a new migration after schema changes:
```bash
npm run --workspace=@study-platform/backend db:migrate
```

Push changes without migration history:
```bash
npm run --workspace=@study-platform/backend db:push
```

Generate Prisma client:
```bash
npm run --workspace=@study-platform/backend db:generate
```

### Schema

See `apps/backend/prisma/schema.prisma` for the complete database schema.

## Docker Setup

### Local Development with Docker Compose

```bash
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend web app on port 3000

To stop:
```bash
docker-compose down
```

To view logs:
```bash
docker-compose logs -f [service-name]
```

## API Health Checks

- Frontend health: http://localhost:3000
- Backend health: http://localhost:3001/api/health
- Database health: http://localhost:3001/api/db-health

## Database Schema

### Core Entities

- **User** - Platform users with email authentication
- **Subject** - Study subjects/courses created by users
- **Task** - Study tasks/assignments linked to subjects
- **Note** - Study notes with Google Docs integration support
- **StudySession** - Time-tracked study sessions
- **CalendarEvent** - Study-related calendar events
- **File** - File attachments for notes and subjects

### Relationships

- Users have many subjects, tasks, notes, study sessions, calendar events, and files
- Subjects belong to a user and have many related records
- Notes can have associated files
- All deletions cascade from user to child records

## Critical Decision #1: Notes Storage Strategy

### Decision: Hybrid Local-First with Optional Google Docs Sync

#### Summary
Notes are stored locally in PostgreSQL as the source of truth, with optional one-way syncing to Google Docs for backup and sharing purposes.

#### Options Considered

**Option A: Local-First Hybrid (SELECTED)**
- **Storage**: PostgreSQL is the primary store
- **Google Docs**: Optional background sync for backup/sharing
- **Sync**: Periodic or event-driven sync to Docs
- **Pros**:
  - Full offline access and editing
  - Low latency (local read/write)
  - Conflict handling is deterministic
  - User retains control over sync
  - Fast full-text search on local notes
- **Cons**:
  - Must maintain sync consistency
  - Users see as "non-authoritative" source
  - Google Docs not real-time reflection of current state

**Option B: Google Docs as Source of Truth**
- **Storage**: Exclusively in Google Docs
- **Sync**: Periodic pull to local cache
- **Pros**:
  - Collaborative editing out-of-box
  - No custom sync logic needed
  - Reduced storage costs
- **Cons**:
  - Offline access difficult/impossible
  - High latency for every read
  - Dependency on Google API rate limits
  - Cannot function without internet
  - Slow to search across notes

#### Trade-off Analysis

| Factor | Local-First | Google Docs Only |
|--------|-------------|-----------------|
| **Latency** | ~10-50ms | 100-500ms+ |
| **Offline Access** | Full | None |
| **Conflict Handling** | Simple (last-write-wins) | Complex (Docs' conflict UI) |
| **Search Performance** | Fast (local DB) | Slow (API calls) |
| **Collaboration** | Manual sharing | Native Docs collab |
| **Development Complexity** | Medium | High |

#### Implementation Details

1. **Local Storage**: All note content stored in PostgreSQL
2. **Google Docs Fields**: Optional `googleDocsId` field to track synced document
3. **Sync Tracking**: `syncedAt` timestamp to track last successful sync
4. **Local Flag**: `localOnly` boolean to indicate if syncing is enabled
5. **Sync Direction**: One-way (local → Google Docs only, no pull)

#### Rationale

The local-first approach prioritizes:
1. **User Experience**: Instant feedback and offline capability
2. **Reliability**: Works without external API dependencies
3. **Performance**: Fast search and access patterns
4. **Simplicity**: Straightforward conflict resolution

Google Docs sync serves as a **backup and sharing mechanism**, not the source of truth.

#### Future Considerations

If real-time collaboration becomes critical, consider:
1. Implementing WebSocket-based multi-user editing on local notes
2. Adding Google Docs as an optional sync target (periodic background job)
3. Using operational transformation or CRDT for conflict-free collaboration
4. Adding version history with branching capabilities

---

## Project Structure Details

### apps/backend
- `src/index.ts` - Express server entry point
- `prisma/schema.prisma` - Database schema definition
- `.env.example` - Environment template
- `Dockerfile` - Container configuration

### apps/frontend
- `src/app/page.tsx` - Home page with health checks
- `src/app/layout.tsx` - Root layout
- `next.config.js` - Next.js configuration
- `.env.example` - Environment template

### packages/models
- `src/index.ts` - Shared TypeScript interfaces for all entities

## Development Workflow

1. **Feature Development**: Work in separate feature branches
2. **Database Changes**: Update `apps/backend/prisma/schema.prisma`, run migrations
3. **Type Sharing**: Export types from `packages/models` for use in frontend and backend
4. **Build & Test**: Run `npm run build` and `npm run test` before committing
5. **Linting**: Run `npm run lint` to ensure code quality

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run --workspace=@study-platform/backend db:push
```

### Port Already in Use
```bash
# Check what's using the port (e.g., port 3000)
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules apps/*/node_modules
npm install
npm run db:generate
```

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes following code style
3. Run linting and tests
4. Create a pull request

## License

MIT
