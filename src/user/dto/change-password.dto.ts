import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordInput {
  @ApiProperty({
    example: 'OldPass123!',
    description: 'The current password of the user',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'NewStrongPass456!',
    description: 'The new password the user wants to set',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
