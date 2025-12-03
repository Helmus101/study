FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json yarn.lock* package-lock.json* ./
COPY turbo.json ./

# Copy packages
COPY packages ./packages
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN npm ci || npm install

# Build frontend
RUN npm run --workspace=@study-platform/frontend build

# Start frontend
CMD ["npm", "run", "--workspace=@study-platform/frontend", "start"]
