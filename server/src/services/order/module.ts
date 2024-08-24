import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Order, OrderSchema } from './schema';
import { OrderController } from './controller';
import { OrderService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [OrderController, AuthController],
  providers: [OrderService, AuthService],
})
export class OrderModule { }