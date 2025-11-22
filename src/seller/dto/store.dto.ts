import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateStoreDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  storeName: string

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  phone: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner?: string

  @ApiProperty()
  @IsString()
  address: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessActivity?: string

  @ApiProperty({ enum: ['individual', 'establishment', 'company', 'charity'] })
  @IsEnum(['individual', 'establishment', 'company', 'charity'])
  entityType: 'individual' | 'establishment' | 'company' | 'charity'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaTitle?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string
}

import { PartialType } from '@nestjs/swagger'

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
