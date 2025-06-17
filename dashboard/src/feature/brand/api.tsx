/* eslint-disable max-len */
import { api } from '@/core/rtk/api';
import { IApiPaginationResponse } from '@/core/types';
import { BrandTypes } from './types';
import { toast } from '@/core/hooks/use-toast';

export const brandApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBrand: builder.query<IApiPaginationResponse<BrandTypes[]>, {limit?: number, page:number}>({
      query: ({ page = 0, limit = 10 }) => `/brand?page=${page}&limit=${limit}`,
    }),

    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/brand/${id}`,
      }),
      async onQueryStarted({ page, limit, id }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            brandApi.util.updateQueryData('getAllBrand', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: any; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Brand Delete Successfully',
          });
        } catch (error) {
          console.log(error);
          toast({
            title: 'Delete failed',
            description: 'Brand Delete failed',
          });
        }
      },
    }),

    createBrand: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: '/brand',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Create Success!',
            description: 'Brand Create Successfully',
          });
        } catch (error) {
          console.log(error);
          toast({
            title: 'Create failed',
            description: 'Brand Create failed',
          });
        }
      },
    }),

    updateBrand: builder.mutation({
      query: ({ id, page, limit, ...body }) => ({
        method: 'PUT',
        url: `/brand/${id}`,
        body,
      }),
      async onQueryStarted({ id, page, limit, ...body }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            brandApi.util.updateQueryData('getAllBrand', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.map((d: { id: any; }) => {
                if (d.id === id) return { ...d, ...body };
                return d;
              });
              return data;
            }),
          );
          toast({
            title: 'Update Success!',
            description: 'Brand Update Successfully',
          });
        } catch (error) {
          console.log(error);

          toast({
            title: 'Update Failed!',
            description: 'Brand Update failed',
          });
        }
      },
    }),

  }),
});

export const {
  useGetAllBrandQuery,
  useDeleteBrandMutation,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
