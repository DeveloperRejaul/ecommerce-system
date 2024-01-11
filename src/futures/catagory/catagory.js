const { Router } = require('express');
const { createCatagory,deleteCatagory,getCatagory,updateCatagory } = require('./catagory.fn');
const { auth } = require('../../middleware/auth');
const router = Router();


module.exports = (params) =>{
	router.post('/catagory', auth, createCatagory(params));
	router.get('/catagory', auth, getCatagory(params));
	router.put('/catagory/:id', auth, updateCatagory(params));
	router.delete('/catagory/:id', auth, deleteCatagory(params));  
    
	return router;
};