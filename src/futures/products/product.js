const { Router } = require('express');
const { createProduct } = require('./product.fn');
const { upload } = require('../../middleware/fileUp');
const { auth } = require('../../middleware/auth');
const router = Router();

module.exports =   (params) =>  {
	router.get('/product',()=>{});
	router.post('/product', auth, upload.array('images', 5), createProduct(params));
	router.put('/product/:id',()=>{});
	router.delete('/product/:id',()=>{});
	router.get('/product/:id',()=>{});

	return router;
};
