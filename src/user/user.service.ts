import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { OAuth2Client } from 'google-auth-library'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import * as bcrypt from 'bcryptjs'
import * as speakeasy from 'speakeasy'
import { Response, Request } from 'express'

// Entities
import { User } from './model/user.entity'
import { Session } from './model/session.entity'
import { SuccessInfo } from './entities/success.entity'
import { GetUsers } from './entities/user.entity'

// DTOs
import { SignupInput } from './dto/signup.dto'
import { LoginInput } from './dto/login.dto'
import { VerifyPhoneInput } from './dto/verify-phone.dto'
import { GoogleInput } from './dto/google.dto'
import { FacebookInput } from './dto/facebook.dto'
import { UpdateUserInput } from './dto/update.dto'
import { ChangePasswordInput } from './dto/change-password.dto'
import { ForgetPasswordInput } from './dto/forget-password.dto'
import { ResetPasswordInput } from './dto/reset-password.dto'
import { PhoneInput } from './dto/phone.dto'
import { SearchInput } from './dto/search.dto'
import { AdminInput } from './dto/admin.dto'

// Types
import { ReqUser } from '@/auth/entities/user.types'

// Decorators & Enums
import { Role } from '@/auth/enum/auth.enum'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /* --------------------------------------------------
   * 🧩 Utility: Create session + set cookie
   * -------------------------------------------------- */
  private async createSession(user: User, res: Response) {
    const token = this.jwtService.sign({ id: user.id })
    const session = this.sessionRepository.create({
      cookie: token,
      user: { id: user.id },
    })
    await this.sessionRepository.save(session)

    res.cookie(
      this.configService.get<string>('SESSION_COOKIE_KEY') ||
        '9717f25d01fb469d5d6a3c6c70e1919aebec',
      token,
      {
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      },
    )

    return token
  }

  /* --------------------------------------------------
   * 🧠 Auth & Account Methods
   * -------------------------------------------------- */
  async signup(signupInput: SignupInput): Promise<SuccessInfo> {
    const { name, phone, email, password } = signupInput

    const existing = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    })

    if (existing)
      throw new BadRequestException('Phone or Email already registered')

    const otp = speakeasy.totp({
      secret: this.configService.get<string>('OTP_SECRET'),
      encoding: 'base32',
    })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
    })

    await this.userRepository.save(user)
    // TODO: Send OTP via SMS/Email
    return { success: true, message: 'User registered successfully' }
  }

  async verify(verifyPhoneInput: VerifyPhoneInput, req: Request) {
    const { phone, otp } = verifyPhoneInput

    const user = await this.userRepository.findOneBy({ phone })
    if (!user) throw new NotFoundException('User not found')

    const isValidOtp = user.otp === otp
    if (!isValidOtp) throw new ForbiddenException('Invalid OTP')

    user.is_verified = true
    user.otp = null
    await this.userRepository.save(user)

    await this.createSession(user, req.res)
    return { success: true, message: 'Phone verified successfully' }
  }
}
