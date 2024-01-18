import { Router } from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct, getSingleProduct } from './product.fn';
import { auth } from '../../middleware/auth';

const router = Router();

export default (params) => {
  router.get('/product', getProduct(params));
  router.post('/product', auth, createProduct(params));
  router.put('/product/:id', auth, updateProduct(params));
  router.delete('/product/:id', auth, deleteProduct(params));
  router.get('/product/:id', getSingleProduct(params));

  return router;
};
