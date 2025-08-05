# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application (without sensitive environment variables)
RUN yarn build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Install production dependencies
RUN yarn install --production --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the application
CMD ["yarn", "start"]
