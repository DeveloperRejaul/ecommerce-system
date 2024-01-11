const userRouter = require('./user/user');
const catagoryRouter = require('./catagory/catagory');
const productRouter = require('./products/product');


// need add all routes add socket serveries  
const routes = [
	userRouter,
	catagoryRouter,
	productRouter,
];

module.exports = routes;