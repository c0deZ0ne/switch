import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import api from "./api"; // Import Axios instance
import { AxiosRequestConfig, AxiosError } from "axios";

// Custom Axios Base Query
const axiosBaseQuery =
  (): BaseQueryFn<
    { url: string; method: AxiosRequestConfig["method"]; data?: any; params?: any },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data || err.message } };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ name: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        data: credentials,
      }),
    }),
    registerUser: builder.mutation<{ name: string }, { username: string; email: string; password: string }>({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        data: newUser,
      }),
    }),
  }),
});

export const { useLoginUserMutation ,useRegisterUserMutation } = apiSlice;

export default apiSlice