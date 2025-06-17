import {Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModule } from './services/file/module';
import { UserModule } from './services/user/module';
import { User } from './services/user/model';
import { ShopModule } from './services/shop/module';
import { Shop } from './services/shop/model';
import { Category } from './services/category/model';
import { CategoryModule } from './services/category/module';
import { CouponModule } from './services/coupon/module';
import { ProductModule } from './services/products/module';
import { BrandModule } from './services/brand/module';
import { Product } from './services/products/model';
import { Coupon } from './services/coupon/model';
import { Brand } from './services/brand/model';
import { RatingModule } from './services/rating/module';
import { OrderModule } from './services/order/module';
import { Rating } from './services/rating/model';
import { Order } from './services/order/model';
import { Wishlist } from './services/wishlist/model';
import { WishlistModule } from './services/wishlist/module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port:Number(process.env.DB_PORT),
      username: process.env.DB_USER ,
      password: process.env.DB_PASS,
      database:  process.env.DB_NAME,
      synchronize: true,
      autoLoadModels: true,
      models: [
        User,
        Shop,
        Brand,
        Category,
        Product,
        Coupon,
        Order,
        Rating,
        Wishlist
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),

    JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
      },
    }),
    FileModule,
    UserModule,
    ShopModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    OrderModule,
    RatingModule,
    WishlistModule
  ],
  controllers: [AppController],
})
export class AppModule {}

