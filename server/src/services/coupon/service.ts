import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthBody } from 'src/types';
import { InjectModel } from '@nestjs/sequelize';
import { Coupon } from './model';
import { roleAvailable } from 'src/utils/role';
import {  UserRole } from '../user/model';
import { Op } from 'sequelize';
import { ApplyCouponDto } from './dto';
import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';

const {ADMIN, MODERATOR, OWNER,SUPER_ADMIN, USER} = UserRole;

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon) private readonly model: typeof Coupon
  ) { }

  /**
   * Creates a new coupon based on the provided body and user authentication.
   *
   * @param body - The object containing the coupon data to be created.
   * @param auth - The AuthBody object containing the user's authentication information.
   *
   * @throws HttpException - If the user is not authorized to create a coupon.
   *
   * @returns A promise that resolves to the newly created coupon object.
   *
   * @remarks
   * The function checks the user's role and shop ID to determine if they are authorized to create a coupon.
   * If the user is an owner, a coupon is created for their shop.
   * If the user is an admin, moderator, or super admin, a coupon is created for their shop.
   * If the user's role does not match any of the above, a BAD_REQUEST exception is thrown.
   */
  async createCoupon(body, auth: AuthBody) {
    const { role, shopId } = auth;
    if (role === OWNER) return await this.model.create(body);
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && body.shopId === shopId) return await this.model.create(body);
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  /**
   * Retrieves a list of coupons based on the user's authentication and query parameters.
   *
   * @param auth - The user's authentication information, containing their role and shop ID.
   * @param query - The query parameters for filtering and sorting the coupons.
   * @param option - Additional options for the database query.
   *
   * @throws HttpException - If the user is not authorized to retrieve the coupons.
   *
   * @returns A promise that resolves to the list of coupons that match the given criteria.
   *
   * @remarks
   * The function applies different access controls based on the user's role:
   * - If the user is an owner, all coupons for their shop are returned.
   * - If the user is an admin, moderator, or super admin, coupons for their shop are returned.
   * - If the user is a regular user, coupons for their shop and that are assigned to them are returned.
   *
   * If the user's role does not match any of the above, a BAD_REQUEST exception is thrown.
   */
  @PaginatedQueryDecorator()
  async getCoupon(auth: AuthBody,  query , option? ) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findAll({...option});
    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role)) {
      return await this.model.findAll({...option, where:{shopId}});
    } 
    if (roleAvailable([USER], role)) return await this.model.findAll({where:{ shopId, usersId :{[Op.contains]:[auth.id]}} , attributes:['id','name','type','value','shopId','time'] });

    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }

  /**
   * Retrieves a coupon by its unique identifier.
   *
   * @param id - The unique identifier of the coupon to retrieve.
   *
   * @throws HttpException - If the coupon is not found.
   *
   * @returns A promise that resolves to the found coupon object.
   */
  async getByIdCoupon(id: string) {
    if(id.includes(',')) {
      const ids = id.split(',');
      return await this.model.findAll({where: {id:{[Op.in]: ids} } });
    }
    return await this.model.findOne({where: {id} });
  }

  /**
   * Updates a coupon based on the provided ID and user authentication.
   *
   * @param id - The unique identifier of the coupon to be updated.
   * @param body - The updated coupon data.
   * @param auth - The user's authentication information, containing their role and shop ID.
   *
   * @throws HttpException - If the coupon is not found, the user is not authorized to update it, or an error occurs during the update.
   *
   * @returns A promise that resolves to the number of rows affected by the update operation.
   */
  async updateCoupon(id: string, body, auth: AuthBody) {
    const { role, shopId } = auth;

    const coupon = await this.model.findOne({where: {id} });
    if(!coupon) throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);

    if (role === UserRole.OWNER) return await this.model.update(body, { where :{id} });

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && coupon.shopId.toString() === shopId) {
      return await this.model.update(body,{where:{id}});;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  /**
   * Deletes a coupon based on the provided ID and user authentication.
   *
   * @param id - The unique identifier of the coupon to be deleted.
   * @param auth - The user's authentication information, containing their role and shop ID.
   *
   * @throws HttpException - If the coupon is not found, the user is not authorized to delete it, or an error occurs during deletion.
   *
   * @returns A promise that resolves to the number of rows affected by the deletion operation.
   */
  async deleteCoupon(id: string, auth: AuthBody) {
    const { role, shopId } = auth;
    const coupon = await this.model.findOne({where: {id} });
    if(!coupon)  throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);

    if (role === UserRole.OWNER) return await this.model.destroy({where:{id}});

    if (roleAvailable([ADMIN, SUPER_ADMIN, MODERATOR], role) && coupon.shopId.toString() === shopId) {
      return await this.model.destroy({where:{id}});
    }
  }


  /**
   * Applies a coupon to a user's order based on the provided parameters.
   *
   * @param body - The ApplyCouponDto object containing the necessary information for applying the coupon.
   * @param auth - The AuthBody object containing the user's authentication information.
   *
   * @throws HttpException - If the coupon is not valid or the user is not authorized to use it.
   *
   * @returns An object containing the name, type, and value of the applied coupon.
   */
  async applyCoupon (body:ApplyCouponDto, auth: AuthBody) {
    const coupon = await this.model.findOne({where: {name: body.name} });

    const validCategory = body.categoryId.split(',').every(id=> (coupon?.categorysId || []).includes(id));
    const validProduct = body.productId.split(',').every(id=> (coupon?.productsId || []).includes(id));

    // check correct shop , check valid user
    if(coupon && coupon.shopId === auth.shopId && coupon.usersId.includes(auth.id) && (validCategory || validProduct) ) {
        return {name:coupon.name,  type:coupon.type, value:coupon.value};
    }
    throw new HttpException('Coupon is not valid', HttpStatus.BAD_REQUEST);
  }
}
