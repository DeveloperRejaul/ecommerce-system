import { Product } from './../products/model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Wishlist } from './model';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole } from '../user/model';
import { roleAvailable } from 'src/utils/role';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import { AuthBody } from 'src/types';
const {OWNER,USER} = UserRole;
@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist) private readonly model: typeof Wishlist,
  ) { }

  async create (body) {
    return this.model.create(body); 
  }

  async update (auth:AuthBody, id:string, body) {
    if(roleAvailable([OWNER],auth.role)) return this.model.update(body,{where:{id}});

    const wishlist = await this.model.findOne({where:{id}});
    if( wishlist.userId === auth.id) {
      return this.model.update(body,{where:{id}});
    }

    throw new HttpException('Not authorized to update this wishlist', HttpStatus.BAD_REQUEST);
  }

  async delete (auth:AuthBody, id:string) {
    if(roleAvailable([OWNER],auth.role)) return this.model.destroy({where:{id}});

    const wishlist = await this.model.findOne({where:{id}});
    if( wishlist.userId === auth.id) {
      return this.model.destroy({where:{id}});
    }
    throw new HttpException('Not authorized to delete this wishlist', HttpStatus.BAD_REQUEST);
  }
  
  async get(auth:AuthBody, id:string) {
    const wishlist = await this.model.findOne({where:{id}});
    if(roleAvailable([OWNER],auth.role)) return wishlist;

    if(wishlist &&  wishlist.userId === auth.id) {
      return wishlist;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
  
  @PaginatedQueryDecorator()
  async getAll (auth, query , option? ) {
    if(roleAvailable([OWNER], auth.role)) {
      return this.model.findAll({...option,  include:[{model: Product}]});
    }

    if(roleAvailable([USER], auth.role)) {
      return this.model.findAll({...option, where:{ userId: auth.id}, include:[{model: Product}]});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getByProductId (auth: AuthBody, params) {
   const res = await this.model.findOne({where:{productId: params.id, userId: auth.id}});
   if (res) return res;
   throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}