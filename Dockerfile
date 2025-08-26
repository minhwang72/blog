# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install yarn globally and configure npm registry with fallback
RUN apk add --no-cache git && \
    yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn config set strict-ssl false

# Install dependencies with better caching and retry logic
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --network-timeout 300000 --retry 3 || \
    (echo "Retrying with npm registry..." && \
     yarn config set registry https://registry.npmjs.org/ && \
     yarn install --frozen-lockfile --network-timeout 300000 --retry 2) || \
    (echo "Final retry with yarn registry..." && \
     yarn config set registry https://registry.yarnpkg.com/ && \
     yarn install --frozen-lockfile --network-timeout 300000)

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV SKIP_DATABASE_CONNECTION=false
ENV NEXT_TELEMETRY_DISABLED=1

# Build application with optimizations
RUN yarn build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files only
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy package files for production install
COPY package.json yarn.lock ./

# Install only production dependencies with retry logic
RUN --mount=type=cache,target=/root/.yarn \
    --mount=type=cache,target=/root/.cache/yarn \
    yarn install --production --frozen-lockfile --network-timeout 300000 --retry 3 || \
    (echo "Retrying production install..." && \
     yarn install --production --frozen-lockfile --network-timeout 300000 --retry 2)

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3001

# Health check - 간단한 포트 체크로 변경
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001 || exit 1

# Start the application - 더 안전한 방법으로 수정
CMD ["node", "server.js"]
