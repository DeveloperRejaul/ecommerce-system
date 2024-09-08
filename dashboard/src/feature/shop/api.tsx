import { api } from '@/rtk/api';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export const shopApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getShop: builder.query({
            query: () => ({
                method: 'GET',
                url: '/shop',
            }),
        }),
        createShop: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: '/shop',
                body: data
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Create Success!',
                        description: "Shop Create Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch {
                    toast({
                        title: 'Create Failed!',
                        description: "Shop Create failed",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        })
    }),
});

export const { useLazyGetShopQuery, useCreateShopMutation, useGetShopQuery } = shopApi;