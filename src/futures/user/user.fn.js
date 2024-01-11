const { user: User } = require('../../../prisma/index');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../../config/mailConfig');
const CryptoJS = require('crypto-js');
const { oauthSuccess } = require('../../templates/oauthSuccess');
const { decodeAuthToken } = require('../../utils/decodeAuthToken');

/**
 * @description this function using for create user
 * @param {*} req 
 * @param {*} res 
 * @returns create user object 
 */
const fields = ['email', 'password', 'name', 'location', 'role'];
const createUserSchema = Joi.object().keys({
	name: Joi.string().min(4).max(30).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(15).required(),
	address: Joi.object().keys({ street: Joi.string(), city: Joi.string(), state: Joi.string(), zip: Joi.string() }),
	role:Joi.string().uppercase().valid('USER', 'ADMIN', 'MODERATOR')
});
module.exports.createUser = () => async (req, res) => {

	try {
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!fields.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = createUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// check mail unique
		if (req.body.email) {
			req.body.email = req.body.email.toLowerCase();
			const existUser = await User.findUnique({ where: { email: req.body.email } });
			if (existUser) return res.status(400).send('Email already exists');
		}

		// bcrypt user password
		req.body.password = await bcrypt.hash(req.body.password, 10);

		// creating user 
		if ((req.body.role === 'USER') || (req.role === 'ADMIN' && ['USER', 'MODERATOR', 'ADMIN'].includes(req.body.role)) || (req.role === 'MODERATOR' && ['USER', 'MODERATOR'].includes(req.body.role))) {
			const	user = await User.create({ data: req.body });
			return	res.status(200).send(user);
		}
		res.status(401).send('Unauthenticated request');

	} catch (err) {
		console.log(err);
		if (err.code === 'P2002') return res.status(203).send('Email Already exists ');
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for get all users
 * @param {*} req 
 * @param {*} res 
 * @returns all user data array of object  
 */
module.exports.getUsers = ()=> async (req, res) => {
	try {
		const users = await User.findMany();
		res.status(200).send(users);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for get single user
 * @param {*} req 
 * @param {*} res 
 * @returns single user object  
 */
module.exports.getUser = ()=> async (req, res) => {
	try {
		const user = await User.findUnique({ where: { id: req.params.id } });
		res.status(200).send(user);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};



/**
 * @description this function using for update user
 * @param {*} req 
 * @param {*} res 
 * @returns updated user
 */
const updateUserSchema = Joi.object().keys({
	name: Joi.string().min(4).max(30),
	email: Joi.string().email(),
	password: Joi.string().min(6).max(15),
	address: Joi.object().keys({ street: Joi.string(), city: Joi.string(), state: Joi.string(), zip: Joi.string() })
});
module.exports.updateUser = ()=> async (req, res) => {
	try {
		// check all filed data type
		const { error } = updateUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		// password bcrypt
		if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

		//  updating user 
		const user = await User.update({ where: { id: req.params.id }, data: req.body });
		res.status(200).send(user);

	} catch (error) {
		console.log(err);
		if (err.code === 'P2002') return res.status(203).send('Email Already exists ');
		res.status(500).send('soothing wrong');
	}
};



/**
 * @description this function using for delete user
 * @param {*} req 
 * @param {*} res 
 * @returns deleted user
 */
module.exports.deleteUser = ()=> async (req, res) => {
	try {
		if(req.role === 'ADMIN' && req.rule === 'MODERATOR'){
			const user = await User.delete({ where: { id: req.params.id } });
			res.status(200).send(user);
		}else{
			res.status(200).send('Unauthenticated user' );
		}
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for forget password
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.forgotPassword = ()=> async (req, res) => {
	try {
		// check mail exists 
		const user = await User.findUnique({ where: { email: req.body.email } });
		if (!user) return res.status(401).send('Your mail invalid');

		// create token 
		const date = Date.now();
		const code = Math.floor(1000 + Math.random() * 9000);
		const token = CryptoJS.AES.encrypt(JSON.stringify({ code, date, email: user.email }), process.env.JWT_SECRET).toString();
		await sendMail({ to: req.body.email, subject: 'Forgot Password verification code', text: `${code}` });
		res.status(200).send({ token });
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for forget password verification code check 
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const maxTime = 20 * 60 * 1000;
const codeSchema = Joi.object().keys({
	code: Joi.number().min(4).required(),
	token: Joi.string().required(),
});
module.exports.codeVerification = ()=> async (req, res) => {
	try {
		// check valid data
		const { error } = codeSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		const bytes = CryptoJS.AES.decrypt(req.body.token, process.env.JWT_SECRET);
		const decode = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		const timeDiff = Date.now() - decode.date;

		//  check time limit 
		if (timeDiff > maxTime) return res.status(201).send('Maximum time limit expirer');

		//  check code valid
		if (decode.code !== req.body.code) return res.status(201).send('Code is not valid');

		res.status(200).send({ message: 'success', email: decode.email });
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for forget password
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const passwordSchema = Joi.object().keys({
	password: Joi.string().min(6).max(15).required(),
	token: Joi.string(),
});
module.exports.newPassword = ()=> async (req, res) => {
	try {
		// check valid data
		const { error } = passwordSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		const bytes = CryptoJS.AES.decrypt(req.body.token, process.env.JWT_SECRET);
		const decode = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

		const timeDiff = Date.now() - decode.date;

		//  check time limit 
		if (timeDiff > maxTime) return res.status(201).send('Maximum time limit expirer');

		//  password bcrypt
		req.body.password = await bcrypt.hash(req.body.password, 10);
		const user = await User.update({ where: { email: decode.email }, data: { password: req.body.password } });
		res.status(200).send(user);
	} catch (err) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};


/**
 * @description this function using for logout user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.logoutUser = ()=> async (req, res) => {
	try {
		console.log(req);
	} catch (error) {
		console.log(err);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for login user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const requiredField = ['email', 'password', 'isRemember'];

const loginUserSchema = Joi.object().keys({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(15).required(),
	isRemember: Joi.boolean().required()
});
module.exports.loginUser = () => async (req, res) => {
	try {
		
		// clean without  fields objects property
		Object.keys(req.body).forEach(k => { if (!requiredField.includes(k)) delete req.body[k]; });

		// check all filed data type
		const { error } = loginUserSchema.validate(req.body);
		if (error) return res.status(202).send('Invalid request');

		const user = await User.findUnique({ where: { email: req.body.email } });
		if (!user) return res.status(200).send('Password or Email invalid');


		// check password valid
		const isValid = await bcrypt.compare(req.body.password, user.password);
		if (!isValid) return res.status(200).send('Password or Email invalid');

		// creating web token  
		user.token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: req.body.isRemember ? '7d':'1d' });
		res.status(200).send(user);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}

};


/**
 * @description this function using for google auth successful
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.googleAuthSuccess = ()=> async (req, res) => {
	try {
		let user = await User.findUnique({ where: { email: req.user.email } });
		if (!user) user = await User.create({ data: { email: req.user.email, name: req.user.displayName, avatar: req.user.picture } });
		res.set('Content-Type', 'text/html');
		res.send(oauthSuccess);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for facebook auth successful
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.facebookAuthSuccess = ()=> async (req, res) => {
	try {
		res.set('Content-Type', 'text/html');
		res.send(oauthSuccess);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}
};

/**
 * @description this function using for github auth successful
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.githubAuthSuccess = ()=> async (req, res) => {
	try {
		res.set('Content-Type', 'text/html');
		res.send(oauthSuccess);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}
};




const schema  = Joi.object().keys({
	token:Joi.string().required()
});
module.exports.checkAuthUser = ()=> async (req, res )=> {
	try {
		const {error} =	schema.validate(req.body);
		if(error) return res.status(401).send('Invalid request');
		
		const token = req.body.token.split(' ')[1];
		const decode  = await decodeAuthToken(token);
		if(!decode) return res.status(401).send('Authorization failed');
		
		res.status(200).send(decode);
	} catch (error) {
		console.log(error);
		res.status(500).send('soothing wrong');
	}
};

