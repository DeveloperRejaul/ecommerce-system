/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from '@/core/hooks/use-toast';
import { api } from '@/core/rtk/api';
import { IUsersData } from './types';
import { IApiPaginationResponse } from '@/core/types';
import { clearEmptyObject } from '@/core/lib/utils';

export const usersApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query<IApiPaginationResponse<IUsersData[]>, {limit?: number, page:number}>({
      query: ({ page = 0, limit = 10 }) => `/user?page=${page}&limit=${limit}`,
    }),

    getUserById: builder.query<IUsersData, string>({
      query: (id) => `/user/${id}`,
    }),

    createUser: builder.mutation({
      query: (data) => ({
        method: 'POST',
        url: '/user/vip',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Create Success!',
            description: 'User Create Successfully',
          });
        } catch (e: any) {
          toast({
            title: 'Create Failed!',
            description: e?.error?.data?.message || 'User Create Failed',
          });
        }
      },
    }),

    // delete user
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/user/${id}`,
      }),
      async onQueryStarted({ id, page, limit }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            usersApi.util.updateQueryData('getAllUsers', { page, limit }, (draft) => {
              const data = JSON.parse(JSON.stringify(draft));
              data.data = data.data.filter((d: { id: any; }) => d.id !== id);
              return data;
            }),
          );
          toast({
            title: 'Delete Success!',
            description: 'User Delete Successfully',
          });
        } catch {
          toast({
            title: 'Delete Failed!',
            description: 'User Delete failed',
          });
        }
      },
    }),

    // update user
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        method: 'PUT',
        url: `/user/${id}`,
        body: clearEmptyObject(data),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast({
            title: 'Update Success!',
            description: 'User Update Successfully',
          });
        } catch (e: any) {
          toast({
            title: 'Update Failed!',
            description: e?.error?.data?.message || 'User Update Failed',
          });
        }
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} = usersApi;
