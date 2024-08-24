import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, MinLength, } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
    @IsNotEmpty()
    @MinLength(5)
    name: string;

    @IsNotEmpty()
    shopId: Types.ObjectId;
}


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }