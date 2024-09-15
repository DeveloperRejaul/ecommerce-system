import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BrandService } from './service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBrandDto, UpdateBrandDto } from './dto';



@Controller('api/v-1/brand')
export class BrandController {
  constructor(private readonly service: BrandService) { }


  @Get()
  @UseGuards(AuthGuard)
  getAllBrand(@Req() req) {
    return this.service.getAll(req);
  }


  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  createBrand(@Req() req, @Body() body: CreateBrandDto, @UploadedFile() file) {
    return this.service.create(req, body, file);
  }


  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateBrand(@Param() param, @Req() req, @Body() body: UpdateBrandDto, @UploadedFile() file) {
    return this.service.update(param.id, req, body, file);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBrand(@Req() req, @Param() param) {
    return this.service.delete(req, param.id);
  }

  @Get(':id')
  getSingleBrand(@Param() param) {
    return this.service.getSingle(param.id);
  }

  @Get('shop/:id')
  getBrandByShop(@Param() param) {
    return this.service.getByShopId(param.id);
  }
}
