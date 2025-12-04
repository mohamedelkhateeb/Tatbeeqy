import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as speakeasy from 'speakeasy'

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
import { MailerService } from '@nestjs-modules/mailer'
import { VERIFICATION_EMAIL_TEMPLATE } from '@/common/templates'
import { JwtService } from '@nestjs/jwt'
import { Session } from '@/user/model/session.entity'
import { Request } from 'express'

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
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async signup(input: SellerSignupDto) {
    const existingUser = await this.userRepo.findOne({
      where: [{ phone: input.phone }, { email: input.email }],
      select: ['id', 'email', 'otp', 'isVerified'],
    })
    if (existingUser) {
      if (existingUser.isVerified) {
        throw new BadRequestException('Phone or email already registered')
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        existingUser.otp = otp
        await this.userRepo.save(existingUser)
        await this.mailerService.sendMail({
          to: existingUser.email,
          from: `"Tatbeeqy" <${process.env.SMTP_USER}>`,
          subject: 'Verify Your Email',
          html: VERIFICATION_EMAIL_TEMPLATE.replace(
            '{verificationCode}',
            otp,
          ).replace('{name}', existingUser.name),
        })
        return {
          status: 'success',
          data: null,
          message:
            'Your account is not verified yet. A new verification code was sent to your email.',
        }
      }
    }
    const passwordHash = await bcrypt.hash(input.password, 12)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const newUser = this.userRepo.create({
      name: input.fullName,
      phone: input.phone,
      password: passwordHash,
      role: Role.SELLER,
      email: input.email,
      isVerified: false,
      otp,
    })
    await this.userRepo.save(newUser)
    const seller = this.sellerRepo.create({
      user: newUser,
      isVerified: false,
    })
    await this.sellerRepo.save(seller)
    await this.mailerService.sendMail({
      to: input.email,
      from: `"Tatbeeqy" <${process.env.SMTP_USER}>`,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        otp,
      ).replace('{name}', input.fullName),
    })

    return {
      success: true,
      message:
        'Seller registered successfully. Verification code sent to your email.',
      sellerId: seller.id,
    }
  }

  async verifyEmail(email: string, code: string, req: Request) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'otp', 'isVerified'],
    })
    const seller = await this.sellerRepo.findOne({
      where: { user: { email } },
    })
    if (!user) throw new NotFoundException('User not found')
    if (user.otp !== code) {
      throw new BadRequestException('Invalid or expired OTP')
    }
    user.isVerified = true
    user.otp = null
    seller.isVerified = true
    await this.sellerRepo.save(seller)
    await this.userRepo.save(user)
    const token = this.jwtService.sign({
      phone: user.phone,
      id: user.id,
      role: user.role,
    })
    const session = this.sessionRepository.create({
      cookie: token,
      user: { id: user.id },
    })
    await this.sessionRepository.save(session)
    req.res.cookie('token', token, {
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    })
    return {
      status: 'success',
      message: 'Email verified successfully',
      data: { userId: user.id, token },
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
      status: 'success',
      message: 'Sellers fetched successfully',
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
  async getByIdAdmin(id: number) {
    const seller = await this.sellerRepo.findOne({
      where: { id },
      relations: ['bank', 'user', 'store'],
    })
    if (!seller) {
      throw new NotFoundException('Seller not found')
    }
    return {
      data: seller,
      message: 'Seller fetched successfully',
      status: 'success',
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
    return {
      data: seller,
      message: 'Seller fetched successfully',
      status: 'success',
    }
  }

  async getProfile(reqUser: ReqUser) {
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['user'],
    })
    if (!seller) {
      throw new NotFoundException('Seller profile not found')
    }
    return {
      data: seller,
      message: 'Seller fetched successfully',
      status: 'success',
    }
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

  async adminBan(id: number, isBanned: boolean) {
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

  async verifySellerByAdmin(id: number) {
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
      status: 'success',
      message: 'Bank information updated successfully',
      data: seller.bank,
    }
  }

  // ============================================
  // STORE SERVICES
  // ============================================

  async createStore(input: CreateStoreDto, reqUser: ReqUser) {
    console.log(reqUser)
    const seller = await this.sellerRepo.findOne({
      where: { user: { id: reqUser.id } },
      relations: ['store'],
    })
    if (!seller) {
      throw new NotFoundException('Seller not found')
    }

    console.log(seller);
    
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
      status: 'success',
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
