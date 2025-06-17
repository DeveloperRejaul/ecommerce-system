import { Module } from '@nestjs/common';
import { CouponService } from './service';
import { CouponController } from './controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coupon } from './model';

@Module({
  imports: [
    SequelizeModule.forFeature([Coupon])
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule { }