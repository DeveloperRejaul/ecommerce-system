import { Module } from '@nestjs/common';
import { ProductService } from './service';
import { ProductController } from './controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './model';


@Module({
  imports: [
    SequelizeModule.forFeature([Product])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule { }