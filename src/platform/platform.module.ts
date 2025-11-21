import { Module } from '@nestjs/common'
import { PlatformService } from './platform.service'
import { PlatformController } from './platform.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlatformRepository } from './platform.repository'
import { UserModule } from '@/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([PlatformRepository]) ,UserModule],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformModule {}
