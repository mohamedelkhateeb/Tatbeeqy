import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './user.service'
import { Roles } from '@/auth/decorator/auth.decorator'
import { Role } from '@/auth/enum/auth.enum'
import { AuthGuard } from '@/auth/auth.guard'
import { RolesGuard } from '@/auth/roles.guard'
import { ReqUser } from '@/auth/entities/user.types'

// DTOs
import { SignupInput } from './dto/signup.dto'
import { VerifyPhoneInput } from './dto/verify-phone.dto'
import { LoginInput } from './dto/login.dto'
import { GoogleInput } from './dto/google.dto'
import { FacebookInput } from './dto/facebook.dto'
import { UpdateUserInput } from './dto/update.dto'
import { ChangePasswordInput } from './dto/change-password.dto'
import { ForgetPasswordInput } from './dto/forget-password.dto'
import { ResetPasswordInput } from './dto/reset-password.dto'
import { PhoneInput } from './dto/phone.dto'
import { SearchInput } from './dto/search.dto'
import { AdminInput } from './dto/admin.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** =================== PUBLIC =================== **/

  @Post('signup')
  signup(@Body() signupInput: SignupInput) {
    return this.userService.signup(signupInput)
  }

  @Post('login')
  login(@Body() loginInput: LoginInput, @Req() req: Request) {
    return this.userService.login(loginInput, req)
  }

  @Post('login/admin')
  adminLogin(@Body() loginInput: LoginInput, @Req() req: Request) {
    return this.userService.adminLogin(loginInput, req)
  }

  @Post('login/seller')
  sellerLogin(@Body() loginInput: LoginInput, @Req() req: Request) {
    return this.userService.sellerLogin(loginInput, req)
  }

  @Post('google')
  google(@Body() googleInput: GoogleInput, @Req() req: Request) {
    return this.userService.google(googleInput, req)
  }

  // @Post('facebook')
  // facebook(@Body() facebookInput: FacebookInput, @Req() req: Request) {
  //   return this.userService.facebook(facebookInput, req)
  // }

  @Post('resend-otp')
  resend(@Body('phone') phone: string) {
    return this.userService.resend(phone)
  }

  @Post('phone-login')
  phoneLogin(@Body('phone') phone: string) {
    return this.userService.phoneLogin(phone)
  }

  @Post('verify-phone')
  verify(@Body() verifyPhoneInput: VerifyPhoneInput, @Req() req: Request) {
    return this.userService.verify(verifyPhoneInput, req)
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordInput: ForgetPasswordInput) {
    return this.userService.forgetPassword(forgetPasswordInput)
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordInput: ResetPasswordInput) {
    return this.userService.resetPassword(resetPasswordInput)
  }

  /** =================== AUTHENTICATED =================== **/

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: ReqUser }) {
    return this.userService.getProfile(req.user)
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  update(
    @Body() updateUserInput: UpdateUserInput,
    @Req() req: Request & { user: ReqUser },
  ) {
    return this.userService.update(updateUserInput, req.user)
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  changePassword(
    @Body() input: ChangePasswordInput,
    @Req() req: Request & { user: ReqUser },
  ) {
    return this.userService.changePassword(input, req.user)
  }

  @UseGuards(AuthGuard)
  @Post('phone-availability')
  available(@Body() phoneInput: PhoneInput) {
    return this.userService.available(phoneInput)
  }

  @UseGuards(AuthGuard)
  @Patch('change-phone')
  changePhone(
    @Body() phoneInput: PhoneInput,
    @Req() req: Request & { user: ReqUser },
  ) {
    return this.userService.phoneChange(phoneInput, req.user)
  }

  @UseGuards(AuthGuard)
  @Patch('change-phone-verify')
  changePhoneVerify(
    @Body() input: VerifyPhoneInput,
    @Req() req: Request & { user: ReqUser },
  ) {
    return this.userService.changePhoneVerify(input, req.user)
  }

  /** =================== ADMIN / MODERATOR =================== **/

  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  getUsers(@Query() searchInput: SearchInput) {
    return this.userService.getUsers(searchInput)
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('admins')
  getAdmins(@Query() searchInput: SearchInput) {
    return this.userService.getAdmins(searchInput)
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('admins')
  addAdmin(@Body() adminInput: AdminInput) {
    return this.userService.addAdmin(adminInput)
  }

  @Roles(Role.MODERATOR, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('ban/:id')
  banUser(@Param('id') id: string, @Body('status') status: boolean) {
    return this.userService.ban(id, status)
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
