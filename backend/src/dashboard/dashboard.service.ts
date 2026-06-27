import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const [totalCustomers, totalInvoices, totalPaidInvoices, totalUnpaidInvoices, revenue, recentInvoices, statusGroups, paidInvoices] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({ where: { status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] } } }),
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.findMany({ take: 5, orderBy: { updatedAt: 'desc' }, include: { customer: true } }),
      this.prisma.invoice.groupBy({ by: ['status'], _count: { status: true } }),
      this.prisma.invoice.findMany({ where: { status: InvoiceStatus.PAID }, include: { customer: true }, orderBy: { issueDate: 'asc' } }),
    ]);

    const revenueTrend = this.revenueTrend(paidInvoices);
    const invoiceStatusBreakdown = Object.values(InvoiceStatus).map((status) => ({
      status,
      count: statusGroups.find((group) => group.status === status)?._count.status ?? 0,
    }));
    const topCustomers = this.topCustomers(paidInvoices);

    return {
      totalCustomers,
      totalInvoices,
      totalPaidInvoices,
      totalUnpaidInvoices,
      unpaidInvoices: totalUnpaidInvoices,
      totalRevenue: Number(revenue._sum.totalAmount || 0),
      recentInvoices,
      revenueTrend,
      invoiceStatusBreakdown,
      topCustomers,
    };
  }

  private revenueTrend(invoices: { issueDate: Date; totalAmount: unknown }[]) {
    const buckets = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(label, 0);
    }

    for (const invoice of invoices) {
      const date = new Date(invoice.issueDate);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (buckets.has(label)) buckets.set(label, (buckets.get(label) || 0) + Number(invoice.totalAmount));
    }

    return [...buckets.entries()].map(([label, revenue]) => ({ label, revenue }));
  }

  private topCustomers(invoices: { customerId: string; customer: { name: string }; totalAmount: unknown }[]) {
    const map = new Map<string, { customerId: string; customerName: string; paidInvoices: number; revenue: number }>();
    for (const invoice of invoices) {
      const current = map.get(invoice.customerId) || { customerId: invoice.customerId, customerName: invoice.customer.name, paidInvoices: 0, revenue: 0 };
      current.paidInvoices += 1;
      current.revenue += Number(invoice.totalAmount);
      map.set(invoice.customerId, current);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }
}
