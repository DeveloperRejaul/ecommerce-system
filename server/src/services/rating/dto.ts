import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, MinLength, } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  address: string;
}


export class UpdateRatingDto extends PartialType(CreateRatingDto) { }