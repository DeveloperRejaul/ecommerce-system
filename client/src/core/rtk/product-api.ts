/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-param-reassign */
import { IProduct, APIProduct, IProductByCategoryIdParams } from '@types';
import { api } from './api';
import { SHOP_ID } from '../constants/constants';

export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    /**
     * @description handle get product data by category ids
     * Currently we are just one request to server when render fast time,
     * then we Cache the response;
     *
     * Than user request more data owe need to call  "getProductByCategoryIdPage: function .
     * Than we updating our this getProductByCategoryId request cash.
     */
    getProductByCategoryId: builder.query<APIProduct, {id:string}>({
      query: ({ id }) => `/product/category/${id}?limit=10&page=0&sortField=createdAt&sortOrder=ASC`,
    }),
    getProductByCategoryIdPage: builder.query<APIProduct, IProductByCategoryIdParams>({
      query: ({ id, limit = 10, page = 0, sortField = 'createdAt', sortOrder = 'ASC', ...params }) => {
        let url = `/product/category/${id}?limit=${limit}&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`;
        Object.keys(params).forEach((key) => {
          // @ts-ignore
          if (params[key]) {
            // @ts-ignore
            url += `&${key}=${params[key]}`;
          }
        });
        return url;
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          productApi.util.updateQueryData('getProductByCategoryId', { id: arg.id as string }, (draft) => {
            if (arg.page === 0) {
              draft.data = data.data;
              return;
            }
            draft.data.push(...data.data);
          }),
        );
      },
    }),

    /**
     * @description handle get product data by category ids
     * Currently we are just one request to server when render fast time,
     * then we Cache the response;
     *
     * Than user request more data owe need to call  "getProductByCategoryIdPage: function .
     * Than we updating our this getProductByCategoryId request cash.
     */
    getProducts: builder.query<APIProduct, number>({
      query: (limit = 10) => `/product/shop/${SHOP_ID}?limit=${limit}`,
    }),

    /**
     * @description handle get product data by category ids
     * Currently we are just one request to server when render fast time,
     * then we Cache the response;
     *
     * Than user request more data owe need to call  "getProductByCategoryIdPage: function .
     * Than we updating our this getProductByCategoryId request cash.
     */
    getProductById: builder.query({
      query: ({ id }) => `/product/${id}`,
      transformResponse(res: IProduct) {
        if (Array.isArray(res)) {
          return res;
        }
        return { ...res };
      },
    }),
  }),
});

export const {
  useGetProductByCategoryIdQuery,
  useLazyGetProductByCategoryIdPageQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
} = productApi;
