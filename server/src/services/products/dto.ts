import { PartialType} from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @MaxLength(5)
  @IsString({each: true})
  images: string[];

  @IsNotEmpty()
  @IsNumber()
  buyPrice: number;

  @IsNotEmpty()
  @IsNumber()
  sellPrice: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsUUID(4)
  categoryId: string;

  @IsNotEmpty()
  @IsUUID(4)
  shopId: string;

  @IsNotEmpty()
  @IsUUID(4)
  brandId: string;
  
  @IsNotEmpty()
  @IsString()
  specification:string;

  @IsNotEmpty()
  @IsString()
  keys:string;

  @IsNumber()
  discount:number;
}


export class UpdateProductDto extends PartialType(CreateProductDto) {}