import { IsString, IsEmail, IsOptional } from "class-validator";

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
