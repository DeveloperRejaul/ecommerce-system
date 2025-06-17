 
import { Module } from '@nestjs/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model';
import { Coupon } from '../coupon/model';

@Module({
  imports: [
    SequelizeModule.forFeature([Category, Coupon])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})

export class CategoryModule {}
