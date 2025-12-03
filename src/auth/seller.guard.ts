import { Seller } from '@/seller/entities/seller.entity'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class SellerGuard implements CanActivate {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const user = request.user
      
      if (!user) {
        throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
      }
      const seller = await this.sellerRepository.findOne({
        where: {
          user: user.id,
          isVerified: true,
          isBanned: false,
        },
      })
      if (!seller) {
        throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
      }
      return true
    } catch {
      throw new HttpException('Unauthorized Request', HttpStatus.UNAUTHORIZED)
    }
  }
}
