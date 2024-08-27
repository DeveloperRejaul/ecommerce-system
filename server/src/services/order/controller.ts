import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto';


@Controller('api/v-1/order')
export class OrderController {
  constructor(private readonly service: OrderService) { }


  @Post()
  @UseGuards(AuthGuard)
  createOrder(@Body() body: CreateOrderDto, @Request() req) {
    return this.service.createOrder(body, req);
  };


  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteOrder(@Param() param, @Request() req) {
    return this.service.deleteOrder(param.id, req);
  };

  @Get()
  @UseGuards(AuthGuard)
  getAllOrder(@Request() req) {
    return this.service.getAllOrder(req);
  };

  @Get('/shop/:shopId')
  @UseGuards(AuthGuard)
  getOrderByShopId(@Param() param) {
    return this.service.getOrderByShopId(param.shopId);
  };

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrderById(@Param() param) {
    return this.service.getOrderById(param.id);
  };

  @Put(':id')
  @UseGuards(AuthGuard)
  updateOrder(@Param() param, @Request() req, @Body() body: UpdateOrderDto) {
    return this.service.updateOrder(param.id, req, body);
  };
}
