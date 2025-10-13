import { IsString, IsNotEmpty } from 'class-validator';

export class ForgetPasswordInput {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
