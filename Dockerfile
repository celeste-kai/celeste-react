# Builder stage: install dependencies and build the project
FROM node:22-slim AS builder

WORKDIR /app

# Enable corepack to make pnpm available
RUN corepack enable

# Copy dependency manifests and install dependencies (including dev deps for the build)
COPY package.json pnpm-lock.yaml ./

ARG VITE_API_BASE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

RUN pnpm install --frozen-lockfile --production=false

# Copy the rest of the source and build
COPY . .
RUN pnpm build

# Prune the pnpm store to reduce layer size
RUN pnpm store prune

# Runtime stage using nginx to serve static assets
FROM nginx:alpine AS runner

ENV NODE_ENV=production

# Replace the default nginx configuration with our SPA-friendly config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
