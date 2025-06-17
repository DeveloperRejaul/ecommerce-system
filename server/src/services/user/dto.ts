import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsString , IsOptional} from 'class-validator';
import { UserRole } from './model';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  avatar : string;
  
  @IsNotEmpty()
  @IsEnum(UserRole)
  role:string;
  
  @IsNotEmpty()
  @IsString()
  address: string;
  
  @IsOptional()
  @IsString()
  shopId: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {}


export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CheckOtpDto {
  @IsNotEmpty()
  @IsString()
  token: string;


  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}

export class CheckEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}