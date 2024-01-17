import { Router } from 'express';
import { createCoupon, deleteCoupon, updateCoupon, getCoupon } from './coupon.fn';
import { auth } from '../../middleware/auth';

const router = Router();
export default (params) => {
  router.get('/coupon', auth, getCoupon(params));
  router.post('/coupon', auth, createCoupon(params));
  router.put('/coupon/:id', auth, updateCoupon(params));
  router.delete('/coupon/:id', auth, deleteCoupon(params));

  return router;
};
