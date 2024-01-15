
const {Router} = require('express');
const { createCoupon, deleteCoupon, updateCoupon, getCoupon } = require('./coupon.fn');
const { auth } = require('../../middleware/auth');
const router = Router();
module.exports = (params) => {

	router.get('/coupon', auth, getCoupon(params));
	router.post('/coupon',auth, createCoupon(params));
	router.put('/coupon/:id', auth, updateCoupon(params));
	router.delete('/coupon/:id',auth,deleteCoupon(params));

	return router; 
};