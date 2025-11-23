import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { MailerModule } from '@nestjs-modules/mailer'

// Entities
import { User } from './model/user.entity'
import { Session } from './model/session.entity'

// Services & Controllers
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { SmsService } from '@/helper/sms.helper'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '90d' },
    }),
    HttpModule,
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
  ],
  providers: [UserService, SmsService],
  controllers: [UserController],
  exports: [TypeOrmModule, JwtModule],
})
export class UserModule {}
