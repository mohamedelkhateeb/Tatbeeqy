import { IsString, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
