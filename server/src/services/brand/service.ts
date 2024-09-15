import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { AuthBody, IFileType } from 'src/types/types';
import { UserRole } from '../user/schema';
import { saveFile } from 'src/utils/file';
import { roleAvailable } from 'src/utils/role';

const { ADMIN, MODERATOR, SUPER_ADMIN } = UserRole;

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private model: Model<Brand>
  ) { }



  async create(auth: AuthBody, body: CreateBrandDto, file: IFileType) {
    if (auth.role === UserRole.OWNER) {
      if (file) body.avatar = await saveFile(file);
      return await this.model.create(body);
    }
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role)) {
      if (auth.shopId === body.shopId.toString()) {
        if (file) body.avatar = await saveFile(file);
        return await this.model.create(body);
      };
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }



  async update(id: string, auth: AuthBody, body: UpdateBrandDto, file: IFileType) {
    if (auth.role === UserRole.OWNER) {
      if (file) body.avatar = await saveFile(file);
      return await this.model.findByIdAndUpdate(id, body, { new: true });
    }
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role)) {
      if (auth.shopId === body.shopId.toString()) {
        if (file) body.avatar = await saveFile(file);
        return await this.model.findByIdAndUpdate(id, body, { new: true });
      };
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }



  async delete(auth: AuthBody, id: string) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.findByIdAndDelete(id);
    }
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role)) {
      const brand = await this.model.findById({ _id: id });
      if (auth.shopId === brand.shopId.toString()) return await this.model.findByIdAndDelete(id);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getAll(auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.find();
    }
    return await this.model.find({ shopId: auth.shopId });
  }

  async getSingle(id: string) {
    if (id) return await this.model.findById({ _id: id });
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getByShopId(id: string) {
    if (id) return await this.model.find({ _id: id });
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
