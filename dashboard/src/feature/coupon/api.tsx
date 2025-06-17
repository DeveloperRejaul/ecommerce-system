/* eslint-disable max-len */
import { api } from '@/core/rtk/api';
import { toast } from '@/core/hooks/use-toast';
import { IApiPaginationResponse } from '@/core/types';
import { ICouponTypes } from './types';

export const couponApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCoupon: builder.query<IApiPaginationResponse<ICouponTypes[]>, {limit?: number, page:number}>({
      query: ({ limit = 10, page = 0 }) => `/coupon?page=${page}&limit=${limit}`,
    }),

    getCouponById: builder.query({
      query: (id) => `/coupon/${id}`,
    }),

    createCoupon: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: '/coupon',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Create Success!',
            description: 'Coupon Create Successfully',
          });
        } catch {
          toast({
            title: 'Create Failed!',
            description: 'Coupon Create failed',
          });
        }
      },
    }),

    updateCoupon: builder.mutation({
      query: ({ limit, page, id, ...data }) => ({
        method: 'PUT',
        url: `/coupon/${id}`,
        body: data,
      }),
      async onQueryStarted({ id, limit, page, ...body }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            couponApi.util.updateQueryData('getCoupon', { page, limit }, (draft) => {
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
            description: 'Coupon update Successfully',
          });
        } catch {
          toast({
            title: 'Update Failed!',
            description: 'Coupon update failed',
          });
        }
      },
    }),

    // delete coupon
    deleteCoupon: builder.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/coupon/${id}`,
      }),
      async onQueryStarted({ id, page, limit }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            couponApi.util.updateQueryData('getCoupon', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: any; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'Coupon Delete Successfully',
          });
        } catch {
          toast({
            title: 'Delete Failed!',
            description: 'Coupon Delete failed',
          });
        }
      },
    }),
  }),
});

export const {
  useGetCouponQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} = couponApi;
