import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsNumber, MinLength, } from 'class-validator';
import { IsLessThan100ForPercent } from 'src/utils/validator';


export class CreateCouponDto {

  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @IsEnum(['FIX', 'PERCENT'])
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @IsLessThan100ForPercent()
  value: number;

  @IsNotEmpty()
  @IsNumber()
  time: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  shopId: string;

  userId: string;
}


export class UpdateCouponDto extends PartialType(CreateCouponDto) { }