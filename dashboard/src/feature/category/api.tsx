import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/core/hooks/use-toast";
import { api } from "@/core/rtk/api";

export const authApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: () => ({
                method: "GET",
                url: '/category',
            }),
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                method: "POST",
                url: '/category',
                body: data,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Create Success!',
                        description: "Category Create Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch {
                    toast({
                        title: 'Create Failed!',
                        description: "Category Create failed",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        })
    }),
});
export const {
    useGetAllCategoryQuery,
    useCreateCategoryMutation,
} = authApi;