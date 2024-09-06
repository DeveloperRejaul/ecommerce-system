/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/rtk/api';
import { login, logout } from './slice';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export const authApi = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // handle login request
        login: builder.mutation({
            query: (data) => {
                return {
                    method: 'POST',
                    url: '/user/login',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                };
            },
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(login());
                } catch (e: any) {
                    toast({
                        title: 'Login Failed!',
                        description: e.error.data.message,
                        action: <ToastAction altText="Goto schedule to undo"> Undo </ToastAction>
                    });
                    dispatch(logout());
                }
            },
        }),
    }),
});

export const {
    useLoginMutation
} = authApi;