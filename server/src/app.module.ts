import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileModule } from './services/file/module';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from './services/shop/module';
import { UserModule } from './services/user/module';
import { CategoryModule } from './services/category/module';
import { AuthModule } from './services/auth/module';
import { CouponModule } from './services/coupon/module';
import { ProductModule } from './services/products/module';
import { RatingModule } from './services/rating/module';
import { OrderModule } from './services/order/module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'], isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' } }),

    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD },
      },
    }),

    AuthModule,
    FileModule,
    UserModule,
    ShopModule,
    CategoryModule,
    CouponModule,
    ProductModule,
    RatingModule,
    OrderModule
  ],
  controllers: [AppController],
})
export class AppModule { }