import { PartialType } from '@nestjs/mapped-types';
import {  IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from 'class-validator';
import { CategoryType } from './model';


export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    shopId: string;

    @IsNotEmpty()
    @IsString()
    avatar: string;

    @IsOptional() 
    @IsNumber()
    @Min(0)
    @Max(100)
    discount: number;

    @IsEnum(CategoryType)
    @IsString()
    type: string;
}


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }