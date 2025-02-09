import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import api from "./api"; // Import Axios instance
import { AxiosRequestConfig, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSuccess, logout } from "./userSlice";

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
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ user: { name: string }; token: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/users",
        method: "GET",
        data: credentials,
        
      }),

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem("authToken", data.token);
          dispatch(loginSuccess({ user: data.user, accessToken: data.token }));
        } catch (error) {
          console.error("Login Error:", error);
        }
      },
    }),

    registerUser: builder.mutation<{ user: { name: string } }, { username: string; email: string; password: string }>({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        data: newUser,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      queryFn: async (_arg, { dispatch }) => {
        try {
          await api.post("/logout");
          await AsyncStorage.removeItem("authToken");
          dispatch(logout());

          return { data: undefined };
        } catch (error) {
          return { error: { message: "Logout failed" } };
        }
      },
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation } = apiSlice;
export default apiSlice;
