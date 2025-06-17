import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShopDto, UpdateShopDto } from './dto';
import { AuthBody} from 'src/types';
import { User, UserRole } from '../user/model';
import { InjectModel } from '@nestjs/sequelize';
import { Shop } from './model';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import { Category } from '../category/model';
import { Product } from '../products/model';
import { Order } from '../order/model';
import { Brand } from '../brand/model';
import { Coupon } from '../coupon/model';
import { Rating } from '../rating/model';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(Shop) private readonly model: typeof Shop,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(Brand) private readonly brandModel: typeof Brand,
    @InjectModel(Coupon) private readonly couponModel: typeof Coupon,
    @InjectModel(Rating) private readonly ratingModel: typeof Rating,
  ) { }

  /**
   * @description this function using for create shop
   * Shop can create only owner 
   * @returns  shop object
   */
  async create(body:CreateShopDto, auth: AuthBody) {
    if (auth.role !== UserRole.OWNER) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    return await this.model.create(body); 
  }
  /**
   * @description this function using for create shop
   * Shop can create only owner 
   * @returns  shop object
   */
  async getCount(role) {
    if (role !== UserRole.OWNER) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    return await this.model.count();
  }


 /**
 * @description this function using for delete shop
 * @returns  shop object
 */
  async delete(id: string, role: string, shopId: string) {
    if (role === UserRole.OWNER) {
      await this.productModel.destroy({where:{shopId:id} });
      await this.categoryModel.destroy({where:{shopId:id} });
      await this.brandModel.destroy({where:{shopId:id} });
      await this.userModel.destroy({where:{shopId:id} });
      await this.orderModel.destroy({where:{shopId:id} });
      await this.couponModel.destroy({where:{shopId:id} });
      await this.ratingModel.destroy({where:{shopId:id} });
      return await this.model.destroy({where:{id}});
    };
    if (role === UserRole.SUPER_ADMIN && shopId === id) return await this.model.destroy({ where:{id}});
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async update(id: string, role: string, shopId: string, body: UpdateShopDto) {
    if (role === UserRole.OWNER){
       await this.model.update(body, {where:{ id}});
       return this.model.findOne({where:{id}});
    }

    if (role === UserRole.SUPER_ADMIN && shopId === id) {
      await this.model.update(body, {where:{id}});
      return this.model.findOne({where:{id}});
    };
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  @PaginatedQueryDecorator()
  async getAll(role: string, query, option?) {
    if (role === UserRole.OWNER) return await this.model.findAll({...option,include:[{model: User, attributes:['name', 'avatar']}]});
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  async getById(id: string) {
    return await this.model.findOne({where:{ id} });
  }

}
