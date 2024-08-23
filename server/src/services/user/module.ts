import {  Module, } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema';
import { Shop, ShopSchema } from '../shop/schema';
import { ShopController } from '../shop/controller';
import { ShopService } from '../shop/service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
  ],
  controllers: [UserController, ShopController],
  providers: [UserService, ShopService],
})
  
export class UserModule { }