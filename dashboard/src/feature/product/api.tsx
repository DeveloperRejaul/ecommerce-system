import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/core/hooks/use-toast';
import { api } from '@/core/rtk/api';
import { IProductType } from './types';
import { IApiPaginationResponse } from '@/core/types';

export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProduct: builder.query<IApiPaginationResponse<IProductType[]>, {limit?: number, page:number}>({
      query: ({ limit = 10, page = 0 }) => `/product?limit=${limit}&page=${page}`,
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: '/product',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Create Success!',
            description: 'Product Create Successfully',
          });
        } catch (e:any) {
          toast({
            title: 'Create Failed!',
            description: e?.error?.data?.error || 'Something went wrong',
          });
        }
      },
    }),

    updateProduct: builder.mutation({
      query: ({ limit, id, page, ...data }) => ({
        method: 'PUT',
        url: `/product/${id}`,
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Update Success!',
            description: 'Product Update Successfully',
          });
        } catch (e:any) {
          toast({
            title: 'Update Failed!',
            description: e.error.data.error || 'Something went wrong',
          });
        }
      },
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/product/${id}`,
      }),
      async onQueryStarted({ id, limit, page }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            productApi.util.updateQueryData('getAllProduct', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: string; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Product Delete Successfully',
            action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>,
          });
        } catch (e:any) {
          toast({
            title: 'Delete Failed!',
            description: e.error.data.error,
            action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>,
          });
        }
      },
    }),

    getProductByIds: builder.query<IProductType[] | IProductType, string>({
      query: (ids) => `/product/${ids}`,
      transformResponse: (res:IProductType[] | IProductType) => {
        if (res && !Array.isArray(res)) {
          return [res];
        }
        return res;
      },
    }),
  }),
});

export const {
  useGetAllProductQuery,
  useLazyGetAllProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdsQuery,
} = productApi;
