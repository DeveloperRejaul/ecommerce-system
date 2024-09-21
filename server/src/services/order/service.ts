import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema';
import { AuthBody } from 'src/types/types';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { User, UserRole } from '../user/schema';
import { roleAvailable } from 'src/utils/role';
import { Product } from '../products/schema';
import { Coupon } from '../coupon/schema';
import { checkCouponDate } from 'src/utils/coupon';

const { ADMIN, MODERATOR, SUPER_ADMIN, USER } = UserRole;
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(User.name) private userModel: Model<User>
  ) { }


  /**
   * @description This function is used to create a new order
   * @param body order object
   * @param auth user information object
   * @returns order object
   */
  async createOrder(body: CreateOrderDto, auth: AuthBody) {
    const { shopId } = auth;
    const { quantity } = body;

    // handle product
    const product = await this.productModel.findById({ _id: body.productId });
    if (!product) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    // handle product price 
    const parPrice = product.sellPrice;
    let mainPrice = parPrice * quantity;

    // handle product color 
    if (!product.color.includes(body.color)) throw new HttpException('Color Not  available at the moment', HttpStatus.NO_CONTENT);;

    // handle size
    const sizes = JSON.parse(JSON.stringify(product.size));
    const availableNumberOfSize = sizes[body.size];
    if (availableNumberOfSize < 1) throw new HttpException('Size Not  available at the moment', HttpStatus.NO_CONTENT);

    // handle coupon
    if (body.coupon) {
      const coupon = await this.couponModel.findOne({ name: body.coupon });
      if (!coupon) throw new HttpException('Invalid coupon name ', HttpStatus.BAD_REQUEST);
      if (coupon.quantity < 1) throw new HttpException('this  coupon quantity is greater than 0', HttpStatus.BAD_REQUEST);


      // check coupon exists in product
      const couponId: Types.ObjectId = coupon._id as Types.ObjectId;
      const productCoupons = product.couponId;
      if (!productCoupons.includes(couponId)) throw new HttpException('Coupon is not available in this product', HttpStatus.BAD_REQUEST);

      if (!checkCouponDate(coupon)) throw new HttpException('Coupon date expire', HttpStatus.BAD_REQUEST);

      // handle coupon type 
      const isFix = coupon.type === 'FIX';
      if (isFix) {
        mainPrice -= coupon.value;
      } else {
        const percent = coupon.value;
        const discount = (mainPrice * percent) / 100;
        mainPrice = mainPrice - discount;
      }

      // transition when coupon available
      const order = await this.model.create({ shopId, ...body, price: mainPrice });
      await this.couponModel.updateOne({ _id: coupon._id }, { quantity: coupon.quantity - 1 });
      await this.productModel.updateOne({ _id: product.id }, { quantity: product.quantity - quantity });
      return order;
    }

    // transition for product 
    const order = await this.model.create({ shopId, ...body, price: mainPrice });
    await this.productModel.updateOne({ _id: product.id }, { quantity: product.quantity - quantity });
    return order;
  }


  /**
   * @description This function is used to delete existing order
   * @param id order id
   * @param auth user information object
   * @returns order object
   */
  async deleteOrder(id: string, auth: AuthBody) {
    const { shopId, role, id: user } = auth;
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);

    const order = await this.model.findById({ _id: id });
    if (order) {
      if (roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR], role) && order.shopId.toString() === shopId) {
        return await this.model.findByIdAndDelete(id);
      }
      if (role === USER && user === order.userId.toString()) return this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };


  /**
 * @description This function is used to get all existing order
 * @param auth user information object
 * @returns order array of object
 */
  async getAllOrder(auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.find();
    if (roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN,], role)) return await this.model.find({ shopId });
  };


  /**
  * @description This function is used to get order by shopId
  * @param shopId shop is
  * @returns order array of object
  */
  async getOrderByShopId(shopId: string) {
    return await this.model.find({ shopId });
  };


/**
* @description This function is used to get order by order id
* @param id order id
* @returns order array of object
*/
  async getOrderById(id: string) {
    return await this.model.findById({ _id: id });
  };


  
  async updateOrder(id: string, auth: AuthBody, body: UpdateOrderDto) {
    const { shopId, id: userId, role } = auth;
    if (role === UserRole.OWNER) {
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }

    const user = await this.userModel.findById({ _id: userId });
    if (roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN], role) && user.shopId.toString() === shopId) {
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };
}
