import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private model: Model<Product>
  ) { }


  async creatingProduct() { };
  async deleteProduct() { };
  async getAllProduct() { };
  async getSingleProduct() { };
  async updateProduct() { }

}
