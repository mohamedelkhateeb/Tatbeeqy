import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class SellerSignupDto {
  @ApiProperty({
    example: '+201112223334',
    description: 'Phone number of the seller',
  })
  @IsString()
  @IsNotEmpty()
  phone: string
  @ApiProperty({
    example: 'StrongPassword@123',
    description: 'Password for the seller account',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: 'Ahmed Mostafa',
    description: 'Full name of the seller',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string
  @ApiProperty({
    example: 'seller@example.com',
    description: 'Email of the seller',
  })
  @IsString()
  @IsNotEmpty()
  email: string
}
