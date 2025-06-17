import type { ICategoryTypes } from '@types';
import { SHOP_ID } from '../constants/constants';
import { api } from './api';

const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => `/category/shop/${SHOP_ID}`,
      transformResponse(res:ICategoryTypes[]) {
        return res.map((data) => ({ ...data, avatar: data.avatar, text: data.name }));
      },
    }),
  }),
});

export const {
  useGetCategoryQuery,
} = categoryApi;
