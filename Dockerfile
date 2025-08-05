# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
ARG HOST
ARG NODE_ENV
ARG NEXT_TELEMETRY_DISABLED
ARG SKIP_DATABASE_CONNECTION
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG OPENAI_API_KEY

ENV HOST=$HOST
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=$NEXT_TELEMETRY_DISABLED
ENV SKIP_DATABASE_CONNECTION=$SKIP_DATABASE_CONNECTION
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN yarn build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/dist/static ./dist/static

# Copy package files and install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3333

# Expose port
EXPOSE 3333

# Start the application
CMD ["node", "server.js"]
