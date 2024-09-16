import { api } from '@/core/rtk/api';

export const brandApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllBrand: builder.query({
            query: () => "/brand"
        })
    })
});

export const { useGetAllBrandQuery } = brandApi;