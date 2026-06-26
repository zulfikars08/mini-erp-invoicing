# Testing Report

## Build Verification

### Backend

Command:

```bash
cd backend
npm run build
```

Result:

```txt
> backend@0.0.1 build
> nest build
PASS
```

### Frontend

Command:

```bash
cd frontend
npm run build
```

Result:

```txt
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages
PASS
```

## Manual QA Checklist

| Flow | Status | Notes |
|---|---|---|
| Open frontend at `http://localhost:3000` | Ready | Requires both apps running |
| Login using seeded admin | Ready | `admin@example.com` / `password123` |
| Create customer | Ready | Uses `POST /customers` |
| Customer appears in list | Ready | Uses `GET /customers` |
| Edit customer | Ready | Uses `PATCH /customers/:id` |
| Search customer | Ready | Uses `GET /customers?search=` |
| Create invoice with multiple items | Ready | Uses `POST /invoices` |
| Open invoice detail | Ready | Uses `GET /invoices/:id` |
| Confirm backend totals | Ready | Frontend sends item qty/unitPrice only; backend returns totals |
| Update status to SENT | Ready | Uses `PATCH /invoices/:id/status` |
| Update status to PAID | Ready | Same endpoint |
| Dashboard summary changes | Ready | Uses `GET /dashboard/summary` |
| Open invoice history | Ready | Reuses invoice list endpoint |
| Logout | Ready | Clears localStorage token |
| Protected route without token redirects login | Ready | Protected layout checks token |

## API QA

Swagger expected at:

```txt
http://127.0.0.1:3001/api/docs
```

On Windows/WSL environments, `localhost` may resolve to IPv6 `::1` and hit another relay process. If login/API calls fail, use `127.0.0.1` instead of `localhost`.

Expected groups:

- auth
- customers
- invoices
- dashboard

## Database / Prisma QA

Commands:

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

Expected:

- PostgreSQL connection succeeds.
- Migration creates `User`, `Customer`, `Invoice`, `InvoiceItem`.
- Seed creates admin user.
- Invoice detail/list includes customer relation.
- Invoice items persist under invoice.

## Known Limitations

- Automated browser QA not completed in this environment because local PostgreSQL service was not available here. Manual flow is documented and app builds pass.
- JWT stored in localStorage for test simplicity. Production should use secure HttpOnly cookie.
- Invoice status history is represented by invoice list/history, no separate status audit table yet.
- Docker is not configured.

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

