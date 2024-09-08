/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@/rtk/api';
import { login, logout } from './slice';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addUser } from '../users/userSlice';


interface IUserDataType {
    _id: string, email: string, name: string, address: string, avatar: string, role: string, shopId: string
}

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
            transformResponse(baseQueryReturnValue: IUserDataType) {
                const { _id, email, name, address, avatar, role, shopId } = baseQueryReturnValue;
                return { id: _id, email, name, address, avatar, role, shopId };
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
            transformResponse(baseQueryReturnValue: IUserDataType) {
                const { _id, email, name, address, avatar, role, shopId } = baseQueryReturnValue;
                return { id: _id, email, name, address, avatar, role, shopId };
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