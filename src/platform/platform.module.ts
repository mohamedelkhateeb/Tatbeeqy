import { Module } from '@nestjs/common'
import { PlatformService } from './platform.service'
import { PlatformController } from './platform.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlatformRepository } from './platform.repository'

@Module({
  imports: [TypeOrmModule.forFeature([PlatformRepository])],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
