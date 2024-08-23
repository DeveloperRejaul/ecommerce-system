import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Shop } from './schema';
import { CreateShopDto } from './dto';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';


@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop.name) private model: Model<Shop>,
  ) { }

  /**
   * @description this function using for create shop
   * @returns  shop object
   */
  async create(body: CreateShopDto, file: IFileType, auth:AuthBody) {
    if (auth.role === UserRole.OWNER) {
      if (file) { 
        body['avatar'] = await saveFile(file);
      }
      return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
    
  async delete() { }


  async update() { }

  async getAll() {

  }

  async getByEmail() { }

  async getById() { }

}
