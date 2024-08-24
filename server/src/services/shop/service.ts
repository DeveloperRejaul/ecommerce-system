import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop } from './schema';
import { CreateShopDto, UpdateShopDto } from './dto';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private model: Model<Shop>
  ) { }

  /**
   * @description this function using for create shop
   * @returns  shop object
   */
  async create(body: CreateShopDto, file: IFileType, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      if (file) body['avatar'] = await saveFile(file);
      return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  /**
 * @description this function using for delete shop
 * @returns  shop object
 */
  async delete(id: string, role: string, shopId: string) {
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);
    if (role === UserRole.SUPPER_ADMIN) {
      if (shopId === id) return await this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async update(id: string, role: string, shopId: string, body: UpdateShopDto, file: IFileType) {
    if (role === UserRole.OWNER) {
      if (file) body['avatar'] = await saveFile(file);
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }
    if (role === UserRole.SUPPER_ADMIN) {
      if (shopId === id) {
        if (file) body['avatar'] = await saveFile(file);
        return await this.model.findByIdAndUpdate(id, body, { new: true });
      }
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getAll(role: string) {
    if (role === UserRole.OWNER) {
      return await this.model.find();
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getById(id: string) {
    return await this.model.findById({ _id: id });
  }

}
