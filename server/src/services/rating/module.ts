import { Module } from '@nestjs/common';
import { RatingService } from './service';
import { RatingController } from './controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './model';
import { Product } from '../products/model';
import { Order } from '../order/model';

@Module({
  imports: [
    SequelizeModule.forFeature([Rating, Product, Order])
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule { }