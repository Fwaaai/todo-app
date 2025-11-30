# Todo App

Full-stack todo app with a Next.js frontend and an Express + Prisma backend. Users authenticate with a JWT stored in an httpOnly cookie and manage personal tasks.

## Prerequisites
- Node.js 22
- PostgreSQL 18

## Project structure
- `backend/` — Express API, Prisma client, and logging utilities
- `frontend/` — Next.js app router UI
- `backend/prisma/schema.prisma` — data model for users and todos
- `backend/logs/` — request/response logs (gitignored)

## Environment variables
Backend (`backend/.env`):
- `DATABASE_URL="postgresql://<user>:<password>@localhost:<port>/<database>?schema=public"`
- `SECRET_KEY=<jwt signing secret>`
- `NODE_ENV=production|development` (controls cookie security flags)

Frontend (`frontend/.env`):
- `ALLOWED_ORIGINS='["http://localhost:3000"]'` (JSON array used by Next.js `allowedDevOrigins`)

## Setup

Clone the repo, and then in the root folder:

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# set ALLOWED_ORIGINS in .env
npm run dev
```

## Running locally
- Backend listens on `http://localhost:8000`, frontend on `http://localhost:3000`.
- Ensure PostgreSQL is running and reachable via `DATABASE_URL` before starting the backend.
- Frontend and backend rely on CORS with credentials enabled; keep origins aligned with `ALLOWED_ORIGINS` and backend CORS config.

## API overview
Auth (cookie-based):
- `POST /api/users` — register; sets `auth_token` cookie and returns user data
- `POST /api/users/login` — login; sets `auth_token` cookie
- `POST /api/users/logout` — clear cookie
- `GET /api/users/me` — current user profile
- `PATCH /api/users/me/name` — change display name
- `PATCH /api/users/me/email` — change email
- `PATCH /api/users/me/password` — change password
- `POST /api/users/me/delete` — delete account

Tasks (auth required):
- `GET /api/tasks` — list tasks for current user
- `POST /api/tasks` — create task (`{ title, content }`)
- `PATCH /api/tasks/toggle` — toggle completion (`{ id }`)
- `POST /api/tasks/delete` — delete task (`{ id }`)

## Scripts
- backend: `npm run dev` — start API with tsx watcher
- frontend: `npm run dev` — Next dev server; `npm run build && npm run start` for production; `npm run lint` to check linting

## Notes
- Prisma generates client code to `backend/generated/prisma` (ignored).
- Request logs are flushed on shutdown to `backend/logs/`.
- ESModules are used throughout; switching to CommonJS will break imports.


