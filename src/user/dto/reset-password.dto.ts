import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordInput {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
