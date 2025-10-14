import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginInput {
  @ApiProperty({
    example: 'ahmed@example.com',
    description: 'User login identifier — can be either email or phone number',
  })
  @IsNotEmpty()
  @IsString()
  phoneOrEmail: string

  @ApiProperty({
    example: 'Password123!',
    description: 'User account password',
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
