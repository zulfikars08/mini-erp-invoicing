import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}
  @Post() create(@Body() dto: CreateInvoiceDto, @CurrentUser() user: { id: string }) { return this.invoices.create(dto, user.id); }
  @Get() findAll(@Query() q: { status?: InvoiceStatus; customerId?: string; search?: string; page?: string; limit?: string }) { return this.invoices.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.invoices.findOne(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: UpdateInvoiceStatusDto) { return this.invoices.updateStatus(id, dto.status); }
}
