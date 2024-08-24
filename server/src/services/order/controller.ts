import { Controller } from '@nestjs/common';
import { OrderService } from './service';


@Controller('api/v-1/order')
export class OrderController {
  constructor(private readonly service: OrderService) { }


  createOrder() {
    return this.service.createOrder();
  };


  getOrder() {
    return this.service.getOrder();
  };


  deleteOrder() {
    return this.service.deleteOrder();
  };


  getAllOrder() {
    return this.service.getAllOrder();
  };


  getSingleOrder() {
    return this.service.getSingleOrder();
  };


  updateOrder() {
    return this.service.createOrder();
  };


  confirmOrder() {
    return this.service.createOrder();
  };


}
