import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from '@/user/model/user.entity'
import { SearchInput } from '@/user/dto/search.dto'
import { BankInput } from './dto/bank.dto'
import { SellerVerifyInput } from './dto/verify.dto'
import { ReqUser } from '@/auth/entities/user.types'
import { Seller } from './entities/seller.entity'
import { Bank } from './entities/bank.entity'
import { Store } from './entities/store.entity'
import { SellerSignupDto } from './dto/create-seller.dto'

import { Role } from '@/auth/enum/auth.enum'
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto'

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepo: Repository<Seller>,
    @InjectRepository(Bank)
    private readonly bankRepo: Repository<Bank>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signup(input: SellerSignupDto) {
    const existingUser = await this.userRepo.findOne({
      where: { phone: input.phone },
    })

    if (existingUser) {
      throw new BadRequestException('Phone number already registered')
    }

    const passwordHash = await bcrypt.hash(input.password, 12)

    const newUser = this.userRepo.create({
      name: input.fullName,
      phone: input.phone,
      password: passwordHash,
      role: Role.SELLER,
      is_verified: true,
    })
    await this.userRepo.save(newUser)

    const seller = this.sellerRepo.create({
      user: newUser,
      isVerified: false,
    })
    await this.sellerRepo.save(seller)

    return {
      success: true,
      message:
        'Seller registered successfully. Please complete your store information.',
      sellerId: seller.id,
    }
  }

  async getAll(input: SearchInput) {
    const { search, limit = 10, page = 1 } = input

    const queryBuilder = this.sellerRepo
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.store', 'store')
      .where('seller.isVerified = :isVerified', { isVerified: true })
      .andWhere('seller.isBanned = :isBanned', { isBanned: false })

    if (search) {
      queryBuilder.andWhere('store.storeName ILIKE :search', {
        search: `%${search}%`,
      })
    }

    const [sellers, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('seller.createdAt', 'DESC')
      .getManyAndCount()

    return {
      data: sellers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getAllByAdmin(input: SearchInput) {
    const { search, limit = 10, page = 1 } = input

    const queryBuilder = this.sellerRepo
      .createQueryBuilder('seller')
      .leftJoinAndSelect('seller.user', 'user')
      .leftJoinAndSelect('seller.bank', 'bank')
      .leftJoinAndSelect('seller.store', 'store')

    if (search) {
      queryBuilder.where('store.storeName ILIKE :search', {
        search: `%${search}%`,
      })
    }

    const [sellers, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('seller.createdAt', 'DESC')
      .getManyAndCount()

    return {
      data: sellers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id, isVerified: true, isBanned: false },
      relations: ['store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    return seller
  }

  async getByIdAdmin(id: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id },
      relations: ['bank', 'user', 'store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    return seller
  }

  async getProfile(reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['bank', 'user', 'store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller profile not found')
    }

    return seller
  }

  async verifyPhone(input: SellerVerifyInput) {
    const user = await this.userRepo.findOne({
      where: { phone: input.phone },
    })

    if (!user) {
      throw new BadRequestException('Phone number not found')
    }

    // Add actual OTP verification logic here
    return {
      success: true,
      message: 'Phone verified successfully',
    }
  }

  // Removed - sellers don't have direct updatable fields anymore
  // Use updateStore() and addOrUpdateBank() instead

  async ban(id: number, isBanned: boolean) {
    const seller = await this.sellerRepo.findOne({ where: { id } })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    await this.sellerRepo.update(id, { isBanned })

    return {
      success: true,
      message: `Seller has been ${isBanned ? 'banned' : 'unbanned'}`,
    }
  }

  async verify(id: number) {
    const seller = await this.sellerRepo.findOne({ where: { id } })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    await this.sellerRepo.update(id, { isVerified: true })

    return {
      success: true,
      message: 'Seller verified successfully',
    }
  }

  async addOrUpdateBank(input: BankInput, reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['bank'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    if (seller.bank) {
      await this.bankRepo.update(seller.bank.id, input)
    } else {
      const newBank = this.bankRepo.create(input)
      await this.bankRepo.save(newBank)
      seller.bank = newBank
      await this.sellerRepo.save(seller)
    }

    return {
      success: true,
      message: 'Bank information updated successfully',
    }
  }

  // ============================================
  // STORE SERVICES
  // ============================================

  async createStore(input: CreateStoreDto, reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    if (seller.store) {
      throw new BadRequestException(
        'Store already exists. Use update endpoint instead.',
      )
    }

    const store = this.storeRepo.create(input)
    await this.storeRepo.save(store)

    seller.store = store
    await this.sellerRepo.save(seller)

    return {
      success: true,
      message: 'Store created successfully',
      data: store,
    }
  }

  async getMyStore(reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    if (!seller.store) {
      throw new NotFoundException(
        'Store not found. Please create your store first.',
      )
    }

    return {
      success: true,
      data: seller.store,
    }
  }

  async updateStore(input: UpdateStoreDto, reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    if (!seller.store) {
      throw new NotFoundException(
        'Store not found. Please create your store first.',
      )
    }

    await this.storeRepo.update(seller.store.id, input)

    const updatedStore = await this.storeRepo.findOne({
      where: { id: seller.store.id },
    })

    return {
      success: true,
      message: 'Store updated successfully',
      data: updatedStore,
    }
  }

  async getStoreByseller(sellerId: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id: sellerId, isVerified: true, isBanned: false },
      relations: ['store'],
    })

    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    if (!seller.store) {
      throw new NotFoundException('Store not found')
    }

    return {
      success: true,
      data: seller.store,
    }
  }
}
