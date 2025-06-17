/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceInDays, parseISO } from 'date-fns';
import { api } from '@/core/rtk/api';
import { login, logout } from './slice';
import { toast } from '@/core/hooks/use-toast';
import { addUser, IUserState } from '../users/userSlice';
import { alertDialog } from '@/components/Alert';

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // handle login request
    login: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: '/user/login/dashboard',
        body: data,
      }),
      transformResponse(baseQueryReturnValue: IUserState) {
        const { id, email, name, address, avatar, role, shopId, shop } = baseQueryReturnValue;
        return { id, email, name, address, avatar, role, shopId, shop };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.shop?.expireDate) {
            const day = differenceInDays(parseISO(data?.shop?.expireDate), new Date());
            if (day <= 5) {
              alertDialog.show({
                title: 'Shop Subscription Alert!',
                message: `Your shop subscription expires in ${day} day(s). Please make a payment to avoid any interruptions.`,
              }, (value) => {
                if (value === 'continue') {
                  dispatch(addUser(data));
                  dispatch(login());
                }
              });
            }
          } else {
            dispatch(addUser(data));
            dispatch(login());
          }
        } catch (e: any) {
          toast({
            title: 'Login Failed!',
            description: e?.error?.data?.message || 'User name or password incorrect',
          });
          dispatch(logout());
        }
      },
    }),

    checkValidUser: builder.query({
      query: () => '/user/check',
      transformResponse(baseQueryReturnValue: IUserState) {
        const { id, email, name, address, avatar, role, shopId, shop } = baseQueryReturnValue;
        return { id, email, name, address, avatar, role, shopId, shop };
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
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
        body: JSON.stringify({}),
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCheckValidUserQuery,
  useLogoutUserMutation,
} = authApi;
