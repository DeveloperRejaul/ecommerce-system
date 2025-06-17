import { Module, } from '@nestjs/common';
import { UserController } from './controller';
import { UserService } from './service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model';
import { Shop } from '../shop/model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Shop])
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule { }