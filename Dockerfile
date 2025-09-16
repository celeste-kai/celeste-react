# Builder stage: install dependencies and build the project
FROM node:22-slim AS builder

WORKDIR /app

# Enable corepack to make pnpm available
RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source and build
COPY . .
RUN pnpm build

# Runtime stage using nginx to serve static assets
FROM nginx:alpine AS runner

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
