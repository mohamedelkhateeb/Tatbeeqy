import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SellerService } from './seller.service'
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { User } from '@/user/model/user.entity'
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'
import { SellerController } from './seller.controller'
import { Session } from '@/user/model/session.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Seller, Bank, User, Session])],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
