
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopService } from './service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateShopDto } from './dto';


@Controller('api/v-1/shop')
export class ShopController {
  constructor(private readonly service: ShopService) { }


  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() body: CreateShopDto, @UploadedFile() file, @Request() { id, email, role }) {
    return this.service.create(body, file, { id, email, role });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param() param, @Request() { role, id }) {
    return this.service.delete(param.id, role, id);
  }

}
