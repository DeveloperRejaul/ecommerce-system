import { Module } from '@nestjs/common';
import { OrderController } from './controller';
import { OrderService } from './service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './model';
import { Product } from '../products/model';
import { Coupon } from '../coupon/model';
import { User } from '../user/model';

@Module({
  imports: [
    SequelizeModule.forFeature([Order,Product, Coupon, User])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }