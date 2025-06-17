import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { AuthBody } from 'src/types';
import { Brand } from './model';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole } from '../user/model';
import { roleAvailable } from 'src/utils/role';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';

const {ADMIN,MODERATOR,OWNER,SUPER_ADMIN} = UserRole;

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand) private readonly model: typeof Brand
  ) { }


  async create(auth: AuthBody, body: CreateBrandDto) {
    if (auth.role === OWNER) return await this.model.create(body);    
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role) && auth.shopId === body.shopId.toString()) {
        return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, auth: AuthBody, body: UpdateBrandDto) {
    console.log(body);
    
    if (auth.role === UserRole.OWNER) return await this.model.update(body, { where: {id} });
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role) && auth.shopId === body.shopId.toString()) {
      return await this.model.update(body, { where: {id} });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async delete(auth: AuthBody, id: string) {
    if (auth.role === UserRole.OWNER) return await this.model.destroy({where:{id}});
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role)) {
      const brand = await this.model.findOne({where:{ id} });
      if (auth.shopId === brand.shopId.toString()) return await this.model.destroy({where:{id}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  @PaginatedQueryDecorator()
  async getAll(auth: AuthBody,  query , option?) {
    if (auth.role === UserRole.OWNER) return await this.model.findAll(option);
    return await this.model.findAll({...option, where:{ shopId: auth.shopId} });
  }

  async getSingle(id: string) {
    if (id) return await this.model.findOne({where:{ id} });
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getByShopId(id: string) {
    if (id) return await this.model.findAll({ where: { shopId: id} });
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}