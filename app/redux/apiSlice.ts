// import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
// import api from "./api"; // Import Axios instance
// import { AxiosRequestConfig, AxiosError } from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { loginSuccess, logout, registerSuccess } from "./userSlice";
// import { User } from "../types";
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
//     // 🔹 Login User (Checks JSON Server for Existing User)
//     loginUser: builder.mutation<User[], { username: string; password: string }>({
//       query: (credentials) => ({
//         url: "/users",
//         method: "GET",
//         data: credentials,
//       }),

//       async onQueryStarted(args, { queryFulfilled, dispatch }) {
//         try {
//           const { data } = await queryFulfilled;
//           const currentUser = data.find(
//             (user) => user.email === args.username && user.password === args.password
//           );
//           if (currentUser) {
//             dispatch(loginSuccess({ ...currentUser, isAuthenticated: true }));
//             router.push("(tabs)/profile");
//             Toast.show({
//               type: "success",
//               text1: `Welcome back ${currentUser.name}`,
//             });
//           } else {
//             Toast.show({
//               type: "error",
//               text1: "Username or password is invalid",
//             });
//           }
//         } catch (error) {
//           console.error("Login Error:", error);
//         }
//       },
//     }),

//     // 🔹 Register User (Creates a New User in JSON Server)
//     registerUser: builder.mutation<{ id: string; name: string; email: string },
//       { name: string; email: string; password: string }>({
//       async queryFn(newUser, _queryApi, _extraOptions, fetchWithBQ) {
//         // ✅ Check if email already exists
//         const existingUser = await fetchWithBQ({
//           url: `/users?email=${newUser.email}`,
//           method: 'GET'
//         });
//         if ((existingUser.data as any[]).length > 0) {
//           return { error: { status: 400, data: "Email already exists" } };
//         }

//         // ✅ Register new user
//         const result = await fetchWithBQ({
//           url: "/users",
//           method: "POST",
//           data: { ...newUser, createdAt: new Date().toISOString() },
//         });

//         return { data: result.data as { id: string; name: string; email: string; } };
//       },

//       async onQueryStarted(args, { queryFulfilled, dispatch }) {
//         try {
//           const { data } = await queryFulfilled;
//           dispatch(registerSuccess({
//             ...data, isAuthenticated: true,
//             phone: "",
//             email:args.email,
//             password: args.password,
//             biometricEnabled: false,
//             createdAt: new Date().toISOString(),
//             lastEvent: "Register",
//             lastEventTime: new Date().toISOString(),
//             lastEventMessage: "Welcome to the switch",
//             bankAccounts:[],
//           }));

//           router.replace("/(tabs)/profile"); // ✅ Navigate to profile after signup
//           Toast.show({
//             type: "success",
//             text1: "Registration Successful",
//             text2: `Welcome, ${data.name}! 🎉`,
//           });
//         } catch (error) {
//           Toast.show({
//             type: "error",
//             text1: "Registration Failed",
//             text2: "Email already in use",
//           });
//         }
//       },
//     }),

//     // 🔹 Logout User (Clears Local Storage & Redux)
//     logoutUser: builder.mutation<void, void>({
//       queryFn: async (_arg, { dispatch }) => {
//         try {
//           // await AsyncStorage.removeItem("authToken");
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
import api from "./api";
import { AxiosRequestConfig, AxiosError } from "axios";
import { loginSuccess, logout, registerSuccess } from "./userSlice";
import { User, BankAccount } from "../types";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { nanoid } from "nanoid";

// ✅ Custom Axios Base Query
const axiosBaseQuery =
  (): BaseQueryFn<{ url: string; method: AxiosRequestConfig["method"]; data?: any; params?: any }, unknown, unknown> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await api({ url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data || err.message } };
    }
  };

// ✅ Create API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation<User, { username: string; password: string }>({
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
            // ✅ Fetch Bank Accounts
            const bankAccounts = await api.get(`/bankAccounts?userId=${currentUser.id}`);
            dispatch(loginSuccess({ ...currentUser, bankAccounts: bankAccounts.data }));

            router.push("(tabs)/profile");
            Toast.show({ type: "success", text1: `Welcome back ${currentUser.name}` });
          } else {
            Toast.show({ type: "error", text1: "Invalid Username or Password" });
          }
        } catch (error) {
          console.error("Login Error:", error);
        }
      },
    }),

    registerUser: builder.mutation<User, { name: string; email: string; password: string }>({
      async queryFn(newUser, _queryApi, _extraOptions, fetchWithBQ) {
        const existingUser = await fetchWithBQ({ url: `/users?email=${newUser.email}`, method: "GET" });
        if ((existingUser.data as User[]).length > 0) {
          return { error: { status: 400, data: "Email already exists" } };
        }

        // ✅ Create New User
        const createdUser = await fetchWithBQ({
          url: "/users",
          method: "POST",
          data: {
            id: nanoid(),
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            phone: "",
            biometricEnabled: false,
            createdAt: new Date().toISOString(),
            lastEvent: "Register",
            lastEventTime: new Date().toISOString(),
            lastEventMessage: "Welcome to Switch",
            isAuthenticated: true,
          },
        });

        if (!createdUser.data) {
          return { error: { status: 500, data: "Failed to register user" } };
        }

        const userId = (createdUser.data as User).id;

        // ✅ Create Bank Account
        const newBankAccount: BankAccount = {
          id: nanoid(),
          userId,
          accountName: newUser.name,
          accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
          balance: 500000,
          currency: "NGN",
          type: "Savings",
          bankName: "Moniepoint Bank",
          createdAt: new Date().toISOString(),
        };

        await fetchWithBQ({ url: "/bankAccounts", method: "POST", data: newBankAccount });

        return { data: { ...createdUser.data, bankAccounts: [newBankAccount] } as User };
      },

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(registerSuccess({ ...data, bankAccounts: data.bankAccounts || [] }));

          router.replace("/(tabs)/profile");
          Toast.show({ type: "success", text1: "Registration Successful", text2: `Welcome, ${data.name}! 🎉` });
        } catch (error) {
          Toast.show({ type: "error", text1: "Registration Failed", text2: "Something went wrong" });
        }
      },
    }),

    logoutUser: builder.mutation<void, void>({
      queryFn: async (_arg, { dispatch }) => {
        try {
          dispatch(logout());
          return { data: undefined };
        } catch (error) {
          return { error: { message: "Logout failed" } };
        }
      },
    }),
  }),
});

// ✅ Export Hooks
export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation } = apiSlice;
export default apiSlice;
