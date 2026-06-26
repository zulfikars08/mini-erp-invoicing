import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(255) description: string;
  @ApiProperty() @IsNumber() @Min(1) quantity: number;
  @ApiProperty() @IsNumber() @Min(0) unitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty() @IsString() @IsNotEmpty() customerId: string;
  @ApiProperty() @IsDateString() issueDate: string;
  @ApiProperty() @IsDateString() dueDate: string;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() @Min(0) taxAmount?: number;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() @Min(0) discountAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) notes?: string;
  @ApiProperty({ type: [CreateInvoiceItemDto] }) @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CreateInvoiceItemDto) items: CreateInvoiceItemDto[];
}
