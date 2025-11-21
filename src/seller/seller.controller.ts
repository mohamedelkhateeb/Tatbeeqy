import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

//Service
import { SellerService } from './seller.service'

//DTO
import { BankInput } from './dto/bank.dto'
import { SearchInput } from '@/user/dto/search.dto'
import { SellerVerifyInput } from './dto/verify.dto'

//Guards
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/decorator/auth.decorator'
import { Role } from '@/auth/enum/auth.enum'
import { UpdateSellerDto } from './dto/update-seller.dto'

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  gets(@Query() searchInput: SearchInput) {
    return this.sellerService.gets(searchInput)
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getsByAdmin(@Query() searchInput: SearchInput) {
    return this.sellerService.getsByAdmin(searchInput)
  }

  @Get(':id')
  getByUser(@Param('id') id: string) {
    return this.sellerService.get(id)
  }

  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getByAdmin(@Param('id') id: string) {
    return this.sellerService.getByAdmin(id)
  }

  @Get('profile/me')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  getProfile(@Req() req) {
    return this.sellerService.getProfile(req.user)
  }

  @Post('verify-phone')
  verifyPhone(@Body() sellerVerifyInput: SellerVerifyInput) {
    return this.sellerService.verifyPhone(sellerVerifyInput)
  }

  @Patch(':id')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(id, updateSellerDto)
  }

  @Patch('admin/ban/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  ban(@Param('id') id: string, @Body('status') status: boolean) {
    return this.sellerService.ban(id, status)
  }

  @Patch('admin/verify/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  verify(@Param('id') id: string) {
    return this.sellerService.verify(id)
  }

  @Post('bank')
  @Roles(Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  bank(@Body() bankInput: BankInput, @Req() req) {
    return this.sellerService.bank(bankInput, req.user)
  }
}
