import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as twilio from 'twilio'

@Injectable()
export class SmsService {
  private client: twilio.Twilio

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID')
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN')

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are missing in .env')
    }

    this.client = twilio(accountSid, authToken)
  }

  async sendOtp(to: string, otp: string) {
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER')

    if (!from) {
      throw new Error('Missing TWILIO_PHONE_NUMBER in .env')
    }

    console.log('📱 Sending OTP:', otp, 'to', to)

    try {
      const message = await this.client.messages.create({
        body: `${otp} is your ${this.configService.get<string>(
          'APP_NAME',
        )} verification code. Do not share it.`,
        from,
        to: to.startsWith('+') ? to : `+${to}`, // ensures country code
      })

      return {
        success: true,
        sid: message.sid,
        status: message.status,
      }
    } catch (error) {
      console.error('❌ Twilio error:', error)
      throw new Error('Failed to send OTP')
    }
  }
}
