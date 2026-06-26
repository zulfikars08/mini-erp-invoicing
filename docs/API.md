# API Documentation Notes

Swagger UI: `http://127.0.0.1:3001/api/docs`

Base URL:

```txt
http://127.0.0.1:3001/api
```

On Windows/WSL environments, `localhost` may resolve to IPv6 `::1` and hit another relay process. If login/API calls fail, use `127.0.0.1` instead of `localhost`.

## Auth Flow

1. Login via `POST /auth/login`.
2. Store `accessToken`.
3. Send protected requests with header:

```txt
Authorization: Bearer <accessToken>
```

## Main Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login | No |
| GET | `/customers` | List/search customers | Yes |
| POST | `/customers` | Create customer | Yes |
| GET | `/customers/:id` | Customer detail | Yes |
| PATCH | `/customers/:id` | Update customer | Yes |
| DELETE | `/customers/:id` | Soft delete customer | Yes |
| GET | `/invoices` | List/filter invoices | Yes |
| POST | `/invoices` | Create invoice | Yes |
| GET | `/invoices/:id` | Invoice detail | Yes |
| PATCH | `/invoices/:id/status` | Update invoice status | Yes |
| GET | `/dashboard/summary` | Dashboard summary | Yes |

## Examples

### Login

Request:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "<uuid>",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Create Customer

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "name": "PT Example Customer",
  "email": "customer@example.com",
  "phone": "08123456789",
  "address": "Jakarta",
  "companyName": "PT Example",
  "taxNumber": "01.234.567.8-999.000"
}
```

### Create Invoice

```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "customerId": "<customer-id>",
  "issueDate": "2026-01-01",
  "dueDate": "2026-01-15",
  "taxAmount": 11000,
  "discountAmount": 5000,
  "notes": "Payment due in 14 days",
  "items": [
    { "description": "Implementation", "quantity": 2, "unitPrice": 500000 },
    { "description": "Support", "quantity": 1, "unitPrice": 250000 }
  ]
}
```

Response includes backend-calculated `subtotal`, `taxAmount`, `discountAmount`, `totalAmount`, and saved `items`.

### Update Invoice Status

```http
PATCH /api/invoices/<invoice-id>/status
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "status": "PAID"
}
```

### Dashboard Summary

```http
GET /api/dashboard/summary
Authorization: Bearer <token>
```

Example response:

```json
{
  "totalCustomers": 1,
  "totalInvoices": 1,
  "totalPaidInvoices": 1,
  "totalUnpaidInvoices": 0,
  "totalRevenue": "1256000",
  "recentInvoices": []
}
```
