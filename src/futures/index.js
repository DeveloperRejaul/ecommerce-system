import userRouter from './user/user';
import catagoryRouter from './catagory/catagory';
import productRouter from './products/product';
import couponRouter from './coupon/coupon';
import ratingRouter from './rating/rating';
import file from './file/file';

// need add all routes add socket serveries
export default [
  file,
  userRouter,
  catagoryRouter,
  productRouter,
  couponRouter,
  ratingRouter,
];
