import { PaginatedQueryDecorator } from 'src/decorators/QueryDecorator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthBody } from 'src/types';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { User, UserRole } from '../user/model';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './model';
import { Product } from '../products/model';
import { Coupon } from '../coupon/model';
import { roleAvailable } from 'src/utils/role';
import { Op } from 'sequelize';
import cardProductPriceCalculate from 'src/utils/price';

const { ADMIN, MODERATOR, SUPER_ADMIN, USER, OWNER } = UserRole;
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private readonly model: typeof Order,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(Coupon) private readonly couponModel: typeof Coupon,
    @InjectModel(User) private readonly userModel: typeof User
  ) { }


  /**
   * @description This function is used to create a new order
   * @param body order object
   * @param auth user information object
   * @returns order object
   */
  async createOrder(body: CreateOrderDto) {
    // checking product is bailable
    const products = await Promise.all(body.products.map(async product => {
      const isExists = await this.productModel.findOne({where:{id: product.productId}});
      if(!isExists) {
        throw new HttpException('Currently this product is not available in our shop', HttpStatus.BAD_REQUEST); 
      }
      return {...isExists.toJSON(), pis: product.quantity};
    }));


   
    // handle coupon checking validity
    let coupon = null;
    if(body.couponName) {
      const data = await this.couponModel.findOne({ where:{name: body.couponName} });
      coupon  = data.toJSON(); 
      
      if(!coupon) throw new HttpException('Invalid coupon', HttpStatus.BAD_REQUEST);
      if(body.shopId !== coupon.shopId)  throw new HttpException('Invalid coupon', HttpStatus.BAD_REQUEST);

      // checking category and product id  exists in coupon
      const isCategoryAvailable = products.every(k => coupon.categorysId.includes(k.categoryId));
      const isProductIdAvailable = products.every(k => (coupon.productsId || []).includes(k.id));
     
      if(!(isCategoryAvailable || isProductIdAvailable)) {
        throw new HttpException('Invalid coupon', HttpStatus.BAD_REQUEST);
      } 

      // checking date 
      const now = Date.now();
      const fromDate = new Date(coupon.time.from).getTime();
      const toDate = new Date(coupon.time.to).getTime();
      if(now < fromDate)  throw new HttpException('Coupon not active. Please wait for active coupon', HttpStatus.BAD_REQUEST);
      if(now > toDate)  throw new HttpException('Coupon date expire', HttpStatus.BAD_REQUEST);
    }

    const formattedProduct = products.map(pr=> ({discount: pr.discount,quantity: pr.pis, sellPrice: pr.sellPrice }));
    const {finalPrice} = cardProductPriceCalculate({coupon, products: formattedProduct});


    // transition for product 
    const order = await this.model.create({...body, price: finalPrice ,  status :'On Delivery', couponId: coupon?.id || null});
    if(coupon) await this.couponModel.update({ quantity: coupon.quantity - 1 }, { where: { id: coupon.id} });
    await Promise.all(products.map(product => this.productModel.update({ quantity: product.quantity - product.pis }, { where:{id: product.id} }))) ;
    return order;
  }


  /**
   * @description This function is used to delete existing order
   * @param id order id
   * @param auth user information object
   * @returns order object
   */
  async deleteOrder(id: string, auth: AuthBody) {
    const { shopId, role, id: user } = auth;

    
    if (role === UserRole.OWNER) return await this.model.destroy({where:{id}});
    
    const order = await this.model.findOne({where:{ id} });
    console.log(order);

    if (order && roleAvailable([SUPER_ADMIN, ADMIN, MODERATOR], role) && order.shopId.toString() === shopId) {
      return await this.model.destroy({where:{id}});
    }
    if (role === USER && user === order.userId.toString()) return this.model.destroy({where:{id}});
    
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };


  /**
 * @description This function is used to get all existing order
 * @param auth user information object
 * @returns order array of object
 */
  @PaginatedQueryDecorator()
  async getAllOrder(auth: AuthBody,  query , option? ) {
    const { role, shopId } = auth;
    if (role === UserRole.OWNER) return await this.model.findAll({...option, include:[
      {model: User, attributes:['name','avatar']},
      {model: Coupon, attributes:['id','name','value', 'type']}
    ]});
    if (roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN], role)) return await this.model.findAll({ ...option, where:{shopId} , include:[
      {model: User, attributes:['name','avatar','email']},
      {model: Coupon, attributes:['id','name','value', 'type']}
    ] });
  };


/**
* @description This function is used to get order by order id
* @param id order id
* @returns order array of object
*/
  async getOrderById(id: string) {
    return await this.model.findOne({where: {id} });
  };


  /**
   * Fetches all orders for a specific user and includes product details for each order.
   *
   * @param auth - The user's authentication information.
   * @returns An array of formatted order objects, each containing the order details and product details.
   *
   * @throws Will throw an error if the user is not authenticated or if there is an issue fetching data.
   */
  async getOrdersByUserId (auth:AuthBody) {

     // Fetch all orders for the user
      const orders = await this.model.findAll({
        where: { userId: auth.id },
        attributes: ['orderId', 'status', 'price', 'products'],
      });

      // Extract productIds from the orders (flattening the array)
      const productIds = orders.flatMap(order =>  order.products.map(product => product.productId));

      // Fetch all product details in a single query using Op.in
      const products = await Product.findAll({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
      });

      // Create a mapping of productId to product details
      const productMap = products.reduce((map, product) => {
        map[product.id] = product;
        return map;
      }, {});


      // Format the orders with product details
      const formattedOrders = orders.map(order => {
        const productDetails = order.products.map(productItem => productMap[productItem.productId]);
        return {
          id: order.orderId,
          status: order.status,
          price: order.price,
          products: productDetails,
        };
      });

      return formattedOrders;
    }
  
  /**
   * Updates an existing order based on the provided ID and authentication information.
   *
   * @param id - The unique identifier of the order to update.
   * @param auth - The user's authentication information.
   * @param body - The updated order data.
   *
   * @returns The updated order object.
   *
   * @throws Will throw an error if the user is not authorized to update the order.
   *
   * @remarks
   * This function checks the user's role and shop ID to determine if they have permission to update the order.
   * If the user is an owner, they can update any order. If the user is an admin, moderator, or super admin,
   * they can only update orders belonging to their shop.
   */
  async updateOrder(id: string, auth: AuthBody, body: UpdateOrderDto) {
    const { shopId, id: userId, role } = auth;
    if (role === UserRole.OWNER) return await this.model.update(body, { where: {id} });

    const user = await this.userModel.findOne({where: {id:userId} });

    if (roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN], role) && user.shopId.toString() === shopId) {
      return await this.model.update(body,{where:{id}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  };



  /**
   * Retrieves the total count of orders for a specific shop.
   *
   * @param auth - The user's authentication information.
   *
   * @returns The total count of orders for the specified shop.
   *
   * @throws Will throw an error if the user is not authorized to view order count.
   *
   * @remarks
   * This function checks the user's role to determine if they have permission to view the order count.
   * If the user is an owner, they can view the order count for all shops. If the user is an admin, moderator,
   * or super admin, they can only view the order count for their shop.
   */
  getOrderCount (auth: AuthBody) {
    if(roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN, OWNER], auth.role)) {
      return this.model.count({where:{shopId: auth.shopId}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  getSellCount (auth: AuthBody) {
    if(roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN, OWNER], auth.role)) {
      return this.model.count({where:{shopId: auth.shopId, status:'Completed'}});
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }


  async getLastMonthSell (auth: AuthBody) {
    if(roleAvailable([ADMIN, MODERATOR, SUPER_ADMIN, OWNER], auth.role)) {
      // Get the current date
      const currentDate = new Date();

      // Calculate the start and end dates for the last month
      const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      const lastMonthTotalSell = await this.model.count({where:{shopId: auth.shopId, status:'Completed', createdAt:{
        [Op.between] :[startOfLastMonth, endOfLastMonth]
      }}});

      const lastFiveSales = await this.model.findAll({
        where: {
          shopId: auth.shopId,
          status: 'Completed',
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes:['price', 'id'],
        include: [{model: User, attributes:['name', 'id', 'email','avatar']}],
      });

      return {
        count:lastMonthTotalSell,
        sells: lastFiveSales
      };
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
