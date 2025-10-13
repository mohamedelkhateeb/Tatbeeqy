import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPhoneInput {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
