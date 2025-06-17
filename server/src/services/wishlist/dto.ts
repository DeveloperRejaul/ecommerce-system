import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  productId: string;

  @IsString()
  userId: string;
}


export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}

