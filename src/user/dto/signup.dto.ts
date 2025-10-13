import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class SignupInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
