const { Router } = require('express');
const { createProduct, getProduct, updateProduct, deleteProduct, getSingleProduct } = require('./product.fn');
const { upload } = require('../../middleware/fileUp');
const { auth } = require('../../middleware/auth');
const router = Router();

module.exports =   (params) =>  {
	router.get('/product',getProduct(params));
	router.post('/product', auth, upload.array('images', 5), createProduct(params));
	router.put('/product/:id',auth , updateProduct(params));
	router.delete('/product/:id',auth, deleteProduct(params));
	router.get('/product/:id',getSingleProduct(params));

	return router;
};
