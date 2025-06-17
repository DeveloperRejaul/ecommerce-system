import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatingDto, UpdateRatingDto } from './dto';
import { AuthBody } from 'src/types';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './model';
import { Product } from '../products/model';
import { Order } from '../order/model';
import { UserRole } from '../user/model';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating) private readonly model: typeof Rating,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(Order) private readonly orderModel: typeof Order
  ) { }

  async creatingRating(body: CreateRatingDto, auth: AuthBody) {
    const { id, shopId } = auth;
    const product = await this.productModel.findOne({where:{id: body.productId}});


    if (product.shopId.toString() !== shopId) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    };

    const user = await this.orderModel.findOne({where:{ userId:id }});

    if (user) {
      // creating rating 
      const rating = await this.model.create({ ...body, shopId, userId: id });

      // calculating rating
      const ratings = await this.model.findAll({where:{ productId: body.productId}, attributes:['rating'] });
      // console.log(ratings);
      

      const totalRatings = ratings.reduce((cur, acc) => cur += acc.rating, 0);
      const mainRating = totalRatings / ratings.length;

    
      
      // update rating to product 
      await this.productModel.update({ rating: mainRating }, {where: { id: body.productId }});
      return rating;
    }
    // throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async updateRating(ratingId: string, auth: AuthBody, body: UpdateRatingDto) {
    const { id } = auth;
    
    const rating = await this.model.findOne({where:{id:ratingId}});
    if(!rating) throw new HttpException('Rating not found', HttpStatus.BAD_REQUEST); 

    // for user 
    if (rating.userId.toString() === id) {
      await this.model.update(body, {where:{id: ratingId}});

      if (body.rating) {
        const ratings = await this.model.findAll({ where: { productId: rating.productId }, attributes:['rating']});

        const totalRatings = ratings.reduce((cur, acc) => cur += acc.rating, 0);
        const mainRating = totalRatings / ratings.length;

        // update rating to product
        await this.productModel.update({ rating: mainRating }, {where: { id: rating.productId }, });
      }

      return rating;
    }
  }

  async getAllRating(auth: AuthBody) {
    if (auth.role === UserRole.OWNER) return await this.model.findAll();
    return await this.model.findAll({ where:{shopId: auth.shopId} });
  };

  async deleteRating(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.destroy({where:{id}});
  
    const rating = await this.model.findOne({where: {id} });
    if (rating.shopId.toString() === shopId) return await this.model.destroy({where:{id}});
  };
}
