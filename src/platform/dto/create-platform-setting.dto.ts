import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreatePlatformSettingDto {
  @IsString()
  @IsNotEmpty()
  key: string
  @IsString()
  value: string
  @IsBoolean()
  isPublic: boolean
}
