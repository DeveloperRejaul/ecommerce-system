import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Main from '@/core/router/main';
import Protected from '@/core/router/protected';
import { Loading } from '@/components/loading';

const Home = lazy(() => import('@/feature/home'));
const Category = lazy(() => import('@/feature/category'));
const Order = lazy(() => import('@/feature/order/order'));
const User = lazy(() => import('@/feature/users'));
const Coupon = lazy(() => import('@/feature/coupon/coupon'));
const Product = lazy(() => import('@/feature/product/productIndex'));
const Shop = lazy(() => import('@/feature/shop/shopIndex'));
const Login = lazy(() => import('@/feature/auth/login'));
const CreateProduct = lazy(() => import('@/feature/product/create-product'));
const Ratting = lazy(() => import('@/feature/ratting/ratting'));
const Brand = lazy(() => import('@/feature/brand/brand'));
const CreateCategory = lazy(() => import('@/feature/category/screens/create-category'));
const UpdateOrder = lazy(() => import('@/feature/order/order-details'));
const CreateBrand = lazy(() => import('@/feature/brand/create-brand'));
const CreateUser = lazy(() => import('@/feature/users/screens/create-user'));
const CreateCoupon = lazy(() => import('@/feature/coupon/create-coupon'));
const AboutMe = lazy(() => import('@/feature/about-me/about-me'));
const CreateShop = lazy(() => import('@/feature/shop/create-shop'));
const NotFound = lazy(() => import('@/components/NotFound'));
const ErrorBoundary = lazy(() => import('@/components/ErrorBoundary'));

export const path = {
  ROOT: '/dashboard/',
  LOGIN: '/dashboard/auth/login',
  CATEGORY: '/dashboard/category',
  CREATE_CATEGORY: '/dashboard/category/create',
  ORDER: '/dashboard/order',
  UPDATE_ORDER: '/dashboard/order/update',
  USER: '/dashboard/user',
  CREATE_USER: '/dashboard/user/create',
  COUPON: '/dashboard/coupon',
  CREATE_COUPON: '/dashboard/coupon/create',
  PRODUCT: '/dashboard/product',
  CREATE_PRODUCT: '/dashboard/product/create',
  SHOP: '/dashboard/shop',
  CREATE_SHOP: '/dashboard/shop/create',
  BRAND: '/dashboard/brand',
  CREATE_BRAND: '/dashboard/brand/create',
  RATTING: '/dashboard/ratting',
  ABOUT: '/dashboard/about',
};

export const router = createBrowserRouter(
  [
    {
      path: path.ROOT,
      element: (
        <ErrorBoundary>
          <Protected>
            <Main />
          </Protected>
        </ErrorBoundary>
      ),
      children: [
        {
          path: path.ROOT,
          element: (
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: path.CATEGORY,
          element: (
            <Suspense fallback={<Loading />}>
              <Category />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_CATEGORY,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateCategory />
            </Suspense>
          ),
        },
        {
          path: path.COUPON,
          element: (
            <Suspense fallback={<Loading />}>
              <Coupon />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_COUPON,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateCoupon />
            </Suspense>
          ),
        },
        {
          path: path.SHOP,
          element: (
            <Suspense fallback={<Loading />}>
              <Shop />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_SHOP,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateShop />
            </Suspense>
          ),
        },
        {
          path: path.USER,
          element: (
            <Suspense fallback={<Loading />}>
              <User />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_USER,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateUser />
            </Suspense>
          ),
        },
        {
          path: path.PRODUCT,
          element: (
            <Suspense fallback={<Loading />}>
              <Product />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_PRODUCT,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateProduct />
            </Suspense>
          ),
        },
        {
          path: path.ORDER,
          element: (
            <Suspense fallback={<Loading />}>
              <Order />
            </Suspense>
          ),
        },
        {
          path: path.UPDATE_ORDER,
          element: (
            <Suspense fallback={<Loading />}>
              <UpdateOrder />
            </Suspense>
          ),
        },
        {
          path: path.RATTING,
          element: (
            <Suspense fallback={<Loading />}>
              <Ratting />
            </Suspense>
          ),
        },
        {
          path: path.BRAND,
          element: (
            <Suspense fallback={<Loading />}>
              <Brand />
            </Suspense>
          ),
        },
        {
          path: path.CREATE_BRAND,
          element: (
            <Suspense fallback={<Loading />}>
              <CreateBrand />
            </Suspense>
          ),
        },
        {
          path: path.ABOUT,
          element: (
            <Suspense fallback={<Loading />}>
              <AboutMe />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: path.LOGIN,
      element: (
        <Suspense fallback={<Loading />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<Loading />}>
          <NotFound />
        </Suspense>
      ),
    },

  ],
  {
    future: {
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
      v7_relativeSplatPath: true,
    },
  },
);
