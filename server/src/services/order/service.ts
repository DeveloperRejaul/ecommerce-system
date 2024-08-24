import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private model: Model<Order>
  ) { }

  async createOrder() { };
  async getOrder() { };
  async deleteOrder() { };
  async getAllOrder() { };
  async getSingleOrder() { };
  async updateOrder() { };
  async confirmOrder() { };
}
