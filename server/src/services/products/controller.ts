import { Controller } from '@nestjs/common';
import { ProductService } from './service';


@Controller('api/v-1/product')
export class ProductController {
  constructor(private readonly service: ProductService) { }


  creatingProduct() {
    return this.service.creatingProduct();
  };


  deleteProduct() {
    return this.service.deleteProduct();
  };


  getAllProduct() {
    return this.service.getAllProduct();
  };


  updateProduct() {
    return this.service.updateProduct();
  }

  getSingleProduct() {
    return this.service.getSingleProduct();
  };
}
