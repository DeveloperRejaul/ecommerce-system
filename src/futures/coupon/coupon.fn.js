const Joi = require('joi');
const { coupon:Coupon  } = require('../../../prisma');
const jwt = require('jsonwebtoken');



/**
 * @description this function for creating coupon  
 * @returns 
 */
const createCouponSchema = Joi.object().keys({
	type: Joi.string().valid('PRESENT', 'FIX').required(),
	time:Joi.string().required(),
	name: Joi.string().min(5).max(20).required(),
	amount: Joi.alternatives().when('type', {is:'PRESENT', then:Joi.number().required().min(0).max(100)}).when('type', {is:'PIX', then:Joi.number().required()})
});
module.exports.createCoupon = () => async (req, res) => {
	try {
		const {error} = createCouponSchema.validate(req.body);
		if(error) return res.status(401).send(`Invalid request: ${error.message}` );
		req.body.token  = jwt.sign(req.body , process.env.JWT_SECRET, { expiresIn: `${req.body.time}ms` });
        
		const coupon = await Coupon.create({data:req.body});
		res.status(200).send(coupon);
	} catch (err) {
		res.status(400).send('Something wrong');
		console.log(err);
	}
};