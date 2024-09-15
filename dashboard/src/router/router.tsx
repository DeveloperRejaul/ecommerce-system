import { createBrowserRouter } from 'react-router-dom';
import Home from '@/feature/home/home';
import Category from '@/feature/category/category';
import Order from '@/feature/order/order';
import User from '@/feature/users';
import Coupon from '@/feature/coupon/coupon';
import Product from '@/feature/product/product';
import Shop from '@/feature/shop/shop';
import Main from '@/router/main';
import Login from '@/feature/auth/login';
import CreateProduct from '@/feature/product/create-product';
import Ratting from '@/feature/ratting/ratting';
import Brand from '@/feature/brand/brand';
import Protected from '@/router/protected';
import ProductDetails from '@/feature/product/details';


export const path = {
  ROOT: "/",
  LOGIN: "/auth/login",
  CATEGORY: '/category',
  ORDER: '/order',
  USER: '/user',
  COUPON: '/coupon',
  PRODUCT: '/product',
  CREATE_PRODUCT: '/create-product',
  SHOP: '/shop',
  BRAND: "/brand",
  RATTING: "/ratting"
};

export const router = createBrowserRouter([
  {
    path: path.ROOT,
    element: <Protected>  <Main /> </Protected>,
    children: [
      {
        path: path.ROOT,
        element: <Home />
      },
      {
        path: path.CATEGORY,
        element: <Category />
      },
      {
        path: path.COUPON,
        element: <Coupon />
      },
      {
        path: path.SHOP,
        element: <Shop />
      },
      {
        path: path.USER,
        element: <User />
      },
      {
        path: path.PRODUCT,
        element: <Product />,
      },
      {
        path: `${path.PRODUCT}/:id`,
        element: <ProductDetails />
      },
      {
        path: path.CREATE_PRODUCT,
        element: <CreateProduct />
      },
      {
        path: path.ORDER,
        element: <Order />
      },
      {
        path: path.RATTING,
        element: <Ratting />
      },
      {
        path: path.BRAND,
        element: <Brand />
      }
    ]
  },
  {
    path: path.LOGIN,
    element: <Login />
  }
]);
