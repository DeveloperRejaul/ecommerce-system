import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength, } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    name: string;

    @IsNotEmpty()
    shopId: Types.ObjectId;

    avatar: string;
}


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }