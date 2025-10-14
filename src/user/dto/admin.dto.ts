import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class AdminInput {
  @ApiProperty({
    example: 'Ahmed Mostafa',
    description: 'Full name of the admin user',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: '+201112223334',
    description: 'Phone number of the admin',
  })
  @IsString()
  @IsNotEmpty()
  phone: string

  @ApiPropertyOptional({
    example: 'ahmed.admin@example.com',
    description: 'Email address of the admin (optional)',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    example: 'Admin@12345',
    description: 'Password for the admin account',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: 'super_admin',
    description: 'Role of the admin user (e.g., super_admin, manager, staff)',
  })
  @IsString()
  @IsNotEmpty()
  role: string
}
