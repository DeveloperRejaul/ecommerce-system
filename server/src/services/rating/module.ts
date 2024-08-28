import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Rating, RatingSchema } from './schema';
import { RatingController } from './controller';
import { RatingService } from './service';
import { Product, ProductSchema } from '../products/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [RatingController, AuthController],
  providers: [RatingService, AuthService],
})
export class RatingModule { }