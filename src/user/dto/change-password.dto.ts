import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePasswordInput {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
