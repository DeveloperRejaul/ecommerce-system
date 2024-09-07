 
import { Module } from '@nestjs/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, Category } from './schema';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Shop, ShopSchema } from '../shop/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      {  name: Category.name, schema: CategorySchema}, 
      {name:Shop.name, schema:ShopSchema}
    ]),
  ],
  controllers: [CategoryController, AuthController],
  providers: [CategoryService, AuthService],
})

export class CategoryModule {}
