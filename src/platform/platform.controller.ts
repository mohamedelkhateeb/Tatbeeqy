import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { PlatformService } from './platform.service'
import { CreatePlatformSettingDto } from './dto/create-platform-setting.dto'
import { UpdatePlatformSettingDto } from './dto/update-platform-setting.dto'
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/decorator/auth.decorator'
import { Role } from '@/auth/enum/auth.enum'
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  create(@Body() dto: CreatePlatformSettingDto) {
    return this.platformService.create(dto)
  }

  @Get()
  findAll() {
    return this.platformService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platformService.findOne(+id)
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.platformService.findByKey(key)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatformSettingDto) {
    return this.platformService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platformService.remove(+id)
  }
}
