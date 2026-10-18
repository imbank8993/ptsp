# ==============================================================================
# Dockerfile for PTSP Frontend (Next.js)
# ==============================================================================

# ── 1. Build Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Invalidate cache for fresh application build
ARG CACHEBUST=1

COPY tsconfig.json postcss.config.mjs next.config.mjs ./
COPY public ./public
COPY src ./src

RUN npm run build

# ── 2. Production Stage ───────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

# Run as non-root user
USER node

COPY --chown=node:node package.json package-lock.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/next.config.mjs ./next.config.mjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

CMD ["npm", "run", "start"]
