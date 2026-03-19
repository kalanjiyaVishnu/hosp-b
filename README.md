# Hospital Website & Slot Booking Monorepo

Complete monorepo for a Modern Hospital Website with Patient Slot Booking functionality.

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: React 18 + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **ORM**: Prisma + PostgreSQL
- **Auth**: JWT (access + refresh)
- **Email**: Nodemailer

## Quick Start — Docker (Production)

1. Clone the repo
2. `cp .env.docker .env`   # fill in SMTP and JWT secrets
3. `docker compose up --build -d`
4. `docker compose exec api npx prisma db seed`
5. Open http://localhost

## Quick Start — Local Dev (Hot Reload)

1. `pnpm install`
2. `cp apps/api/.env.example apps/api/.env`  # fill in values
3. `pnpm db:migrate`
4. `pnpm db:seed`
5. `pnpm dev`
   # API: http://localhost:4000
   # Web: http://localhost:5173

## Quick Start — Docker Dev (Hot Reload in Containers)

3. `pnpm run docker:dev`
   # Web (Vite): http://localhost:5173
   # API:        http://localhost:4000
   # DB (Host):  localhost:5433
