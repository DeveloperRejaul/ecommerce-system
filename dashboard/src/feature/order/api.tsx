import { api } from '@/core/rtk/api';
import { IApiPaginationResponse, IApiPayload } from '@/core/types';
import { IOrderRes } from './types';
import { toast } from '@/core/hooks/use-toast';

export const orderApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOrder: builder.query<IApiPaginationResponse<IOrderRes[]>, IApiPayload>({
      query: ({ page = 0, limit = 10 }) => `/order?page=${page}&limit=${limit}`,
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/order/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, page, limit }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            orderApi.util.updateQueryData('getOrder', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: any; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Order Delete Successfully',
          });
        } catch (err) {
          console.log(err);

          toast({
            title: 'Delete Failed!',
            description: 'Order Delete failed',
          });
        }
      },
    }),
    updateOrder: builder.mutation({
      query: ({ id, page, limit, ...body }) => ({
        url: `/order/${id}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted({ id, page, limit, ...body }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            orderApi.util.updateQueryData('getOrder', { page, limit }, (draft) => {
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
            description: 'Order update Successfully',
          });
        } catch (err) {
          console.log(err);

          toast({
            title: 'Update Failed!',
            description: 'Order update failed',
          });
        }
      },
    }),
  }),
});

export const {
  useGetOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = orderApi;
