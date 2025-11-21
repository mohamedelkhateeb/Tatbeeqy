import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlatformSettingDto } from './dto/create-platform-setting.dto'
import { UpdatePlatformSettingDto } from './dto/update-platform-setting.dto'
import { PlatformRepository } from './platform.repository'

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformRepository)
    private readonly platformRepo: PlatformRepository,
  ) {}
  create(dto: CreatePlatformSettingDto) {
    const setting = this.platformRepo.create(dto)
    return this.platformRepo.save(setting)
  }
  findAll() {
    return this.platformRepo.find()
  }
  async findOne(id: number) {
    const setting = await this.platformRepo.findOne(id)
    if (!setting) throw new NotFoundException('Setting not found')
    return setting
  }
  async findByKey(key: string) {
    const setting = await this.platformRepo.findOne({ where: { key } })
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`)
    return setting
  }
  async update(id: number, dto: UpdatePlatformSettingDto) {
    const setting = await this.findOne(id)
    Object.assign(setting, dto)
    return this.platformRepo.save(setting)
  }
  async remove(id: number) {
    const setting = await this.findOne(id)
    return this.platformRepo.remove(setting)
  }
}
