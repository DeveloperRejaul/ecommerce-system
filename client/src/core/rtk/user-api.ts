import { router } from 'expo-router';
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { animatedAlert } from '../components/AnimatedAlert';
import { animatedToast } from '../components/AnimatedToast';
import { api } from './api';
import type { ApiUserTypes, ICoupon, IOrder, IWishlistResponse } from '@/types';
import { createAuthUser, IAuthData } from '../db-operations/auth';
import { SHOP_ID, UserRole } from '../constants/constants';
import { color } from '../constants/color';
import { removeCard } from '../db-operations/card';

const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<ApiUserTypes, string>({
      query: (body) => ({
        url: '/user/login/client',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            await createAuthUser({
              avatar: data.avatar ?? '',
              email: data.email,
              name: data.name,
              token: data.token,
              userId: data.id,
              address: data.address,
              phone: data.phone ?? '',
            });
            animatedToast.show({ title: 'Login action', message: 'You login successfully ', bgColor: color.success });
          }
        } catch (error) {
          console.log(error);
          // @ts-ignore
          animatedAlert.show({ message: error?.error?.data?.message || 'Something went wrong' });
        }
      },
    }),

    singUp: builder.mutation({
      query: (data) => ({
        url: '/user/signup',
        method: 'POST',
        body: JSON.stringify({ ...data, role: UserRole.USER, shopId: SHOP_ID, address: ' ' }),
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          animatedToast.show({ title: 'User Saved', message: 'You account created successfully', bgColor: color.success });
          router.back();
          console.log(data);
        } catch (error) {
          console.log(error);
          animatedToast.show({ title: 'Registered Failed', message: error?.error?.data?.error, bgColor: color.error });
        }
      },
    }),

    getWishlist: builder.query<IWishlistResponse, null>({
      query: () => '/wishlist?limit=10&page=0',
    }),

    getWishListPage: builder.query<IWishlistResponse, {limit:number, page:number}>({
      query: ({ limit = 10, page = 0 }) => `/wishlist?limit=${limit}&page=${page}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData('getWishlist', null, (draft) => {
              if (arg.page === 0) {
                // draft.data = data.data;
                return;
              }
              draft.data.push(...data.data);
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    createWishlist: builder.mutation({
      query: ({ product, ...arg }) => ({
        url: '/wishlist',
        method: 'POST',
        body: arg,
      }),
      async onQueryStarted({ product }, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData('getWishlist', null, (draft) => {
              draft.data.push({ ...data, product });
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getWishlistByProductId: builder.query({
      query: ({ id }) => `/wishlist/product/${id}`,
    }),
    removeWishlist: builder.mutation<IWishlistResponse, {id: string}>({
      query: ({ id }) => ({ url: `/wishlist/${id}`, method: 'DELETE' }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(
            userApi.util.updateQueryData('getWishlist', null, (draft) => {
              if (arg.id) {
                draft.data = draft.data.filter((fld) => fld.id !== arg.id);
              }
            }),
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateUser: builder.mutation<unknown, Partial<IAuthData>>({
      query: ({ userId, ...data }) => ({
        method: 'PUT',
        url: `/user/${userId}`,
        body: JSON.stringify(data),
      }),

      async onQueryStarted(arg:IAuthData, { queryFulfilled }) {
        try {
          await queryFulfilled;
          await createAuthUser(arg);
          animatedToast.show({ title: 'User update action', message: 'You update information successfully ' });
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getCoupons: builder.query<ICoupon[], null>({
      query: () => '/coupon',
    }),

    applyCoupon: builder.mutation<ICoupon, {name:string, categoryId:string, productId:string}>({
      query: (data) => ({
        method: 'POST',
        url: '/coupon/apply',
        body: JSON.stringify(data),
      }),
      async onQueryStarted(arg, api) {
        try {
          await api.queryFulfilled;
          animatedToast.show({ title: 'Coupon applied success', message: 'You have successfully applied coupon', bgColor: color.success });
        } catch (error) {
          animatedToast.show({ title: 'Invalid coupon', message: error?.error?.data?.message || 'Something went wrong', bgColor: color.error });
        }
      },
    }),

    verifyEmail: builder.mutation<{token:string}, {email:string, isResend:boolean}>({
      query: ({ email }) => ({
        url: '/user/check-email',
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
      async onQueryStarted(arg, api) {
        try {
          const { data } = await api.queryFulfilled;
          animatedToast.show({ title: arg.isResend ? 'Otp resend success' : 'Email Validation success', message: 'You get a mail please type otp in here', bgColor: color.success });
          if (!arg.isResend) router.navigate({ pathname: '/auth/otp', params: { token: data.token, email: arg.email } });
        } catch (error) {
          console.log(error);
          animatedToast.show({ title: arg.isResend ? 'Otp resend felid' : 'Email Validation Felid', message: error?.error?.data?.message || 'Something went wrong', bgColor: color.error });
        }
      },
    }),

    verifyOtp: builder.mutation<{token: string}, {token: string, otp:string}>({
      query: (data) => ({
        url: '/user/check-otp',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      async onQueryStarted(arg, api) {
        try {
          const { data } = await api.queryFulfilled;
          animatedToast.show({ title: 'Otp Validation success', message: 'Validation successful please make new password', bgColor: color.success });
          router.navigate({ pathname: '/auth/password', params: { token: data.token } });
        } catch (error) {
          console.log(error);
          animatedToast.show({ title: 'Otp Validation Felid', message: error?.error?.data?.message || 'Something went wrong', bgColor: color.error });
        }
      },
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/user/reset-password',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      async onQueryStarted(arg, api) {
        try {
          await api.queryFulfilled;
          animatedToast.show({ title: 'Reset Validation success', message: 'Reset password successful please login', bgColor: color.success });
          router.replace('/auth');
        } catch (error) {
          console.log(error);
          animatedToast.show({ title: 'Reset password felid', message: error?.error?.data?.message || 'Something went wrong', bgColor: color.error });
        }
      },
    }),

    createOrder: builder.mutation< unknown, {address:string, products:{productId:string, quantity:number}[], shopId:string, userId: string}>({
      query: (data) => ({
        url: '/order',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      async onQueryStarted(arg, api) {
        try {
          await api.queryFulfilled;
          await Promise.allSettled(arg.products.map((item) => removeCard(item.productId)));
          animatedToast.show({ title: 'Order created', message: 'Order create successful', bgColor: color.success });
          router.replace('/profile/orders');
        } catch (error) {
          console.log(error);
          animatedToast.show({ title: 'Reset password felid', message: error?.error?.data?.message || 'Something went wrong', bgColor: color.error });
        }
      },
    }),

    getOrders: builder.query<IOrder[], undefined>({
      query: () => '/order/userId',
    }),
  }),
});

export const {
  useLoginMutation,
  useSingUpMutation,
  useGetWishlistQuery,
  useLazyGetWishListPageQuery,
  useUpdateUserMutation,
  useGetCouponsQuery,
  useVerifyEmailMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useApplyCouponMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useCreateWishlistMutation,
  useLazyGetWishlistByProductIdQuery,
  useRemoveWishlistMutation,
} = userApi;
