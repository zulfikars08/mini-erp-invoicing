export type Role = 'ADMIN' | 'STAFF';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export type User = { id: string; name: string; email: string; role: Role };
export type Customer = { id: string; name: string; email: string; phone?: string; address?: string; companyName?: string; taxNumber?: string; createdAt: string; updatedAt: string };
export type InvoiceItem = { id: string; description: string; quantity: number; unitPrice: string | number; total: string | number };
export type Invoice = { id: string; invoiceNumber: string; customer: Customer; customerId: string; status: InvoiceStatus; issueDate: string; dueDate: string; subtotal: string | number; taxAmount: string | number; discountAmount: string | number; totalAmount: string | number; notes?: string; items?: InvoiceItem[]; createdAt: string; updatedAt?: string };
export type Paginated<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } };
export type DashboardSummary = { totalCustomers: number; totalInvoices: number; totalPaidInvoices: number; totalUnpaidInvoices: number; totalRevenue: string | number; recentInvoices: Invoice[] };
