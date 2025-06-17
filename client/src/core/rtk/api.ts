import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants/constants';
import { getAuthUser } from '../db-operations/auth';

export const api = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    timeout: 6000,
    credentials: 'include',
    prepareHeaders: async (headers) => {
      try {
        const user = await getAuthUser();
        if (user?.token) {
          headers.set('authorization', `Bearer ${user.token}`);
        }
        return headers;
      } catch (error) {
        console.log(error);
        return headers;
      }
    },
    headers: {
      'Content-Type': 'application/json',
    } }),
  endpoints: () => ({}),
});
