# Setup Guide

This guide walks through setting up the Study Platform monorepo for local development.

## Prerequisites

Before starting, ensure you have:

- **Node.js**: >= 18.17.0 ([Download](https://nodejs.org/))
- **npm**: >= 9.0.0 (comes with Node.js)
- **Docker & Docker Compose**: For PostgreSQL database
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop) (recommended)
  - Or: [Docker CLI](https://docs.docker.com/engine/install/) + [Docker Compose CLI](https://docs.docker.com/compose/install/)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier - Code formatter
  - TypeScript Vue Plugin (Volar)

## Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone <repo-url>
cd study-platform

# 2. Install dependencies
npm install

# 3. Setup environment files
cp .env.example .env.local
cp apps/backend/.env.example apps/backend/.env.local
cp apps/frontend/.env.example apps/frontend/.env.local

# 4. Start PostgreSQL
docker compose up -d postgres

# 5. Run database migrations
cd apps/backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/study_platform" npm run db:push
cd ../..

# 6. Start development servers
npm run dev
```

Done! Open http://localhost:3000 in your browser.

---

## Detailed Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd study-platform
```

### 2. Install Node.js

Check if you have Node.js installed:
```bash
node --version  # Should be >= 18.17.0
npm --version   # Should be >= 9.0.0
```

If not, [download Node.js](https://nodejs.org/) (LTS version recommended).

### 3. Install Project Dependencies

```bash
npm install
```

This will:
- Install root dependencies (prettier, turbo)
- Install all workspace dependencies
- Set up npm symlinks between packages

**Time**: ~2-3 minutes

### 4. Configure Environment Variables

The project uses environment files for configuration. Copy example files:

```bash
cp .env.example .env.local
cp apps/backend/.env.example apps/backend/.env.local
cp apps/frontend/.env.example apps/frontend/.env.local
```

View and verify the values in each `.env.local` file:

**.env.local** (root):
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=study_platform
```

**apps/backend/.env.local**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/study_platform"
NODE_ENV="development"
PORT=3001
```

**apps/frontend/.env.local**:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 5. Start PostgreSQL Database

Using Docker Compose (recommended):

```bash
docker compose up -d postgres
```

Verify it's running:
```bash
docker compose ps
```

You should see:
```
NAME                  IMAGE                COMMAND             SERVICE    STATUS
study_platform_db     postgres:16-alpine   "postgres"          postgres   Up
```

**Troubleshooting**:
- If port 5432 is already in use: `lsof -i :5432`
- Check logs: `docker compose logs postgres`
- Restart: `docker compose down && docker compose up -d postgres`

### 6. Initialize the Database

Run Prisma migrations to create tables:

```bash
cd apps/backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/study_platform" npm run db:push
cd ../..
```

Or use the shortcut script:
```bash
npm run db:push
```

You should see:
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "study_platform"
🚀  Your database is now in sync with your Prisma schema. Done in XXXms
```

**What this does**:
- Creates all database tables from schema
- Creates indexes for performance
- Generates Prisma client

### 7. Start Development Servers

Start all development servers with one command:

```bash
npm run dev
```

This runs:
- **Frontend**: http://localhost:3000 (Next.js dev server)
- **Backend**: http://localhost:3001 (Express dev server)
- **Turbo**: Watches for changes and rebuilds

You'll see output like:
```
✓ built packages/models
✓ built apps/backend
▲ Next.js 14.2.33
- Local: http://localhost:3000
✓ compiled client and server successfully
Backend server running on port 3001
```

### 8. Verify Everything Works

Open http://localhost:3000 in your browser.

You should see:
- ✓ "Study Platform" heading
- ✓ "Frontend: ✓ Running"
- ✓ "Backend: ✓ Connected" (after a moment)

Test the backend directly:
```bash
curl http://localhost:3001/api/health
# Response: {"status":"ok","service":"backend"}

curl http://localhost:3001/api/db-health
# Response: {"status":"ok","database":"connected"}
```

---

## Common Tasks

### Building for Production

```bash
npm run build
```

Builds:
- Frontend (Next.js optimized)
- Backend (TypeScript compiled)
- Models (Type definitions)

Output in:
- `apps/frontend/.next/`
- `apps/backend/dist/`
- `packages/models/dist/`

### Code Quality

```bash
# Lint all code
npm run lint

# Format code
npm run format

# Check formatting without changing
npm run format:check
```

### Database Commands

```bash
# Create a new migration after schema changes
cd apps/backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/study_platform" npm run db:migrate

# Generate Prisma client (auto-run by build)
npm run db:generate
```

### Testing

```bash
npm run test
```

(Currently not configured; next phase)

### Debugging

#### Backend Server Issues

```bash
# Check if port 3001 is in use
lsof -i :3001

# Check backend logs while running dev
npm run dev  # Watch for backend errors

# Test database connection
cd apps/backend
DATABASE_URL="..." npm run db:push
```

#### Frontend Server Issues

```bash
# Check if port 3000 is in use
lsof -i :3000

# Clear Next.js cache
rm -rf apps/frontend/.next

# Rebuild
npm run build
```

#### Database Issues

```bash
# Check Docker
docker compose ps
docker compose logs postgres

# Connect directly
docker compose exec postgres psql -U postgres -d study_platform

# Reset database (⚠️ deletes all data)
docker compose down -v
docker compose up -d postgres
npm run db:push
```

---

## Project Structure

```
study-platform/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts          # Express server
│   │   ├── prisma/
│   │   │   └── schema.prisma     # Database schema
│   │   ├── dist/                 # Compiled output
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── .env.local
│   │
│   └── frontend/
│       ├── src/
│       │   └── app/
│       │       ├── page.tsx       # Home page
│       │       ├── layout.tsx     # Root layout
│       │       └── globals.css    # Styles
│       ├── .next/                 # Built output
│       ├── public/                # Static assets
│       ├── package.json
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── Dockerfile
│       └── .env.local
│
├── packages/
│   └── models/
│       ├── src/
│       │   └── index.ts           # Shared TypeScript types
│       ├── dist/
│       ├── package.json
│       └── tsconfig.json
│
├── .gitignore
├── .prettierrc                     # Code formatting
├── .eslintrc.js                    # Linting
├── package.json                    # Root workspace
├── turbo.json                      # Build pipeline
├── docker-compose.yml              # Local environment
├── README.md                        # Project overview
├── DECISIONS.md                     # Architecture decisions
└── SETUP.md                         # This file
```

---

## Development Workflow

### Creating a Feature

1. Create a feature branch:
   ```bash
   git checkout -b feat/feature-name
   ```

2. Make changes to the code

3. Test locally:
   ```bash
   npm run lint
   npm run build
   npm run test
   ```

4. Commit with descriptive message:
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

5. Push and create pull request:
   ```bash
   git push origin feat/feature-name
   ```

### Database Schema Changes

1. Update `apps/backend/prisma/schema.prisma`

2. Create migration:
   ```bash
   cd apps/backend
   DATABASE_URL="..." npm run db:migrate
   ```

3. Review migration file in `prisma/migrations/`

4. Commit migration:
   ```bash
   git add prisma/migrations/
   git commit -m "prisma: add new table/column"
   ```

### Adding Shared Types

1. Add types to `packages/models/src/index.ts`

2. Build:
   ```bash
   npm run --workspace=@study-platform/models build
   ```

3. Import in backend or frontend:
   ```typescript
   import type { User } from '@study-platform/models';
   ```

---

## Docker Operations

### See All Services

```bash
docker compose ps
```

### View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs postgres
docker compose logs backend
docker compose logs frontend

# Live updates
docker compose logs -f postgres
```

### Stop Services

```bash
# Stop without removing
docker compose stop

# Stop and remove
docker compose down

# Remove volumes (database)
docker compose down -v
```

### Rebuild Images

```bash
docker compose up -d --build postgres
```

---

## Troubleshooting

### "npm ERR! code ERESOLVE"

This happens with conflicting dependencies. Try:

```bash
npm install --legacy-peer-deps
```

### "Database connection refused"

Check if PostgreSQL is running:

```bash
docker compose ps postgres
docker compose logs postgres
```

### "Port already in use"

Find and kill the process:

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### "Module not found" errors

Rebuild dependencies:

```bash
rm -rf node_modules
npm install
npm run build
```

### Prisma Client errors

Regenerate Prisma client:

```bash
cd apps/backend
DATABASE_URL="..." npm run db:generate
```

---

## Getting Help

1. **Check README.md** for project overview
2. **Check DECISIONS.md** for architecture choices
3. **Check error messages** - they're usually helpful
4. **Check TypeScript types** - hover in VS Code to see type info
5. **Ask team members** - we're here to help!

---

## Next Steps

After setup is complete:

1. **Review the codebase**: Explore `apps/`, `packages/` structure
2. **Read DECISIONS.md**: Understand architecture decisions
3. **Check out the API**: Test health endpoints
4. **Run the frontend**: Verify it connects to backend
5. **Explore the database**: Connect with PostgreSQL client
6. **Make a change**: Try editing a file and see hot reload work

---

## Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Docker Documentation](https://docs.docker.com/)

---

**Happy coding! 🚀**
