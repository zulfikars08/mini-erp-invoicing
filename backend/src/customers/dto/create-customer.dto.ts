import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty() @IsString() @IsNotEmpty() @Length(2, 100) name: string;
  @ApiProperty() @IsEmail() @MaxLength(255) email: string;
  @ApiPropertyOptional() @IsOptional() @Matches(/^[0-9]{10,13}$/) phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) companyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) taxNumber?: string;
}
