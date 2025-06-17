import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthBody } from 'src/types';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category, CategoryType } from './model';
import { roleAvailable } from 'src/utils/role';
import { UserRole } from '../user/model';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import { Op } from 'sequelize';

const {ADMIN,MODERATOR,OWNER,SUPER_ADMIN} = UserRole;

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly model: typeof Category,
  ) { }

  /**
   * Creates a new category in the database based on the provided data and authentication details.
   *
   * @param {CreateCategoryDto} body - The data for the new category.
   * @param {AuthBody} auth - The authentication details of the user making the request.
   *
   * @throws {HttpException} If the user's role does not have the necessary permissions or if the maximum number of top-selection categories is reached.
   *
   * @returns {Promise<Category>} A promise that resolves to the newly created Category object.
   *
   * @example
   * const newCategoryData = { name: 'New Category', description: 'A sample category', shopId: '123' };
   * const authDetails = { role: UserRole.ADMIN, shopId: '123' };
   * const newCategory = await categoryService.createCategory(newCategoryData, authDetails);
   * console.log(newCategory); // Output: Newly created Category object
   */
  async createCategory(body: CreateCategoryDto, auth: AuthBody) {
    if(body.type && body.type === CategoryType.TOP_SELECTION) {
     const totalLen =  await this.model.count({where: {shopId: body.shopId, type: CategoryType.TOP_SELECTION}});
     if(totalLen > 4) throw new HttpException('maximin length 4', HttpStatus.BAD_REQUEST);   
    }
    if (auth.role === OWNER) return await this.model.create(body);

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role) && auth.shopId === body.shopId.toString()) {
      return await this.model.create(body);
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Retrieves categories based on the user's role and authentication details.
   *
   * @param {AuthBody} auth - The authentication details of the user making the request.
   *
   * @throws {HttpException} If the user's role does not have the necessary permissions.
   *
   * @returns {Promise<Category[]>} A promise that resolves to an array of Category objects.
   * If the user is an owner, it returns all root-level categories with their subcategories.
   * If the user is an admin, moderator, or super admin, it returns root-level categories for the specific shop with nested subcategories.
   *
   * @example
   * const authDetails = { role: UserRole.ADMIN, shopId: '456' };
   * const categories = await categoryService.getCategory(authDetails);
   * console.log(categories); // Output: [Category1, Category2, ...]
   */
  @PaginatedQueryDecorator()
  async getCategory(auth: AuthBody , params, option?) {    
    return await this.model.findAll({
      ...option,
      where: { shopId: auth.shopId},
    });
  }
  
  /**
   * Retrieves a category by its unique identifier and includes its nested subcategories.
   *
   * @param {string} id - The unique identifier of the category to retrieve.
   *
   * @throws {Error} If the database operation fails or if the category is not found.
   *
   * @returns {Promise<Category>} A promise that resolves to the retrieved Category object with its nested subcategories.
   *
   * @example
   * const categoryId = '123';
   * const category = await categoryService.getCategoryById(categoryId);
   * console.log(category); // Output: Category object with nested subcategories
   */
  async getCategoryById(id: string) {
    if(id.includes(',')) {
      const ids = id.split(',');
      return this.model.findAll({where:{id:{[Op.in]: ids}}});
    }
    return this.model.findOne({where:{id}});
  }

  /**
   * Updates a category in the database based on the provided ID and authentication details.
   *
   * @param {string} id - The unique identifier of the category to be updated.
   * @param {UpdateCategoryDto} body - The updated data for the category.
   * @param {AuthBody} auth - The authentication details of the user making the request.
   *
   * @throws {HttpException} If the user's role does not have the necessary permissions or if the category cannot be found.
   *
   * @returns {Promise<number[]>} A promise that resolves to an array containing the number of rows affected by the update operation.
   * The first element of the array represents the number of rows updated.
   *
   * @example
   * const categoryId = '123';
   * const updatedData = { name: 'New Category Name', description: 'Updated description' };
   * const authDetails = { role: UserRole.ADMIN, shopId: '456' };
   * const rowsAffected = await categoryService.updateCategory(categoryId, updatedData, authDetails);
   * console.log(rowsAffected); // Output: [1] (if the category was successfully updated)
   */
  async updateCategory(id: string, body: UpdateCategoryDto, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) {
      return await this.model.update(body, { where: { id } });
    }
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role)) {
      const category = await this.model.findOne({ where: { id } });
      if (auth.shopId === category.shopId.toString()) return await this.model.update(body, { where: { id } });
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Deletes a category from the database based on the provided ID and authentication details.
   *
   * @param {string} id - The unique identifier of the category to be deleted.
   * @param {AuthBody} auth - The authentication details of the user making the request.
   *
   * @throws {HttpException} If the user's role does not have the necessary permissions or if the category cannot be found.
   *
   * @returns {Promise<number>} A promise that resolves to the number of rows affected by the deletion operation.
   *
   * @example
   * const categoryId = '123';
   * const authDetails = { role: UserRole.ADMIN, shopId: '456' };
   * const rowsAffected = await categoryService.deleteCategory(categoryId, authDetails);
   * console.log(rowsAffected); // Output: 1 (if the category was successfully deleted)
   */
  async deleteCategory(id: string, auth: AuthBody) {
    if (auth.role === UserRole.OWNER) return await this.model.destroy({where:{id}});
    const category = await this.model.findOne({where:{id} });
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], auth.role) && category.shopId.toString() === auth.shopId) {
        return await this.model.destroy({where:{id}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Retrieves categories associated with a specific shop.
   *
   * @param {string} shopId - The unique identifier of the shop.
   * @returns {Promise<Category[]>} A promise that resolves to an array of Category objects associated with the given shopId.
   *
   * @throws {Error} If the database operation fails.
   *
   * @example
   * const shopId = '123';
   * const categories = await categoryService.getWithShopId(shopId);
   * console.log(categories); // Output: [Category1, Category2, ...]
   */
  async getWithShopId (shopId) {
    return this.model.findAll({where:{shopId}});
  }


  /**
   * Retrieves the count of categories associated with a specific shop based on the user's role and authentication details.
   *
   * @param {AuthBody} auth - The authentication details of the user making the request.
   *
   * @throws {HttpException} If the user's role does not have the necessary permissions.
   *
   * @returns {Promise<number>} A promise that resolves to the count of categories associated with the given shopId.
   *
   * @example
   * const authDetails = { role: UserRole.ADMIN, shopId: '456' };
   * const categoryCount = await categoryService.getCount(authDetails);
   * console.log(categoryCount); // Output: 10 (if there are 10 categories associated with the shopId '456')
   */
  async getCount (auth: AuthBody) {
    if(roleAvailable([ADMIN,MODERATOR,OWNER,SUPER_ADMIN], auth.role)) return this.model.count({where:{shopId: auth.shopId}});
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
