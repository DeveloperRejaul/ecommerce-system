import { api } from '@/rtk/api';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export const couponApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getCoupon: builder.query({
            query: () => ({
                method: 'GET',
                url: '/coupon',
            }),
        }),
        createCoupon: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/coupon',
                    body: data
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Create Success!',
                        description: "Coupon Create Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch {
                    toast({
                        title: 'Create Failed!',
                        description: "Coupon Create failed",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        })
    }),
});

export const { useGetCouponQuery, useCreateCouponMutation } = couponApi;