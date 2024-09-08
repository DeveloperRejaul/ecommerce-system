import { Module, } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schema';
import { Shop, ShopSchema } from '../shop/schema';
import { ShopController } from '../shop/controller';
import { ShopService } from '../shop/service';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Shop.name, schema: ShopSchema }]),
  ],
  controllers: [UserController, ShopController, AuthController],
  providers: [UserService, ShopService, AuthService],
})

export class UserModule { }