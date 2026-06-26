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
