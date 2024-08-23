import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './services/file/module';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from './services/shop/module';
import { UserModule } from './services/user/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DATABASE_URL),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),

    FileModule,
    UserModule,
    ShopModule,
  ],
  controllers: [AppController],
  
})
export class AppModule { }