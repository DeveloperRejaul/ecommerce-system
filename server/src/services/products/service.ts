import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';
import { roleAvailable } from 'src/utils/role';

const { ADMIN, SUPER_ADMIN, MODERATOR, USER } = UserRole;

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private model: Model<Product>
  ) { }

  /**
   * @description this function is used to create a new product
   * @param auth auth object
   * @param body product information 
   * @param files file object 
   * @returns Product Object
   */
  async creatingProduct(auth: AuthBody, body, files: IFileType[]) {
    const { role, shopId } = auth;

    if (body?.couponId) body.couponId = [body.couponId];
    if (body?.color) body.color = JSON.parse(body.color);

    if (role === UserRole.OWNER) {
      if (files) {
        const promises = files.map(async file => await saveFile(file));
        body.images = await Promise.all(promises);
      }
      return await this.model.create(body);
    }

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && shopId === body.shopId) {
      if (files) {
        const promises = files.map(async file => await saveFile(file));
        body.images = await Promise.all(promises);
      }
      return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };


  /**
 * @description this function is used to update exiting product
 * @param id product id 
 * @param auth auth object
 * @param body product information 
 * @param files file object 
 * @returns Product Object
 */
  async updateProduct(id: string, auth: AuthBody, body, files: IFileType[]) {
    const { role, shopId } = auth;

    if (body?.couponId) body.couponId = [body.couponId];
    if (body?.color) body.color = JSON.parse(body.color);

    if (role === UserRole.OWNER) {
      if (files) {
        const promises = files.map(async file => await saveFile(file));
        body.images = await Promise.all(promises);
      }
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const product = await this.model.findById({ _id: id });
      if (product.shopId.toString() === shopId) {
        if (files) {
          const promises = files.map(async file => await saveFile(file));
          body.images = await Promise.all(promises);
        }
        return await this.model.findByIdAndUpdate(id, body, { new: true });
      }
    }

    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  /**
  * @description this function is used to delete exiting product
  * @param id product id 
  * @param auth auth object
  * @returns Product Object
  */
  async deleteProduct(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const product = await this.model.findById({ _id: id });
      if (product.shopId.toString() === shopId) return await this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  /**
  * @description this function is used to find all products and 
  * if is request any shop admin ,super admin or moderator find all products of this shop 
  * @param auth auth object
  * @returns Product array 
  */
  async getAllProduct(auth: AuthBody, limit: number, skip: number, sort: string) {
    const { role, shopId } = auth;

    // handle pagination
    const count = await this.model.countDocuments({}).exec();
    const total_page = Math.floor((count - 1) / limit) + 1 || 1;

    let product;

    if (role === UserRole.OWNER) product = this.model.find();
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR, USER], role)) product = this.model.find({ shopId });

    // handle filtering with price
    const isLow = sort === '1';
    const isHigh = sort === '-1';
    if (isHigh || isLow) product = product.sort({ sellPrice: isLow ? 1 : -1 });

    product = await product.limit(limit).skip(skip)
      .select('-userId -couponId')
      .populate('shopId')
      .populate('categoryId')
      .populate('brandId').exec();
    return { data: product, total_page };
  };


  /**
  * @description this function is used to find  products buy shop id 
  * @returns Product array 
  */
  async getProductByShopId(shopId: string) {
    return this.model.find({ shopId });
  };


  /**
  * @description this function is used to find  products buy product id 
  * @returns Product Object
  */
  async getProductById(id: string) {
    return this.model.findById({ _id: id });
  }
}
