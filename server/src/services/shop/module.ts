 
import { Module } from '@nestjs/common';
import { ShopController } from './controller';
import { ShopService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopSchema, Shop } from './schema';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema},{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ShopController, AuthController],
  providers: [ShopService, AuthService],
})
export class ShopModule { }