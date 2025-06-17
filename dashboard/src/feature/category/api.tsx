/* eslint-disable max-len */
import { toast } from '@/core/hooks/use-toast';
import { api } from '@/core/rtk/api';
import { ICategoryType } from './types';
import { IApiPaginationResponse } from '@/core/types';

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCategory: builder.query<IApiPaginationResponse<ICategoryType[]>, {limit?: number, page:number}>({
      query: ({ page = 0, limit = 10 }) => ({
        method: 'GET',
        url: `/category?limit=${limit}&page=${page}`,
      }),
    }),

    getCategoryById: builder.query<ICategoryType[], string>({
      query: (id) => `/category/${id}`,
      transformResponse(res) {
        if (!Array.isArray(res)) {
          return [res];
        }
        return res;
      },
    }),
    createCategory: builder.mutation({
      query: ({ ...data }) => ({
        method: 'POST',
        url: '/category',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Create Success!',
            description: 'Category Create Successfully',
          });
        } catch {
          toast({
            title: 'Create Failed!',
            description: 'Category Create failed',
          });
        }
      },
    }),
    removeCategory: builder.mutation({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, page, limit }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData('getAllCategory', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: any; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Category Delete Successfully',
          });
        } catch {
          toast({
            title: 'Delete Failed!',
            description: 'Category Delete failed',
          });
        }
      },
    }),

    updateCategory: builder.mutation({
      query: ({ id, page, limit, ...body }) => ({
        url: `/category/${id}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted({ id, page, limit, ...body }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData('getAllCategory', { page, limit }, (draft) => {
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
            description: 'Category Update Successfully',
          });
        } catch {
          toast({
            title: 'Update Failed!',
            description: 'Category Update failed',
          });
        }
      },
    }),
  }),
});
export const {
  useGetAllCategoryQuery,
  useCreateCategoryMutation,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
} = authApi;
