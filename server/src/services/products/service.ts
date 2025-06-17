import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthBody } from 'src/types';
import { UserRole } from '../user/model';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './model';
import { roleAvailable } from 'src/utils/role';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import ProductFilterDecorator from 'src/decorators/ProductFilterDecorator';
import { Op } from 'sequelize';
import { Category } from '../category/model';
import { Brand } from '../brand/model';

const { OWNER, ADMIN, SUPER_ADMIN, MODERATOR } = UserRole;

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly model: typeof Product,
  ) { }


  /**
   * Creates a new product based on the provided information.
   *
   * @param auth - The authentication object containing the user's role and shopId.
   * @param body - The product information to be created.
   *
   * @returns The newly created Product object.
   *
   * @throws HttpException - If the user's role is not OWNER or if the user's role is not ADMIN, SUPER_ADMIN, or MODERATOR and the shopId does not match the product's shopId.
   */
  async creatingProduct(auth: AuthBody, body) {
    const { role, shopId } = auth;

    if (role === UserRole.OWNER) return await this.model.create(body);
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && shopId === body.shopId) return await this.model.create(body);
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };


  /**
   * Updates an existing product based on the provided information.
   *
   * @param id - The unique identifier of the product to be updated.
   * @param auth - The authentication object containing the user's role and shopId.
   * @param body - The updated product information.
   *
   * @returns The updated Product object.
   *
   * @throws HttpException - If the user's role is not OWNER and if the user's role is not ADMIN, SUPER_ADMIN, or MODERATOR and the shopId does not match the product's shopId.
   */
  async updateProduct(id: string, auth: AuthBody, body) {
    const { role, shopId } = auth;

    const product = await this.model.findOne({where: {id} });
    if (role === UserRole.OWNER) return await this.model.update(body, {where:{id}});

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && product.shopId.toString() === shopId) {
        return await this.model.update(body, {where:{id}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Deletes a product based on the provided ID and authentication information.
   *
   * @param id - The unique identifier of the product to be deleted.
   * @param auth - The authentication object containing the user's role and shopId.
   *
   * @returns The number of rows affected by the deletion operation.
   *
   * @throws HttpException - If the product is not found, or if the user's role is not OWNER and if the user's role is not ADMIN, SUPER_ADMIN, or MODERATOR and the shopId does not match the product's shopId.
   */
  async deleteProduct(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    const product = await this.model.findOne({where: {id} });
    if(!product) throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);

    if (role === UserRole.OWNER) return await this.model.destroy({where:{id}});
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && product.shopId.toString() === shopId) {  
     return await this.model.destroy({where:{id}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };


  /**
   * Retrieves all products based on the provided authentication and pagination information.
   *
   * @param auth - The authentication object containing the user's role.
   * @param limit - The maximum number of products to retrieve per page.
   * @param option - Additional options for the query, such as sorting or filtering.
   *
   * @returns An array of Product objects, or an empty array if no products are found.
   *
   * @throws HttpException - If the user's role is not OWNER.
   *
   * @remarks This function uses the PaginatedQueryDecorator to handle pagination.
   */
  @PaginatedQueryDecorator()
  async getAllProduct(auth: AuthBody, query, option?) {
    if(auth.role === UserRole.OWNER) return  this.model.findAll({...option, include:[
      {model: Category, attributes:['name']},
      {model: Brand, attributes:['name']},
    ]});
    return this.model.findAll({...option, where:{shopId: auth.shopId}, include:[
      {model: Category, attributes:['name']},
      {model: Brand, attributes:['name']},
    ]});
  };



  /**
   * Retrieves products associated with a specific shop based on the provided shop ID, authentication, and pagination information.
   *
   * @param shopId - The unique identifier of the shop for which products are to be retrieved.
   * @param query - Additional query parameters for the pagination, sorting, or filtering.
   * @param option - Additional options for the query, such as sorting or filtering.
   *
   * @returns An array of Product objects associated with the specified shop, or an empty array if no products are found.
   *
   * @throws HttpException - If the user's role is not OWNER.
   *
   * @remarks This function uses the ProductFilterDecorator and PaginatedQueryDecorator to handle filtering and pagination, respectively.
   *          The option parameter is mutated with a where condition to filter products by the provided shopId.
   */
  @ProductFilterDecorator()
  @PaginatedQueryDecorator()
  async getProductByShopId(shopId: string, query, option?) {
    // mute option with where condition 
    option['where']['shopId'] = shopId;
    return this.model.findAll(option);
  };


  /**
   * Retrieves a product based on the provided ID.
   *
   * @param id - The unique identifier of the product to be retrieved.
   *
   * @returns The Product object associated with the provided ID, or `null` if no product is found.
   *
   * @throws HttpException - If an error occurs during the database query.
   *
   * @remarks This function uses the Sequelize `findOne` method to retrieve a single product based on the provided ID.
   *          If no product is found, it returns `null`.
   *
   * @example
   * ```typescript
   * const productId = '123';
   * const product = await productService.getProductById(productId);
   * console.log(product);
   * ```
   */
  async getProductById(id: string) {
    if(id.includes(',')) {
      const ids = id.split(',');
      return this.model.findAll({where: { id : {[Op.in]:ids}}});
    }
    return this.model.findOne({where: {id}});
  }


   /**
   * Retrieves products associated with a specific category based on the provided category ID,
   * pagination, sorting, and filtering information.
   *
   * @param categoryId - The unique identifier of the category for which products are to be retrieved.
   * @param query - Additional query parameters for the pagination, sorting, or filtering.
   * @param option - Additional options for the query, such as sorting or filtering.
   *
   * @returns An array of Product objects associated with the specified category, or an empty array if no products are found.
   *
   * @throws HttpException - If an error occurs during the database query.
   *
   * @remarks This function uses the ProductFilterDecorator and PaginatedQueryDecorator to handle filtering and pagination, respectively.
   *          The option parameter is mutated with a where condition to filter products by the provided categoryId.
   *
   * @example
   * ```typescript
   * const categoryId = '123';
   * const query = { page: 1, limit: 10, sort: 'price:asc' };
   * const option = {};
   * const products = await productService.getProductByCategoryId(categoryId, query, option);
   * console.log(products);
   * ```
   */
  @ProductFilterDecorator()
  @PaginatedQueryDecorator()
  async getProductByCategoryId (categoryId, query, option?) {
    // mute option with where condition 
    option['where']['categoryId'] = categoryId;
    return this.model.findAll(option);
  }



  /**
   * Retrieves the count of products associated with a specific shop based on the provided authentication information.
   *
   * @param auth - The authentication object containing the user's role and shopId.
   *
   * @returns The count of products associated with the specified shop.
   *
   * @throws HttpException - If the user's role is not OWNER, ADMIN, SUPER_ADMIN, or MODERATOR.
   *
   * @remarks This function uses the Sequelize `count` method to retrieve the count of products associated with the specified shopId.
   *          If the user's role is not authorized, it throws an HttpException with a status code of 400 and a message indicating an error.
   *
   * @example
   * ```typescript
   * const auth = { role: 'ADMIN', shopId: '123' };
   * const productCount = await productService.getProductCount(auth);
   * console.log(productCount);
   * ```
   */
  getProductCount (auth: AuthBody) {
    if(roleAvailable([OWNER, ADMIN, SUPER_ADMIN, MODERATOR ], auth.role)) return this.model.count({where:{shopId: auth.shopId}});
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
