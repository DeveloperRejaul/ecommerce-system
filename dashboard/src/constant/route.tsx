/* eslint-disable react/jsx-key */
import Home from '@/feature/home/home';
import Category from '@/feature/category/category';
import Order from '@/feature/order/order';
import User from '@/feature/users';
import Coupon from '@/feature/coupon/coupon';
import Product from '@/feature/product/product';
import Shop from '@/feature/shop/shop';
import Main from '@/router/main';
import Login from '@/feature/auth/login';
import Protected from '@/router/protected';

export const paths = {
    root: ['/', '/auth/login'],
    home: ['/', '/category', '/order', '/user', '/coupon', '/product', '/shop']
};

export const rootCom = [<Protected> <Main /> </Protected>, <Login />];
export const homeCom = [<Home />, <Category />, <Order />, <User />, <Coupon />, <Product />, <Shop />];