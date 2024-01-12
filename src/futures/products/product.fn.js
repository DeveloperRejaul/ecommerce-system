
const Joi = require('joi');
const { product:Product } = require('../../../prisma');
const {userRole} = require('../../constants/constants');
const { deleteUploadFile } = require('../../utils/file');


const {ADMIN,MODERATOR,SUPER_ADMIN} = userRole;
const sportedUser = [ADMIN,MODERATOR,SUPER_ADMIN];
/**
 * @description this function for creating product
 * @returns 
 */

const createProductSchema = Joi.object().keys({
	name:Joi.string().min(5).max(30).required(),
	title:Joi.string().min(20).max(100),
	images:Joi.array().items(Joi.object().keys({name:Joi.string(), uri:Joi.string()})).min(1).max(5).required(),
	buyPrice:Joi.number().min(0).required(),
	sellPrice:Joi.number().min(0).greater(Joi.ref('buyPrice')).required(),
	discount:Joi.number().less(Joi.ref('sellPrice')),
	size:Joi.array().items(Joi.string().required().valid('sm', 'md', 'lg', 'xl', '2xl')).min(1).max(5).required(),
	description:Joi.string().min(50).max(1000).required(),
	quantity:Joi.number().min(0).required(),
	rating:Joi.object().keys({members:Joi.number().min(0).required(),ratings:Joi.number().min(0).required()  }),
	catagoryId: Joi.string().id().required(),
	couponId:Joi.string().id()

});

module.exports.createProduct = (params)=> async (req, res) => {
	try {
		req.body = JSON.parse(req.body.data || '{}');
		if(req.files) req.body.images = req.files.map(img=> ({name:img.fieldname, uri:img.filename}));
		
		// clean without  fields objects property
		const fields = Object.keys(createProductSchema.describe().keys);
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });
	

		// check all filed data type
		const { error } = createProductSchema.validate(req.body);
		console.log(req.body);
		console.log(error);
		if (error){
			if(req.files) req.files.forEach(img=>  deleteUploadFile(img.filename));
			return res.status(202).send(`Invalid request: ${error.details[0].message}`);
		}

		
		if(sportedUser.includes(req.role)){
			const product = await Product.create({data: req.body});
			return res.status(200).send(product);
		}
		if(req.files) req.files.forEach(img=>  deleteUploadFile(img.filename));
		res.status(401).send('Unauthenticated request');

	} catch (err) {
		if(req.files) req.files.forEach(img=>  deleteUploadFile(img.filename));
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
