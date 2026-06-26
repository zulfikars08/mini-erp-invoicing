import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCustomerDto) { return this.prisma.customer.create({ data: dto }); }

  async findAll(query: { search?: string; page?: string; limit?: string }) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const where: Prisma.CustomerWhereInput = { deletedAt: null };
    if (query.search) where.OR = ['name','email','companyName'].map((field) => ({ [field]: { contains: query.search, mode: 'insensitive' } }));
    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.customer.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id, deletedAt: null } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) { await this.findOne(id); return this.prisma.customer.update({ where: { id }, data: dto }); }
  async remove(id: string) { await this.findOne(id); return this.prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } }); }
}
