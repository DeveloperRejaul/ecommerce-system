const { Router } = require('express');
const { createCategory, getCategory, updateCategory, deleteCategory } = require('./category.fn');
const { auth } = require('../../middleware/auth');
const router = Router();


module.exports = (params) =>{
	router.post('/category', auth, createCategory(params));
	router.get('/category', auth, getCategory(params));
	router.put('/category/:id', auth, updateCategory(params));
	router.delete('/category/:id', auth, deleteCategory(params));  
    
	return router;
};