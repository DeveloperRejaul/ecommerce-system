import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';


export class CreateRatingDto {
  @IsNumber()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}


export class UpdateRatingDto extends PartialType(CreateRatingDto) { }