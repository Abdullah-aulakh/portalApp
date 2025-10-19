import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyAccountDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: string;
}
