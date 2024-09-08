/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/hooks/use-toast';
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
        createUser: builder.mutation({
            query: (data) => ({
                method: 'POST',
                url: '/user/vip',
                body: data
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    toast({
                        title: 'Create Success!',
                        description: "User Create Successfully",
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                } catch (e: any) {
                    toast({
                        title: 'Create Failed!',
                        description: e.error.data.message,
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                }
            },
        }),
    }),
});

export const { useGetAllUsersQuery, useCreateUserMutation } = usersApi;