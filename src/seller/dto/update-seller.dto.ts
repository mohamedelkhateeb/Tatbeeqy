import { PartialType } from '@nestjs/mapped-types'
import {  SellerSignupDto } from './create-seller.dto'

export class UpdateSellerDto extends PartialType(SellerSignupDto) {}
