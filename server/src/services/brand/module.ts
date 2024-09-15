import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../auth/controller';
import { AuthService } from '../auth/service';
import { Brand, BrandSchema } from './schema';
import { BrandController } from './controller';
import { BrandService } from './service';
import { User, UserSchema } from '../user/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [BrandController, AuthController],
  providers: [BrandService, AuthService],
})
export class BrandModule { }