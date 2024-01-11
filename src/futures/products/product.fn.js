
const Joi = require('joi');
const { product:Product } = require('../../../prisma');
const fs = require('fs');
const path = require('path');
/**
 * @description this function for creating product
 * @returns 
 */

const createProductFelids = ['catagory','name' ,'title', 'images','price','discount','size' ,'description', 'user'];
const createSchema = Joi.object().keys({
	catagory: Joi.string().id().required(),
	user:Joi.string().id().required(),
	name: Joi.string().min(5).max(30).required(),
	title: Joi.string().min(5).max(100),
	images: Joi.array().items(Joi.object().keys({name:Joi.string().required(), uri:Joi.string().required()})).max(5).min(1).required(),
	price: Joi.number().required(),
	discount:Joi.number(),
	size: Joi.array().items(Joi.string().valid('ms','md', 'xl', 'xs', '2xl')).length(5).required(),
	description:Joi.string().min(50).max(1000),
});

module.exports.createProduct = (params)=> async (req, res) => {
	try {

		// check files exists 
		if(req.files.length <= 0) return  res.status(400).send('Invalid request. product image required'); 
        
		// convert json data js object data
		req.body  = JSON.parse(req.body.data || '{}');
		req.body.user = req.id;

		// formatted all images 
		req.body.images = req.files.map(image=> ({name:image.fieldname, uri: image.filename}));
    

		console.log(req.body);
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!createProductFelids.includes(k)) delete req.body[k]; });



		// check all filed data type
		const { error } = createSchema.validate(req.body);
		if (error) {
			// delete all products image
			req.body.images.map(img=> fs.unlink(path.join(path.resolve() ,'/src/uploads/', img.uri), (err)=> console.log(err)));
			return res.status(202).send('Invalid request');
		}

		if(req.role === 'ADMIN' || req.role === 'MODERATOR') {
            
			const product = await Product.create({data: req.body});
			return res.status(200).send(product);
		}

		// delete all products image 
		req.body.images.map(img=> fs.unlink(path.join(path.resolve() ,'/src/uploads/', img.uri), (err)=> console.log(err)));
		res.status(401).send('Unauthorized User' );

	} catch (err) {
		res.status(400).send('something wrong');
		console.log(err);
	}
};

/**
 * @description this function for get product
 * @returns 
 */

module.exports.getProduct = () => async (req, res) => {
	try {

	} catch (err) {
		res.status(400).send('something wrong');
		console.log(err);
	}
};

/**
 * @description this function for get single product
 * @returns 
 */
module.exports. getSingleProduct = () => async (req, res) => {
	try {

	} catch (err) {
		res.status(400).send('something wrong');
		console.log(err);
	}
};

/**
 * @description this function for update product
 * @returns 
 */

module.exports. updateProduct = () => async (req, res) => {
	try {

	} catch (err) {
		res.status(400).send('something wrong');
		console.log(err);
	}
};

/**
 * @description this function for delete product
 * @returns 
 */
module.exports. deleteProduct = () => async (req, res) => {
	try {

	} catch (err) {
		res.status(400).send('something wrong');
		console.log(err);
	}
};
