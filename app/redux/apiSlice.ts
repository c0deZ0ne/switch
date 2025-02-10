// import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
// import api from "./api"; // Import Axios instance
// import { AxiosRequestConfig, AxiosError } from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { loginSuccess, logout } from "./userSlice";
//  import Config from 'react-native-config';
// import { User } from "../../types";
// import { router } from "expo-router";
// import Toast from "react-native-toast-message";

// // Custom Axios Base Query
// const axiosBaseQuery =
//   (): BaseQueryFn<
//     { url: string; method: AxiosRequestConfig["method"]; data?: any; params?: any },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params }) => {
//     try {
//       const result = await api({ url, method, data, params });
//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: axiosBaseQuery(),
//   endpoints: (builder) => ({
//     loginUser: builder.mutation<User[], { username: string; password: string }>({
//       query: (credentials) => ({
//         url: "/users",
//         method: "GET",
//         data: credentials,
        
//       }),

//       async onQueryStarted(args, { queryFulfilled, dispatch }) {
//         try {
//           const { data } = await queryFulfilled;
//           const currentUser = data.find((user) => user.email === args.username && user.password === args.password);
//           if (currentUser) {
//             dispatch(loginSuccess( {...currentUser,isAuthenticated:true} ));
//             router.push("(tabs)/profile")
//             Toast.show({
//               type: "success",
//               text1: `Welcome back ${currentUser.name}`
//             });
//           } else {
//             Toast.show({
//               type: "error",
//               text1: "Username or password is invalid"
//             });
//           }
//         } catch (error) {
//           console.error("Login Error:", error);
//         }
//       },
//     }),

  
  
//     logoutUser: builder.mutation<void, void>({
//       queryFn: async (_arg, { dispatch }) => {
//         try {
//           await api.post("/logout");
//           await AsyncStorage.removeItem("authToken");
//           dispatch(logout());

//           return { data: undefined };
//         } catch (error) {
//           return { error: { message: "Logout failed" } };
//         }
//       },
//     }),
//   }),
// });

// export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation } = apiSlice;
// export default apiSlice;
import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import api from "./api"; // Import Axios instance
import { AxiosRequestConfig, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSuccess, logout, registerSuccess } from "./userSlice";
import { User } from "../../types";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

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
    // 🔹 Login User (Checks JSON Server for Existing User)
    loginUser: builder.mutation<User[], { username: string; password: string }>({
      query: (credentials) => ({
        url: "/users",
        method: "GET",
        data: credentials,
      }),

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const currentUser = data.find(
            (user) => user.email === args.username && user.password === args.password
          );
          if (currentUser) {
            dispatch(loginSuccess({ ...currentUser, isAuthenticated: true }));
            router.push("(tabs)/profile");
            Toast.show({
              type: "success",
              text1: `Welcome back ${currentUser.name}`,
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Username or password is invalid",
            });
          }
        } catch (error) {
          console.error("Login Error:", error);
        }
      },
    }),

    // 🔹 Register User (Creates a New User in JSON Server)
    registerUser: builder.mutation<
      { id: string; name: string; email: string },
      { name: string; email: string; password: string }
    >({
      async queryFn(newUser, _queryApi, _extraOptions, fetchWithBQ) {
        // ✅ Check if email already exists
        const existingUser = await fetchWithBQ(`/users?email=${newUser.email}`);
        if (existingUser.data.length > 0) {
          return { error: { status: 400, data: "Email already exists" } };
        }

        // ✅ Register new user
        const result = await fetchWithBQ({
          url: "/users",
          method: "POST",
          body: { ...newUser, createdAt: new Date().toISOString() },
        });

        return result;
      },

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(registerSuccess({ ...data, isAuthenticated: true }));

          router.replace("/(tabs)/profile"); // ✅ Navigate to profile after signup
          Toast.show({
            type: "success",
            text1: "Registration Successful",
            text2: `Welcome, ${data.name}! 🎉`,
          });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Registration Failed",
            text2: "Email already in use",
          });
        }
      },
    }),

    // 🔹 Logout User (Clears Local Storage & Redux)
    logoutUser: builder.mutation<void, void>({
      queryFn: async (_arg, { dispatch }) => {
        try {
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
