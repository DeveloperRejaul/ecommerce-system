import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto';


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


  getOrder() {
    return this.service.getOrder();
  };



  getAllOrder() {
    return this.service.getAllOrder();
  };


  getSingleOrder() {
    return this.service.getSingleOrder();
  };


  updateOrder() {
    // return this.service.createOrder();
  };


  confirmOrder() {
    // return this.service.createOrder();
  };


}
