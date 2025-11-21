import { EntityRepository, Repository } from 'typeorm'
import { Seller } from './entities/seller.entity'

@EntityRepository(Seller)
export class SellerRepository extends Repository<Seller> {
  findByUserId(userId: string) {
    return this.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'bank'],
    })
  }
}
