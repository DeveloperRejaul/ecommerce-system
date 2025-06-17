import { PartialType } from '@nestjs/mapped-types';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray,IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  userId:string;

  @IsString()
  avatar:string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true }) 
  banner:string[];

  @IsNumber()
  price:number;

  @IsString()
  expireDate: Date;
}


export class UpdateShopDto extends PartialType(CreateShopDto) {}