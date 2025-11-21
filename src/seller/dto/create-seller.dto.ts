import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator'

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  shopName: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  logo: string

  @IsString()
  banner: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsOptional()
  @IsString()
  metaTitle?: string

  @IsOptional()
  @IsString()
  metaDescription?: string

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean

  @IsBoolean()
  @IsOptional()
  is_banned?: boolean

  @IsNumber()
  @IsOptional()
  userId: number

  @IsOptional()
  bank?: any // will be validated separately
}
