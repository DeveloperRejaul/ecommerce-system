import { api } from '@/core/rtk/api';
import { ISellData } from './types';

export const homeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategoryCount: builder.query({
      query: () => '/category/count',
    }),
    getProductCount: builder.query({
      query: () => '/product/count',
    }),
    getOrderCount: builder.query({
      query: () => '/order/count',
    }),
    getSellCount: builder.query({
      query: () => '/order/sell/count',
    }),
    getLastMonthSells: builder.query<ISellData, undefined>({
      query: () => 'order/sell/last-month',
    }),
    getShopCount: builder.query({
      query: () => '/shop/count',
    }),
  }),
});

export const {
  useGetCategoryCountQuery,
  useGetProductCountQuery,
  useGetOrderCountQuery,
  useGetSellCountQuery,
  useGetLastMonthSellsQuery,
  useGetShopCountQuery,
} = homeApi;
