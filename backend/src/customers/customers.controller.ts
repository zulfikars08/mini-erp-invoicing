import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customers: CustomersService) {}
  @Post() create(@Body() dto: CreateCustomerDto) { return this.customers.create(dto); }
  @Get() findAll(@Query() query: { search?: string; page?: string; limit?: string }) { return this.customers.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.customers.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.customers.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.customers.remove(id); }
}
