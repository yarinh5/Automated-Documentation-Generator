# Multi-stage build for Automated Documentation Generator

# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:25-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S autodocs -u 1001

# Change ownership of the app directory
RUN chown -R autodocs:nodejs /app
USER autodocs

# Expose port (if needed for future web interface)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV OPENAI_API_KEY=""

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/cli/index.js --help || exit 1

# Default command
CMD ["node", "dist/cli/index.js", "--help"]
