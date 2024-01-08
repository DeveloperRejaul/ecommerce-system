const userRouter = require('./user/user');
const catagoryRouter = require('./category/category');


// need add all routes add socket serveries  
const routes = [
	userRouter,
	catagoryRouter,
];

module.exports = routes;