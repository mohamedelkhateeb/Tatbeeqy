import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class SellerSignupDto {
  @IsString()
  @IsNotEmpty()
  name: string // user name

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  shopName: string

  @IsString()
  @IsOptional()
  logo?: string

  @IsString()
  @IsOptional()
  banner?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  bankName?: string

  @IsString()
  @IsOptional()
  accountNumber?: string

  @IsString()
  @IsOptional()
  storeSlug?: string
}
