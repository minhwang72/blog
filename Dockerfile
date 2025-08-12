# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies with cache optimization
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV SKIP_DATABASE_CONNECTION=false
ENV NEXT_TELEMETRY_DISABLED=1

# Build application with optimizations
RUN yarn build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files only
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy package files for production install
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile --network-timeout 100000

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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application - 더 안전한 방법으로 수정
CMD ["node", "server.js"]
