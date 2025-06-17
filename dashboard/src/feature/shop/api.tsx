import { z } from 'zod';
import { api } from '@/core/rtk/api';
import { toast } from '@/core/hooks/use-toast';
import { IShopTypes } from './types';
import schema from './schema';
import { createDemoBrand, createDemoCategory, createDemoProduct } from '@/core/lib/shop';
import { urlConvert } from '@/core/lib/file';

export const shopApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShop: builder.query({
      query: ({ page = 0, limit = 10 }) => `/shop?page=${page}&limit=${limit}`,
    }),

    getShopById: builder.query<IShopTypes, {id:string}>({
      query: ({ id }) => ({
        method: 'GET',
        url: `/shop/${id}`,
      }),
      transformResponse(baseQueryReturnValue:IShopTypes) {
        baseQueryReturnValue.banner = baseQueryReturnValue.banner.map((url) => urlConvert(url));
        return baseQueryReturnValue;
      },
    }),

    createShop: builder.mutation<IShopTypes, z.infer<typeof schema > & {avatar?: string, banner: string[]}>({
      query: (data) => ({
        method: 'POST',
        url: '/shop',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const category = await createDemoCategory(data.id);
          const brand = await createDemoBrand(data.id);
          const trendyCategory = category.find((c) => c.name === 'Trendy');
          const popularCategory = category.find((c) => c.name === 'Popular');
          await createDemoProduct({ shopId: data.id, brandId: brand[0].id, categoryId: trendyCategory.id });
          await createDemoProduct({ shopId: data.id, brandId: brand[0].id, categoryId: popularCategory.id });
          toast({
            title: 'Create Success!',
            description: 'Shop Create Successfully',
          });
        } catch {
          toast({
            title: 'Create Failed!',
            description: 'Shop Create failed',
          });
        }
      },
    }),

    updateShop: builder.mutation({
      query: ({ id, page, limit, ...data }) => ({
        method: 'PUT',
        url: `/shop/${id}`,
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Update Success!',
            description: 'Shop Update Successfully',
          });
        } catch {
          toast({
            title: 'Update Failed!',
            description: 'Shop Update failed',
          });
        }
      },
    }),

    deleteShop: builder.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/shop/${id}`,
      }),
      async onQueryStarted({ id, page, limit }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            shopApi.util.updateQueryData('getShop', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: string; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Shop Delete Successfully',
          });
        } catch {
          toast({
            title: 'Delete Failed!',
            description: 'Shop Delete failed',
          });
        }
      },
    }),
  }),
});

export const {
  useLazyGetShopQuery,
  useCreateShopMutation,
  useGetShopQuery,
  useGetShopByIdQuery,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopApi;
