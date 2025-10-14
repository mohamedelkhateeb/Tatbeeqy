import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class SignupInput {
  @ApiProperty({
    example: 'Mohamed Elkhteeb',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: '+201001234567',
    description: 'Phone number of the user',
  })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiPropertyOptional({
    example: 'mohamed@example.com',
    description: 'Email address of the user (optional)',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password for the account',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
