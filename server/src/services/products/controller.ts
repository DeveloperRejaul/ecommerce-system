import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v-1/product')
export class ProductController {
  constructor(private readonly service: ProductService) { }

  /**
   * Creates a new product.
   *
   * @remarks
   * This function is responsible for handling the creation of a new product.
   * It requires authentication to be performed before creating a product.
   *
   * @param req - The request object containing information about the client's request.
   * @param body - The body of the request containing the product data to be created.
   *
   * @returns A promise that resolves to the newly created product.
   */
  @Post()
  @UseGuards(AuthGuard)
  creatingProduct(@Req() req, @Body() body) {
    return this.service.creatingProduct(req, body);
  };

  /**
   * Retrieves all products based on the provided query parameters.
   *
   * @remarks
   * This function is responsible for fetching all products from the database based on the given query parameters.
   * It requires authentication to be performed before retrieving the products.
   *
   * @param req - The request object containing information about the client's request.
   * @param query - The query parameters used to filter and sort the products.
   *
   * @returns A promise that resolves to an array of products matching the provided query parameters.
   */
  @Get()
  @UseGuards(AuthGuard)
  getAllProduct(@Req() req, @Query() query) {
    return this.service.getAllProduct(req, query);
  };

  /**
   * Retrieves the total count of products in the database.
   *
   * This function is responsible for fetching the total number of products in the database.
   * It requires authentication to be performed before retrieving the count.
   *
   * @param req - The request object containing information about the client's request.
   *
   * @returns A promise that resolves to the total count of products in the database.
   */
  @Get('count')
  @UseGuards(AuthGuard)
  getProductCount(@Req() req) {
    return this.service.getProductCount(req);
  }

  /**
   * Retrieves products based on the provided shop ID and query parameters.
   *
   * @remarks
   * This function is responsible for fetching products from the database that belong to a specific shop.
   * It requires authentication to be performed before retrieving the products.
   *
   * @param param - The route parameters containing the shop ID.
   * @param param.id - The unique identifier of the shop whose products are to be retrieved.
   *
   * @param query - The query parameters used to filter and sort the products.
   *
   * @returns A promise that resolves to an array of products belonging to the specified shop and matching the provided query parameters.
   * If no products are found for the given shop ID, the promise will resolve to an empty array.
   */
  @Get('shop/:id')
  getProductByShopId(@Param() param, @Query() query) {
    return this.service.getProductByShopId(param.id, query);
  };

  /**
   * Retrieves products based on the provided category ID and query parameters.
   *
   * @remarks
   * This function is responsible for fetching products from the database that belong to a specific category.
   * It requires authentication to be performed before retrieving the products.
   *
   * @param param - The route parameters containing the category ID.
   * @param query - The query parameters used to filter and sort the products.
   *
   * @returns A promise that resolves to an array of products belonging to the specified category and matching the provided query parameters.
   */
  @Get('category/:id')
  getProductByCategoryId(@Param() param, @Query() query) {
    return this.service.getProductByCategoryId(param.id, query);
  }

  /**
   * Retrieves a product by its ID.
   *
   * This function is responsible for fetching a single product from the database based on the provided ID.
   * It does not require any authentication to be performed before retrieving the product.
   *
   * @param param - The route parameters containing the product ID.
   * @param param.id - The unique identifier of the product to be retrieved.
   *
   * @returns A promise that resolves to the product with the specified ID.
   * If no product is found with the given ID, the promise will resolve to `null`.
   */
  @Get(':id')
  getById(@Param() param) {
    return this.service.getProductById(param.id);
  }

  /**
   * Updates an existing product based on the provided ID.
   *
   * @remarks
   * This function is responsible for updating a product in the database based on the provided ID.
   * It requires authentication to be performed before updating the product.
   *
   * @param param - The route parameters containing the product ID.
   * @param param.id - The unique identifier of the product to be updated.
   *
   * @param req - The request object containing information about the client's request.
   *
   * @param body - The body of the request containing the updated product data.
   *
   * @returns A promise that resolves to the updated product.
   * If no product is found with the given ID, the promise will resolve to `null`.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param() param, @Req() req, @Body() body) {
    return this.service.updateProduct(param.id, req, body);
  }

  /**
   * Deletes a product from the database based on the provided ID.
   *
   * @remarks
   * This function is responsible for removing a product from the database based on the provided ID.
   * It requires authentication to be performed before deleting the product.
   *
   * @param req - The request object containing information about the client's request.
   * @param param - The route parameters containing the product ID.
   * @param param.id - The unique identifier of the product to be deleted.
   *
   * @returns A promise that resolves to `true` if the product is successfully deleted.
   * If no product is found with the given ID, the promise will resolve to `false`.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Req() req, @Param() param) {
    return this.service.deleteProduct(param.id, req);
  };
}
