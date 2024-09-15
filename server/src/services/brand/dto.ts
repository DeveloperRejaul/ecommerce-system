import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  shopId: Types.ObjectId;

  avatar: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) { }