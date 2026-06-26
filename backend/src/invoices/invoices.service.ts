import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  private amounts(dto: CreateInvoiceDto) {
    if (!dto.items?.length) throw new BadRequestException('Invoice must have at least one item');
    if (new Date(dto.dueDate) < new Date(dto.issueDate)) throw new BadRequestException('Due date must be same as or after issue date');
    const items = dto.items.map((i) => ({ ...i, total: i.quantity * i.unitPrice }));
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const taxAmount = dto.taxAmount || 0;
    const discountAmount = dto.discountAmount || 0;
    if (discountAmount > subtotal) throw new BadRequestException('Discount must not exceed subtotal');
    return { items, subtotal, taxAmount, discountAmount, totalAmount: subtotal + taxAmount - discountAmount };
  }

  private async invoiceNumber(tx: Prisma.TransactionClient) {
    const year = new Date().getFullYear();
    const count = await tx.invoice.count({ where: { invoiceNumber: { startsWith: `INV-${year}-` } } });
    return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  create(dto: CreateInvoiceDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findFirst({ where: { id: dto.customerId, deletedAt: null } });
      if (!customer) throw new NotFoundException('Customer not found');
      const amount = this.amounts(dto);
      return tx.invoice.create({
        data: {
          invoiceNumber: await this.invoiceNumber(tx), customerId: dto.customerId, createdById: userId,
          issueDate: new Date(dto.issueDate), dueDate: new Date(dto.dueDate), subtotal: amount.subtotal, taxAmount: amount.taxAmount, discountAmount: amount.discountAmount, totalAmount: amount.totalAmount, notes: dto.notes,
          items: { create: amount.items.map((i) => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice, total: i.total })) },
        }, include: { customer: true, items: true },
      });
    });
  }

  async findAll(q: { status?: InvoiceStatus; customerId?: string; search?: string; page?: string; limit?: string }) {
    const page = Math.max(Number(q.page || 1), 1); const limit = Math.min(Math.max(Number(q.limit || 10), 1), 100);
    const where: Prisma.InvoiceWhereInput = { status: q.status, customerId: q.customerId };
    if (q.search) where.OR = [{ invoiceNumber: { contains: q.search, mode: 'insensitive' } }, { customer: { name: { contains: q.search, mode: 'insensitive' } } }];
    const [data, total] = await Promise.all([this.prisma.invoice.findMany({ where, include: { customer: true, items: true }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }), this.prisma.invoice.count({ where })]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id }, include: { customer: true, items: true, createdBy: { select: { id: true, name: true, email: true } } } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async updateStatus(id: string, status: InvoiceStatus) { await this.findOne(id); return this.prisma.invoice.update({ where: { id }, data: { status }, include: { customer: true, items: true } }); }
}
