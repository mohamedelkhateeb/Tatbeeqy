import { IsOptional, IsString } from 'class-validator';

export class GoogleInput {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  idToken?: string;
}
