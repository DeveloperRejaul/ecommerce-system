import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './schema';
import { CreateRatingDto, UpdateRatingDto } from './dto';
import { AuthBody } from 'src/types/types';
import { Product } from '../products/schema';
import { UserRole } from '../user/schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private model: Model<Rating>,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) { }

  async creatingRating(body: CreateRatingDto, auth: AuthBody) {
    const { id, shopId } = auth;
    const product = await this.productModel.findById(body.productId);

    if (product.shopId.toString() !== shopId) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    };

    const isValidUser = product.userId.map(uId => uId.toString()).includes(id);

    if (isValidUser) {
      // creating rating 
      const rating = await this.model.create({ ...body, shopId, userId: id });

      // calculating rating
      const ratings = await this.model.find({ productId: body.productId }, { rating: 1, _id: 0 });
      const totalRatings = ratings.reduce((cur, acc) => cur += acc.rating, 0);
      const mainRating = totalRatings / ratings.length;

      // update rating to product 
      await this.productModel.updateOne({ _id: body.productId }, { rating: mainRating });
      return rating;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };

  async updateRating(ratingId: string, auth: AuthBody, body: UpdateRatingDto) {
    const { role, id } = auth;
    const rating = await this.model.findById(ratingId);
    // for owner 
    if (role === UserRole.OWNER) {
      const rating = await this.model.findByIdAndUpdate(ratingId, body);
      if (body.rating) {
        const ratings = await this.model.find({ productId: rating.productId }, { rating: 1, _id: 0 });
        const totalRatings = ratings.reduce((cur, acc) => cur += acc.rating, 0);
        const mainRating = totalRatings / ratings.length;

        // update rating to product 
        await this.productModel.updateOne({ _id: rating.productId }, { rating: mainRating });
      }
      return rating;
    };

    // for user 
    if (role === UserRole.USER && rating.userId.toString() === id) {
      const rating = await this.model.findByIdAndUpdate(ratingId, body);

      if (body.rating) {
        const ratings = await this.model.find({ productId: rating.productId }, { rating: 1, _id: 0 });
        const totalRatings = ratings.reduce((cur, acc) => cur += acc.rating, 0);
        const mainRating = totalRatings / ratings.length;

        // update rating to product
        await this.productModel.updateOne({ _id: rating.productId }, { rating: mainRating });
      }

      return rating;
    }
  }

  async getAllRating(auth: AuthBody) {
    if (auth.role === UserRole.OWNER) return await this.model.find();
    return await this.model.find({ shopId: auth.shopId });
  };

  async deleteRating(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) {
      return await this.model.findByIdAndDelete(id);
    }

    const rating = await this.model.findById({ _id: id });
    if (rating.shopId.toString() === shopId) {
      return await this.model.findByIdAndDelete(id);
    }
  };


}
