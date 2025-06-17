import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v-1/category')
export class CategoryController {
  constructor(private readonly service: CategoryService) { }

  /**
   * Creates a new category.
   *
   * @param req - The HTTP request object containing user details from authentication.
   * @param body - The request body containing the category data.
   * @param body.name - The name of the category to be created.
   * @param body.description - (Optional) A description of the category.
   * @returns A promise that resolves to the newly created category object.
   * @throws Will throw an error if the request body validation fails or the user is not authorized.
   */
  @Post()
  @UseGuards(AuthGuard)
  createCategory(@Req() req, @Body() body:CreateCategoryDto) {
    return this.service.createCategory(body, req);
  }
  
  /**
   * Retrieves all categories associated with the authenticated user.
   *
   * @param req - The HTTP request object containing user details from authentication.
   * @returns A promise that resolves to an array of category objects associated with the user.
   * @throws Will throw an error if the user is not authorized or if an internal error occurs.
   */
  @Get()
  @UseGuards(AuthGuard)
  getCategory(@Request() req, @Query() params) {
    return this.service.getCategory(req, params);
  }

  /**
   * Retrieves the total count of categories associated with the authenticated user.
   *
   * @param req - The HTTP request object containing user details from authentication.
   * @returns A promise that resolves to a number representing the total count of categories associated with the user.
   * @throws Will throw an error if the user is not authorized or if an internal error occurs.
   */
  @Get('count')
  @UseGuards(AuthGuard)
  getCount(@Req() req) {
    return this.service.getCount(req);
  }

   /**
   * Retrieves categories associated with a specific shop by its ID.
   *
   * @param param - The route parameters containing the shop ID.
   * @param param.id - The ID of the shop whose associated categories are to be retrieved.
   * @returns A promise that resolves to an array of category objects associated with the specified shop.
   * @throws Will throw an error if the shop ID is not found or the user is not authorized.
   */
  @Get('shop/:id')
  getWithShopId(@Param() {id}){
    return this.service.getWithShopId(id);
  }


  /**
   * Retrieves a category by its ID.
   *
   * @param param - The route parameters containing the category ID.
   * @param param.id - The ID of the category to be retrieved.
   * @returns A promise that resolves to the category object with the specified ID.
   * @throws Will throw an error if the category ID is not found or the user is not authorized.
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  getCategoryById(@Param() {id}) {
    return this.service.getCategoryById(id);
  };


  /**
   * Updates a category by its ID.
   *
   * @param param - The route parameters containing the category ID.
   * @param param.id - The ID of the category to be updated.
   * @param body - The updated category data.
   * @param body.name - The new name of the category.
   * @param body.description - The new description of the category.
   * @param req - The request object containing the user's authentication information.
   * @returns A promise that resolves to the updated category object.
   * @throws Will throw an error if the category ID is not found, the user is not authorized, or the provided data is invalid.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  updateCategory(@Param() param, @Body() body: UpdateCategoryDto, @Request() req) {
    return this.service.updateCategory(param.id, body, req);
  };

  /**
   * Deletes a category by its ID.
   *
   * @param param - The route parameters containing the category ID.
   * @param param.id - The ID of the category to be deleted.
   * @param req - The request object containing the user's authentication information.
   * @returns A promise that resolves to the deleted category object.
   * @throws Will throw an error if the category ID is not found or the user is not authorized.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCategory(@Param() param, @Request() req) {
    return this.service.deleteCategory(param.id, req);
  };
}
