import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'

// Service
import { SellerService } from './seller.service'

// DTOs
import { BankInput } from './dto/bank.dto'
import { SearchInput } from '@/user/dto/search.dto'
import { SellerVerifyInput } from './dto/verify.dto'
import { UpdateSellerDto } from './dto/update-seller.dto'
import { SellerSignupDto } from './dto/create-seller.dto'
import { BanSellerDto } from './dto/ban-seller.dto'

// Guards
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/decorator/auth.decorator'
import { Role } from '@/auth/enum/auth.enum'
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto'

@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new seller' })
  signup(@Body() signupInput: SellerSignupDto) {
    return this.sellerService.signup(signupInput)
  }
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify seller email' })
  verifyEmail(@Body() dto: { email: string; code: string }, @Req() req) {
    return this.sellerService.verifyEmail(dto.email, dto.code, req)
  }
  @Get()
  @ApiOperation({ summary: 'Get all sellers (public)' })
  getAll(@Query() searchInput: SearchInput) {
    return this.sellerService.getAll(searchInput)
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sellers (admin)' })
  getAllByAdmin(@Query() searchInput: SearchInput) {
    return this.sellerService.getAllByAdmin(searchInput)
  }

  @Get('profile/me')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller profile' })
  getProfile(@Req() req) {
    return this.sellerService.getProfile(req)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seller by ID (public)' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getById(id)
  }

  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller by ID (admin)' })
  getByIdAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.getByIdAdmin(id)
  }

  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone number' })
  verifyPhone(@Body() sellerVerifyInput: SellerVerifyInput) {
    return this.sellerService.verifyPhone(sellerVerifyInput)
  }

  @Patch('admin/ban/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ban/unban seller' })
  ban(@Param('id', ParseIntPipe) id: number, @Body() banDto: BanSellerDto) {
    return this.sellerService.adminBan(id, banDto.isBanned)
  }

  @Patch('admin/verify/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify seller' })
  verify(@Param('id', ParseIntPipe) id: number) {
    return this.sellerService.verifySellerByAdmin(id)
  }

  @Post('bank')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add/update bank information' })
  addOrUpdateBank(@Body() bankInput: BankInput, @Req() req) {
    return this.sellerService.addOrUpdateBank(bankInput, req)
  }

  // ============================================
  // STORE ENDPOINTS
  // ============================================

  @Post('store')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create store information' })
  createStore(@Body() createStoreDto: CreateStoreDto, @Req() req) {
    return this.sellerService.createStore(createStoreDto, req.user)
  }

  @Get('store/me')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my store information' })
  getMyStore(@Req() req) {
    return this.sellerService.getMyStore(req.user)
  }

  @Put('store')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store information' })
  updateStore(@Body() updateStoreDto: UpdateStoreDto, @Req() req) {
    return this.sellerService.updateStore(updateStoreDto, req.user)
  }

  @Get('store/:sellerId')
  @ApiOperation({ summary: 'Get store by seller ID (public)' })
  getStoreByseller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.sellerService.getStoreByseller(sellerId)
  }
}
