import { Module } from '@nestjs/common';
import {ShopController } from './controller';
import { ShopService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema, Shop } from './schema';
import { User, UserSchema } from '../user/schema';
import { UserController } from '../user/controller';
import { UserService } from '../user/service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ShopController, UserController],
  providers: [ShopService, UserService],
})
export class ShopModule { }