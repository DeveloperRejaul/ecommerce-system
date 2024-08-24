import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v-1/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) { }


  @Post()
  @UseGuards(AuthGuard)
  createCategory(@Body() body: CreateCategoryDto, @Request() req) {
    return this.service.createCategory(body, req);
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
