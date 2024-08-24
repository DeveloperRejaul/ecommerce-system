import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Rating } from './schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private model: Model<Rating>
  ) { }

  async creatingRating() { };
  async deleteRating() { };
  async getAllRating() { };
  async updateRating() { }

}
