import { IsOptional, IsString } from 'class-validator';

export class GoogleDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  idToken?: string;
}
