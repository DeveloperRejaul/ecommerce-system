import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/core/hooks/use-toast';
import { api } from '@/core/rtk/api';

export const productApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllProduct: builder.query({
            query: () => "/product"
        }),

        createProduct: builder.mutation({
            query: (data) => {
                return {
                    method: "POST",
                    url: '/product',
                    body: data
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Create Success!',
                        description: "Category Create Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch (e) {
                    toast({
                        title: 'Create Failed!',
                        // @ts-ignore
                        description: e.error.data.error,
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        }),

        updateProduct: builder.mutation({
            query: ({ data, id }) => {
                return {
                    method: "PUT",
                    url: `/product/${id}`,
                    body: data
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Update Success!',
                        description: "Category Update Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch (e) {
                    toast({
                        title: 'Update Failed!',
                        // @ts-ignore
                        description: e.error.data.error,
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        }),
    })
});

export const {
    useGetAllProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
} = productApi;