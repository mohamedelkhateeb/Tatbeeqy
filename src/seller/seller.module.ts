import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SellerService } from './seller.service'
import { SellerController } from './seller.controller'
import { RolesGuard } from '@/auth/roles.guard'
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'
import { Store } from './entities/store.entity'
import { UserModule } from '@/user/user.module'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    UserModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
      },
    }),
    TypeOrmModule.forFeature([Seller, Bank, Store]),
  ],
  controllers: [SellerController],
  providers: [SellerService, RolesGuard],
  exports: [SellerService],
})
export class SellerModule {}
