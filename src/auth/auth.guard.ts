import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { User } from '@/user/model/user.entity'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const cookieToken = req.cookies?.['9717f25d01fb469d5d6a3c6c70e1919aebec']
    const authHeader = req.headers?.authorization
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null
    const token = bearerToken || cookieToken
    if (!token) {
      throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
    }
    console.log(token)
    const user = await this.validateToken(token)

    // 5️⃣ Attach user to request so RolesGuard sees it
    req.user = user
    return true
  }

  async validateToken(token: string) {
    try {
      const decoded: any = this.jwtService.verify(token)
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      })
      if (!user || user.isBanned) {
        throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
      }
      return user
    } catch (err) {
      throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
    }
  }
}
