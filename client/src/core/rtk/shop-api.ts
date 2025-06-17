import type { IShop } from '@types';
import { ShopItemTypes } from '@types';
import { api } from '@/src/core/rtk/api';
import { SHOP_ID } from '@/src/core/constants/constants';

const shopApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShop: builder.query({
      query: () => `/shop/${SHOP_ID}`,
      transformResponse(res:IShop = {} as IShop) {
        res.banner = res?.banner.map((data, index) => ({ id: index.toString(), imgUrl: `${data}` })) || [];
        return res;
      },
    }),
    getBrand: builder.query({
      query: () => `/brand/shop/${SHOP_ID}`,
      transformResponse(res:ShopItemTypes[]) {
        return res.map((data) => ({ logo: `${data.avatar}`, name: data.name, id: data.id }));
      },
    }),
  }),
});

export const {
  useGetShopQuery,
  useGetBrandQuery,
} = shopApi;
