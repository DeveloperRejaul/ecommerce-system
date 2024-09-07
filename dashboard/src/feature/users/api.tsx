
import { api } from '@/rtk/api';

export const usersApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => ({
                method: 'GET',
                url: '/user',
            }),
        }),
    }),
});

export const { useGetAllUsersQuery } = usersApi;