 
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shop } from './model';
import { ShopController } from './controller';
import { ShopService } from './service';
import { Category } from '../category/model';
import { Product } from '../products/model';
import { User } from '../user/model';
import { Order } from '../order/model';
import { Brand } from '../brand/model';
import { Coupon } from '../coupon/model';
import { Rating } from '../rating/model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Shop,
      Category,
      Product,
      User,
      Order,
      Brand,
      Coupon,
      Rating
    ])
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule { }