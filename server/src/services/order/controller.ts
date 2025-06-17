import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto';


@Controller('api/v-1/order')
export class OrderController {
  constructor(private readonly service: OrderService) { }


  /**
   * Creates a new order.
   *
   * @param body - The data required to create a new order.
   * @returns The newly created order.
   */
  @Post()
  createOrder(@Body() body:CreateOrderDto) {
    return this.service.createOrder(body);
  };

  /**
   * Retrieves all orders from the database.
   *
   * This function retrieves all orders from the database and returns them as an array.
   * The function is guarded by the `AuthGuard` to ensure that only authenticated users can access it.
   *
   * @param req - The request object containing user information.
   * @returns An array of all orders in the database.
   */
  @Get()
  @UseGuards(AuthGuard)
  getAllOrder(@Request() req, @Query() params) {
    return this.service.getAllOrder(req, params);
  };

  /**
   * Retrieves the total count of orders in the database.
   *
   * This function retrieves the total count of orders from the database and returns it.
   * The function is guarded by the `AuthGuard` to ensure that only authenticated users can access it.
   *
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the total count of orders in the database.
   */
  @Get('count')
  @UseGuards(AuthGuard)
  getOrderCount(@Req() req) {
    return this.service.getOrderCount(req);
  }


  /**
   * Retrieves the total count of orders placed by the authenticated user.
   *
   * This function retrieves the total count of orders from the database that are placed by the currently authenticated user.
   * The function is guarded by the `AuthGuard` to ensure that only authenticated users can access it.
   *
   * @param req - The request object containing user information.
   * @returns A promise that resolves to the total count of orders placed by the authenticated user.
   */
  @Get('sell/count')
  @UseGuards(AuthGuard)
  getSellCount(@Req() req) {
    return this.service.getSellCount(req);
  }

  @Get('sell/last-month')
  @UseGuards(AuthGuard)
  getLastMonthSell(@Req() req) {
    return this.service.getLastMonthSell(req);
  }

  /**
   * Retrieves orders associated with the authenticated user.
   *
   * @remarks
   * This endpoint retrieves all orders that are associated with the currently authenticated user.
   *
   * @param req - The request object containing user information.
   * @returns An array of orders associated with the authenticated user.
   */
  @Get('/userId')
  @UseGuards(AuthGuard)
  getOrdersByUserId(@Request() req) {
    return this.service.getOrdersByUserId(req);
  };

  /**
   * Retrieves an order by its unique identifier.
   *
   * @param param - The parameters from the request URL.
   * @param param.id - The unique identifier of the order to retrieve.
   * @returns The order with the specified ID.
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  getOrderById(@Param() param) {
    return this.service.getOrderById(param.id);
  };

  /**
   * Updates an existing order.
   *
   * @param param - The parameters from the request URL.
   * @param param.id - The unique identifier of the order to update.
   * @param req - The request object containing user information.
   * @param body - The data required to update the order.
   * @returns The updated order.
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  updateOrder(@Param() param, @Request() req, @Body() body: UpdateOrderDto) {
    return this.service.updateOrder(param.id, req, body);
  };


    /**
   * Deletes an order by its unique identifier.
   *
   * This function deletes the order with the specified ID from the database.
   * It is guarded by the `AuthGuard` to ensure that only authenticated users can access it.
   *
   * @param param - The parameters from the request URL.
   * @param param.id - The unique identifier of the order to delete.
   * @param req - The request object containing user information.
   * @returns A promise that resolves to `void` when the order is successfully deleted.
   */
    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteOrder(@Param() param, @Request() req) {
      return this.service.deleteOrder(param.id, req);
    };



}
