import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional } from 'class-validator'

export class UpdateUserInput {
  @ApiPropertyOptional({
    example: 'Mohamed Elkhteeb',
    description: 'Full name of the user (optional)',
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    example: 'mohamed.elkhteeb@example.com',
    description: 'Email address of the user (optional)',
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatars/user123.png',
    description: 'URL of the user’s avatar image (optional)',
  })
  @IsString()
  @IsOptional()
  avatar?: string
}
