import { Module } from '@nestjs/common';
import { BrandController } from './controller';
import { BrandService } from './service';
import { Brand } from './model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Brand])
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule { }