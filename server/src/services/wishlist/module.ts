import { Module, } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wishlist } from './model';
import { WishlistController } from './controller';
import { WishlistService } from './service';

@Module({
  imports: [
    SequelizeModule.forFeature([Wishlist])
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})

export class WishlistModule { }