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
