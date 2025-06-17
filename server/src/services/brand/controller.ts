import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req,UseGuards } from '@nestjs/common';
import { BrandService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Controller('api/v-1/brand')
export class BrandController {
  constructor(private readonly service: BrandService) { }

  @Get()
  @UseGuards(AuthGuard)
  getAllBrand(@Req() req, @Query() params) {
    return this.service.getAll(req, params);
  }

  @Post()
  @UseGuards(AuthGuard)
  createBrand(@Req() req, @Body() body: CreateBrandDto) {
    return this.service.create(req, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateBrand(@Param() param, @Req() req, @Body() body: UpdateBrandDto) {
    return this.service.update(param.id, req, body);
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
