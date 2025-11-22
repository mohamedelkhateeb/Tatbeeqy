import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BanSellerDto {
  @ApiProperty({ description: 'Ban status' })
  @IsBoolean()
  isBanned: boolean
}
