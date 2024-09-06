/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/rtk/api';
import { login, logout } from './slice';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addUser } from '../users/userSlice';

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
            transformResponse(baseQueryReturnValue) {
                const { _id, email, name, address, avatar, role } = baseQueryReturnValue;
                return { id: _id, email, name, address, avatar, role };
            },
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(addUser(data));
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

        checkValidUser: builder.query({
            query: () => '/user/check',
            transformResponse(baseQueryReturnValue) {
                const { _id, email, name, address, avatar, role } = baseQueryReturnValue;
                return { id: _id, email, name, address, avatar, role };
            },
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(addUser(data));
                    dispatch(login());
                } catch {
                    dispatch(logout());
                }
            },
        })
    }),
});

export const {
    useLoginMutation,
    useLazyCheckValidUserQuery
} = authApi;