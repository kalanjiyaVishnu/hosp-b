# Stage 1: deps — install ALL dependencies (including dev) for building
FROM node:20-alpine AS deps
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Stage 2: builder — compile TypeScript
FROM deps AS builder
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
RUN pnpm --filter shared build
RUN cd apps/api && npx prisma generate
RUN pnpm --filter api build
RUN cd apps/api && npx tsc prisma/seed.ts --skipLibCheck --esModuleInterop

# Stage 3: runner — lean production image
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init openssl
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY apps/web/src/config/doctors.config.json /app/apps/web/src/config/doctors.config.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
RUN cd apps/api && npx prisma generate

EXPOSE 4000

# Use dumb-init to properly handle signals; run migrations then start
CMD ["dumb-init", "node", "-e", \
  "const { execSync } = require('child_process'); \
   execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: '/app/apps/api' }); \
   execSync('npx prisma db seed', { stdio: 'inherit', cwd: '/app/apps/api' }); \
   require('/app/apps/api/dist/index.js')"]
