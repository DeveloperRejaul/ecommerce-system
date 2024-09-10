import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Coupon, CouponSchema } from './schema';
import { CouponController } from './controller';
import { CouponService } from './service';
import { Shop, ShopSchema } from '../shop/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }, { name: User.name, schema: UserSchema }, { name: Shop.name, schema: ShopSchema }]),
  ],
  controllers: [CouponController, AuthController],
  providers: [CouponService, AuthService],
})
export class CouponModule { }