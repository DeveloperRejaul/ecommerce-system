import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';
import { roleAvailable } from 'src/utils/role';

const { ADMIN, SUPER_ADMIN, MODERATOR } = UserRole;

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private model: Model<Product>
  ) { }

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


  async deleteProduct(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const product = await this.model.findById({ _id: id });
      if (product.shopId.toString() === shopId) return await this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async getAllProduct(auth: AuthBody, limit = 10, skip = 0) {
    const { role, shopId } = auth;
    const count = await this.model.countDocuments({}).exec();
    const total_page = Math.floor((count - 1) / limit) + 1;

    if (role === UserRole.OWNER) {
      const data = await this.model.find().limit(limit).skip(skip).select('-userId -couponId').populate('shopId').populate('categoryId').populate('brandId').exec();
      return { data, total_page };
    }

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      const data = this.model.find({ shopId }).limit(limit).skip(skip).select('-userId -couponId').populate('shopId').populate('categoryId').populate('brandId').exec();
      return { data, total_page };
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async getProductByShopId(shopId: string) {
    return this.model.find({ shopId });
  };

  async getProductById(id: string) {
    return this.model.findById({ _id: id });
  }
}
