
import { FileInterceptor } from '@nestjs/platform-express';
import { ShopService } from './service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateShopDto, UpdateShopDto } from './dto';


@Controller('api/v-1/shop')
export class ShopController {
  constructor(private readonly service: ShopService) { }


  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() body: CreateShopDto, @UploadedFile() file, @Request() { id, email, role }) {
    return this.service.create(body, file, { id, email, role });
  }


  @Get()
  @UseGuards(AuthGuard)
  getAll(@Request() { role }) {
    return this.service.getAll(role);
  }

  @Get(':id')
  getById(@Param() param,) {
    return this.service.getById(param.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param() param, @Request() { role, shopId }) {
    return this.service.delete(param.id, role, shopId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Param() param, @Request() { role, shopId }, @Body() body: UpdateShopDto, @UploadedFile() file) {
    return this.service.update(param.id, role, shopId, body, file);
  }
}
