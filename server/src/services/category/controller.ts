import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v-1/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) { }


  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  createCategory(@Req() req, @Body() body: CreateCategoryDto, @UploadedFile() file) {
    return this.service.createCategory(body, req, file);
  };

  @Get()
  @UseGuards(AuthGuard)
  getCategory(@Request() req) {
    return this.service.getCategory(req);
  };

  @Put(':id')
  @UseGuards(AuthGuard)
  updateCategory(@Param() param, @Body() body: UpdateCategoryDto, @Request() req) {
    return this.service.updateCategory(param.id, body, req);
  };

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param() param, @Request() req) {
    return this.service.deleteCategory(param.id, req);
  };
}
