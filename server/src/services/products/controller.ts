import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
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
  creatingProduct(@Request() req, @Body() body, @UploadedFiles() files) {
    return this.service.creatingProduct(req, body, files);
  };

  @Get()
  @UseGuards(AuthGuard)
  getAllProduct(@Request() req) {
    return this.service.getAllProduct(req);
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
  async updateProduct(@Param() param, @Request() req, @Body() body, @UploadedFiles() files) {
    return this.service.updateProduct(param.id, req, body, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Request() req, @Param() param) {
    return this.service.deleteProduct(param.id, req);
  };
}
