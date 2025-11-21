import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { User } from '@/user/model/user.entity'
import { SearchInput } from '@/user/dto/search.dto'
import { BankInput } from './dto/bank.dto'
import { SellerVerifyInput } from './dto/verify.dto'
import { ReqUser } from '@/auth/entities/user.types'
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'
import { UpdateSellerDto } from './dto/update-seller.dto'

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepo: Repository<Seller>,
    @InjectRepository(Bank)
    private bankRepo: Repository<Bank>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async gets(input: SearchInput) {
    const { search, limit = 10, page = 1 } = input
    return this.sellerRepo.find({
      where: search ? [{ shopName: ILike(`%${search}%`) }] : {},
      take: limit,
      skip: (page - 1) * limit,
    })
  }

  async getsByAdmin(input: SearchInput) {
    return this.gets(input)
  }

  // -----------------------------
  // Get Single Seller
  // -----------------------------
  async get(id: string) {
    const seller = await this.sellerRepo.findOne({
      where: { id },
      relations: ['bank', 'user'],
    })

    if (!seller) throw new NotFoundException('Seller not found')

    return seller
  }

  async getByAdmin(id: string) {
    return this.get(id)
  }

  // -----------------------------
  // Get Profile
  // -----------------------------
  async getProfile(reqUser: ReqUser) {
    return this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['bank', 'user'],
    })
  }

  // -----------------------------
  // Verify Phone
  // -----------------------------
  async verifyPhone(input: SellerVerifyInput) {
    const user = await this.userRepo.findOne({
      where: { phone: input.phone },
    })

    if (!user) throw new BadRequestException('Phone not found')

    return { message: 'Phone verified' }
  }

  // -----------------------------
  // Update Seller
  // -----------------------------
  async update(id: string, input: UpdateSellerDto) {
    await this.sellerRepo.update(id, input)
    return { message: 'Seller updated successfully' }
  }

  // -----------------------------
  // Ban / Unban Seller
  // -----------------------------
  async ban(id: string, status: boolean) {
    await this.sellerRepo.update(id, { is_banned: status })
    return { message: `Seller has been ${status ? 'banned' : 'unbanned'}` }
  }

  // -----------------------------
  // Verify Seller (Admin)
  // -----------------------------
  async verify(id: string) {
    await this.sellerRepo.update(id, { is_verified: true })
    return { message: 'Seller verified successfully' }
  }

  // -----------------------------
  // Add Bank
  // -----------------------------
  async bank(input: BankInput, reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['bank'],
    })
    if (!seller) throw new NotFoundException('Seller not found')
    if (seller.bank) {
      await this.bankRepo.update(seller.bank.id, input)
    } else {
      const newBank = this.bankRepo.create(input)
      await this.bankRepo.save(newBank)
      seller.bank = newBank
      await this.sellerRepo.save(seller)
    }
    return { message: 'Bank information updated' }
  }
}
