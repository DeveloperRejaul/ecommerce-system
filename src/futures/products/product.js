import { Router } from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct, getSingleProduct } from './product.fn';
import { upload } from '../../middleware/fileUp';
import { auth } from '../../middleware/auth';

const router = Router();

export default (params) => {
  router.get('/product', getProduct(params));
  router.post('/product', auth, upload.array('images', 5), createProduct(params));
  router.put('/product/:id', auth, upload.array('images', 5), updateProduct(params));
  router.delete('/product/:id', auth, deleteProduct(params));
  router.get('/product/:id', getSingleProduct(params));

  return router;
};
