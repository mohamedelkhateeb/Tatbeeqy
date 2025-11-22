import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class SellerSignupDto {
  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  shopName: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsOptional()
  @IsString()
  banner?: string
}
