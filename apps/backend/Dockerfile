FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock* package-lock.json* ./
COPY turbo.json ./

# Copy packages
COPY packages ./packages
COPY apps/backend ./apps/backend

# Install dependencies
RUN npm ci || npm install

# Generate Prisma client
RUN npm run --workspace=@study-platform/backend db:generate

# Build backend
RUN npm run --workspace=@study-platform/backend build

# Run migrations and start server
CMD ["sh", "-c", "npm run --workspace=@study-platform/backend db:push && npm run --workspace=@study-platform/backend start"]
