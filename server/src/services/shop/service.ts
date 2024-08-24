import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop } from './schema';
import { CreateShopDto } from './dto';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';
import { UserService } from '../user/service';


@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private model: Model<Shop>,
    private userService: UserService
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
  async delete(id: string, role: string, userId: string) {
    if (role === UserRole.OWNER) return await this.model.findByIdAndDelete(id);
    if (role === UserRole.SUPPER_ADMIN) {
      const user = await this.userService.findById(userId);
      if (user.shopId.toString() === id) {
        return await this.model.findByIdAndDelete(id);
      }
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async update() { }

  async getAll() { }

  async getByEmail() { }

  async getById() { }

}
