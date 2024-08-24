import { Module, } from '@nestjs/common';
import { CategoryController } from './controller';
import { CategoryService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, Category } from './schema';
import { User, UserSchema } from '../user/schema';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CategoryController, AuthController],
  providers: [CategoryService, AuthService],
})

export class CategoryModule { }