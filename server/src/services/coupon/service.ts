import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schema';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import { AuthBody } from 'src/types/types';
import { UserRole } from '../user/schema';
import { roleAvailable } from 'src/utils/role';
const { ADMIN, SUPER_ADMIN, MODERATOR } = UserRole;

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private model: Model<Coupon>
  ) { }
  async createCoupon(body: CreateCouponDto, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.create(body);
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      if (body.shopId === shopId) return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async getCoupon(auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.find();
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) return await this.model.find({ shopId });
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async getByIdCoupon(id: string) {
    return await this.model.findById({ _id: id });
  }


  async updateCoupon(id: string, body: UpdateCouponDto, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findByIdAndUpdate(id, body, { new: true });
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const coupon = await this.getByIdCoupon(id);
      if (coupon.shopId.toString() === shopId) return await this.model.findByIdAndUpdate(id);;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async deleteCoupon(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const coupon = await this.getByIdCoupon(id);
      if (coupon.shopId.toString() === shopId) return await this.model.findByIdAndDelete(id);;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

}
