import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async summary() {
    const [totalCustomers, totalInvoices, totalPaidInvoices, totalUnpaidInvoices, revenue, recentInvoices] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({ where: { status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] } } }),
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
    ]);
    return { totalCustomers, totalInvoices, totalPaidInvoices, totalUnpaidInvoices, totalRevenue: revenue._sum.totalAmount || 0, recentInvoices };
  }
}
