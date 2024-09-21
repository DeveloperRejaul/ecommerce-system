import { api } from "@/core/rtk/api";

export const orderApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getOrder: builder.query({
            query: () => `/order`
        }),
    })
});


export const { useGetOrderQuery } = orderApi;