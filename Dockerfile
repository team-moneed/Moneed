# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./
COPY packages/shared/auth/package.json ./packages/shared/auth/
COPY packages/shared/utils/package.json ./packages/shared/utils/
COPY packages/shared/utility-types/package.json ./packages/shared/utility-types/
COPY apps/kakao-proxy-server/package.json ./apps/kakao-proxy-server/

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Build stage
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build shared packages first
RUN yarn workspace @moneed/utility-types build
RUN yarn workspace @moneed/utils build  
RUN yarn workspace @moneed/auth build

# Generate Prisma client for kakao proxy server
RUN cd apps/kakao-proxy-server && yarn db:generate

# Build kakao proxy server
RUN yarn workspace @moneed/kakao-proxy-server build

# Production stage
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache curl

ENV NODE_ENV production
ENV PORT 8000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/kakao-proxy-server/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["node", "dist/src/index.js"]
