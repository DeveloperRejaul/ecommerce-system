import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ProductService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createProductSchema, updateProductSchema } from './dto';
import { JoiValidationPipe } from 'src/validation.pipe';


@Controller('api/v-1/product')
export class ProductController {
  constructor(private readonly service: ProductService) { }


  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(createProductSchema))
  @UseInterceptors(FilesInterceptor('images'))
  creatingProduct(@Req() req, @Body() body, @UploadedFiles() files) {
    return this.service.creatingProduct(req, body, files);
  };

  @Get()
  @UseGuards(AuthGuard)
  getAllProduct(@Req() req, @Query() query) {
    return this.service.getAllProduct(req, Number(query.limit), Number(query.skip), query.sort);
  };

  @Get('shop/:id')
  getSingleProduct(@Param() param) {
    return this.service.getProductByShopId(param.id);
  };

  @Get(':id')
  getById(@Param() param) {
    return this.service.getProductById(param.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(updateProductSchema))
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(@Param() param, @Req() req, @Body() body, @UploadedFiles() files) {
    return this.service.updateProduct(param.id, req, body, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Req() req, @Param() param) {
    return this.service.deleteProduct(param.id, req);
  };
}
