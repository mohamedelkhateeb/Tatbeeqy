import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

// Entities
import { User } from '@/user/model/user.entity'
import { Session } from '@/user/model/session.entity'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext()

    // 1️⃣ Get token from cookie
    const cookieToken =
      ctx.req?.cookies?.['9717f25d01fb469d5d6a3c6c70e1919aebec']

    // 2️⃣ Get token from Authorization header
    const authHeader = ctx.req?.headers?.authorization
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null

    // 3️⃣ Pick the token that exists
    const token = cookieToken || bearerToken

    if (!token) {
      throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
    }

    // 4️⃣ Validate token
    ctx.user = await this.validateToken(token)
    return true
  }

  // ✔ Token validation
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token)
      // Find user by decoded data
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      })
    // console.log(user)


      if (!user || user.isBanned) {
        throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
      }
      // Cookie-based sessions stored in DB
      // const session = await this.sessionRepository.findOneBy({
      //   cookie: token,
      // })
      // console.log(session)
      // if (!session) {
      //   throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
      // }
      return user
    } catch (err) {
      throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
    }
  }
}
