import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  phoneOrEmail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
