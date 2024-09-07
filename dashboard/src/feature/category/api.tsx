import { api } from "@/rtk/api";

export const authApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: () => ({
                method: "GET",
                url: '/category',
            }),
        })
    }),
});
export const {
    useGetAllCategoryQuery
} = authApi;