# Mini ERP Invoicing System

Mini ERP web app for customer management, invoice creation, invoice status tracking, dashboard summaries, and invoice history. Built for fullstack technical test submission.

## Tech Stack

- Backend: NestJS, REST API, Swagger
- ORM: Prisma
- Database: PostgreSQL
- Auth: JWT, bcrypt password hashing
- Frontend: Next.js App Router, React Server Components capable, client-side API consumption where auth token needed
- Styling: TailwindCSS
- Language: TypeScript

## Features

- Login with JWT
- Protected frontend routes
- Customer CRUD with soft delete
- Customer search
- Invoice creation with multiple free-text items
- Backend-calculated invoice subtotal, tax, discount, total
- Invoice list/detail/history
- Invoice status update: `DRAFT`, `SENT`, `PAID`, `CANCELLED`, `OVERDUE`
- Dashboard summary cards and recent invoices
- Swagger API documentation
- Prisma seed admin user

## Architecture Overview

Monorepo split into independent backend and frontend apps:

- `backend`: NestJS modular API. Business logic lives in services, controllers stay thin. Prisma module owns DB access. JWT guard protects API routes.
- `frontend`: Next.js App Router. Central API client handles backend requests and bearer token injection. Protected layout redirects unauthenticated users to login.

This keeps apps deployable separately later, suitable stepping stone toward microservice / micro frontend split without adding premature complexity.

## Folder Structure

```txt
mini-erp-invoicing
├─ backend
│  ├─ prisma
│  │  ├─ schema.prisma
│  │  ├─ seed.ts
│  │  └─ migrations/000_init/migration.sql
│  └─ src
│     ├─ auth
│     ├─ common
│     ├─ customers
│     ├─ dashboard
│     ├─ invoices
│     ├─ prisma
│     └─ users
├─ frontend
│  └─ src
│     ├─ app
│     ├─ components
│     ├─ features
│     ├─ lib
│     └─ types
└─ docs
   ├─ API.md
   ├─ ERD.md
   └─ TESTING.md
```

## Prerequisites

- Node.js 22+
- npm 10+
- PostgreSQL 14+

## PostgreSQL Setup

Create local database:

```sql
CREATE DATABASE mini_erp;
```

Example connection string:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_erp?schema=public"
```

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Backend runs at:

```txt
http://127.0.0.1:3001/api
```

Swagger:

```txt
http://127.0.0.1:3001/api/docs
```


## Windows / WSL Localhost Note

On Windows/WSL environments, `localhost` may resolve to IPv6 `::1` and hit another relay process. If login/API calls fail, use `127.0.0.1` instead of `localhost`.

## Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

## Environment Variables

Backend `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_erp?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api
```

## Demo Account

Seeded admin:

```txt
email: admin@example.com
password: password123
role: ADMIN
```

## API Documentation

- Swagger UI: `http://127.0.0.1:3001/api/docs`
- API notes and examples: `docs/API.md`

## ERD / Database Schema

See `docs/ERD.md`.

## Build Commands

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Important Assumptions

- Frontend stores JWT in `localStorage` for technical test simplicity. Production should use secure, HttpOnly cookie plus CSRF protection as needed.
- Invoice items are free text, no product/inventory module.
- Customer delete is soft delete.
- Invoice totals from frontend are ignored; backend calculates final amounts.
- Currency display uses IDR.
- Role model supports `ADMIN` and `STAFF`, but most protected routes only require valid login for this test scope.

## Future Improvements

- Add invoice status change audit log table.
- Add refresh token flow.
- Add automated E2E tests.
- Add Docker Compose for PostgreSQL/backend/frontend.
- Add RBAC policy per endpoint.
- Add PDF invoice export.


## CI/CD

GitHub Actions validates the project on every push and pull request to `main`.

- Backend CI runs `npm ci`, Prisma generate, and NestJS build.
- Frontend CI runs `npm ci` and Next.js build.
- No database migrations or seed commands run in CI.
- Vercel handles frontend auto deployment after GitHub push.
- Render handles backend auto deployment after GitHub push.
- Neon hosts production PostgreSQL.

Backend Render env:

```env
DATABASE_URL=postgresql://USER:***@HOST.neon.tech/DB_NAME?sslmode=require
JWT_SECRET=change-me-to-a-long-random-secret
JWT_EXPIRES_IN=1d
FRONTEND_URL=https://your-vercel-url.vercel.app
NODE_ENV=production
```

Frontend Vercel env:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com/api
```

## Free Online Deployment

Recommended free stack:

- Frontend: Vercel Hobby / Free
- Backend: Render Free Web Service
- Database: Neon Free Postgres

### Backend environment variables on Render

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require
JWT_SECRET=change-me-to-a-long-random-secret
JWT_EXPIRES_IN=1d
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

`FRONTEND_URL` may contain comma-separated origins if needed. Do not use `*` with credentials enabled.

### Frontend environment variables on Vercel

```env
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com/api
```

### Render backend settings

Build Command:

```bash
npm install && npm run prisma:generate && npm run build
```

Start Command:

```bash
npm run prisma:deploy && npm run start:prod
```

Health check:

```txt
https://your-render-backend.onrender.com/api/health
```

Swagger:

```txt
https://your-render-backend.onrender.com/api/docs
```

### Deployment steps

1. Create a Neon PostgreSQL database.
2. Copy Neon `DATABASE_URL` with `sslmode=require`.
3. Deploy `backend/` to Render as a Web Service.
4. Add Render environment variables.
5. Deploy `frontend/` to Vercel.
6. Add Vercel `NEXT_PUBLIC_API_URL`.
7. Update Render `FRONTEND_URL` with the Vercel URL.
8. Redeploy backend.
9. Test login and app flow online.
10. Verify `/api/health` and `/api/docs`.

### Online QA checklist

- Backend health endpoint returns `{ "status": "ok" }`.
- Swagger opens.
- Vercel frontend opens.
- Login works online.
- Create customer works.
- Create invoice works.
- Update invoice status works.
- Dashboard updates.
- Invoice history works.

