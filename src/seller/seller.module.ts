import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SellerService } from './seller.service'
import { SellerController } from './seller.controller'
import { RolesGuard } from '@/auth/roles.guard'

// Import entities only (NOT SellerRepository)
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'
import { Store } from './entities/store.entity'

import { UserModule } from '@/user/user.module'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Seller, Bank, Store]), // Entities only!
  ],
  controllers: [SellerController],
  providers: [SellerService, RolesGuard],
  exports: [SellerService],
})
export class SellerModule {}
