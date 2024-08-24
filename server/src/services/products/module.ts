import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Product, ProductSchema } from './schema';
import { ProductController } from './controller';
import { ProductService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProductController, AuthController],
  providers: [ProductService, AuthService],
})
export class ProductModule { }