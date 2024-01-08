const Joi = require('joi');
const { category: Category } = require('../../../prisma/index');

/**
 * @description creating product category  
 * @param {} req 
 * @param {*} res 
 */
const fields = ['name', 'child', 'product', 'role'];

const createCategorySchema = Joi.object().keys({
	name: Joi.string().min(5).max(30).required(),
	child: Joi.array(),
	product: Joi.array()
});

module.exports.createCategory = ()=> async (req, res) => {
	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = createCategorySchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// check role 
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.create({ data: { ...req.body, userId: req.id } });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:14 ~ module.exports.createCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}

};


/**
 * @description get product category  
 * @param {} req 
 * @param {*} res 
 */
module.exports.getCategory = ()=> async (req, res) => {
	try {
		const category = await Category.findMany({ include: { user: { select: { email: true, name: true } } } });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:32 ~ module.exports.getCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}
};



/**
 * @description update product category  
 * @param {} req 
 * @param {*} res 
 */
const updateCategorySchema = Joi.object().keys({
	name: Joi.string().min(5).max(30),
	child: Joi.array(),
	product: Joi.array()
});

module.exports.updateCategory = ()=> async (req, res) => {
	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = updateCategorySchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		//check user role
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.update({ where: { id: req.params.id, }, data: req.body });
		res.status(200).send(category);
	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:51 ~ module.exports.updateCategory= ~ err:', err);
		res.status(404).send('Soothing wrong');
	}

};



/**
 * @description delete product category  
 * @param {} req 
 * @param {*} res 
 */
module.exports.deleteCategory = ()=> async (req, res) => {
	try {
		//check user role
		if (req.role === 'USER' || !req.role) return res.status(200).send('Valid user required');

		const category = await Category.delete({ where: { id: req.params.id } });
		res.status(200).send(category);

	} catch (err) {
		console.log('🚀 ~ file: category.fn.js:70 ~ module.exports.deleteCategory ~ err:', err);
		res.status(404).send('Soothing wrong');
	}
};



