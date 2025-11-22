import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SellerService } from './seller.service'
import { SellerController } from './seller.controller'
import { RolesGuard } from '@/auth/roles.guard'

import { SellerRepository } from './seller.repository'
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'

// Import the module that contains AuthGuard, UserRepository, SessionRepository, JwtService
import { UserModule } from '@/user/user.module'

@Module({
  imports: [
    UserModule, // <-- provides AuthGuard + JwtService + User/Session
    TypeOrmModule.forFeature([SellerRepository, Seller, Bank]),
  ],
  controllers: [SellerController],
  providers: [SellerService, RolesGuard], // AuthGuard is already provided via UserModule
  exports: [SellerService],
})
export class SellerModule {}
