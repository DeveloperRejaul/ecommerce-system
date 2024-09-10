import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, MinLength, IsISO8601, ValidateNested } from 'class-validator';
import { IsLessThan100ForPercent } from 'src/utils/validator';
export class TimePeriodDto {
  @IsNotEmpty()
  @IsISO8601()
  from: string;

  @IsNotEmpty()
  @IsISO8601()
  to: string;
}

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
  @ValidateNested()
  @Type(() => TimePeriodDto)
  time: TimePeriodDto;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  shopId: string;

  userId: string;
}


export class UpdateCouponDto extends PartialType(CreateCouponDto) { }