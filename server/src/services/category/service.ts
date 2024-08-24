import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema';
import { Model } from 'mongoose';
import { AuthBody } from 'src/types/types';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { UserRole } from '../user/schema';
import { roleAvailable } from 'src/utils/role';
const { ADMIN, SUPPER_ADMIN, MODERATOR } = UserRole;


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private model: Model<Category>,
  ) { }


  async createCategory(body: CreateCategoryDto, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.create(body);
    };
    if (roleAvailable([ADMIN, SUPPER_ADMIN, MODERATOR], auth.role)) {
      if (auth.shopId === body.shopId.toString()) return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async getCategory(auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.find();
    }
    if (roleAvailable([ADMIN, SUPPER_ADMIN, MODERATOR], auth.role)) {
      return await this.model.find({ shopId: auth.shopId });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async updateCategory(id: string, body: UpdateCategoryDto, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }
    if (roleAvailable([ADMIN, SUPPER_ADMIN, MODERATOR], auth.role)) {
      const category = await this.model.findById({ _id: id });
      if (auth.shopId === category.shopId.toString()) return await this.model.findByIdAndUpdate(id, body, { new: true });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async deleteCategory(id: string, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);
    const category = await this.model.findById({ _id: id });
    if (roleAvailable([ADMIN, SUPPER_ADMIN, MODERATOR], auth.role)) {
      if (category.shopId.toString() === auth.shopId) return await this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

}
