import { IsString, IsNotEmpty } from "class-validator";

export class PhoneInput {
    @IsString()
    @IsNotEmpty()
    phone: string;
}