import {
  IAuthenticatedUser,
  IChangePasswordWithOtp,
  IPasswordRequestOtp,
  ISidBarItems,
  IchangePassword,
  SystemRoles,
} from '../../types';
import { apiService } from '../../redux/apiService';
import {
  resetAuth,
  setUser,
  SwitchCurrentRole,
  setUserSide,
  updateUserData,
  logout,
  setISSaveRequiredFalse,
  setAccessToken,
} from './authSlice';
import {
  AppError,
  AppLoadingModal,
  AppSuccess,
  changePassWordFirstTimePopUp,
  otpPopupModal,
} from '../../ui-components/alert/alerts';
import { sideBarData } from '../../data';
import { store } from '../../redux/store';
import { closeModal } from '../modal/modalSlice';

export const authApi: any = apiService?.injectEndpoints({
  endpoints: (builder: any) => ({
    getAccess: builder.mutation({
      query: () => ({
        url: '/api/SysConfig/get-csrf-token',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          GlobalKey: import.meta.env.VITE_API_GLOBAL_KEY, // Custom header for this specific call
        },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('initialize', data?.data?.csrfToken);
          dispatch(
            updateUserData({
              key: 'theme',
              value: data?.data?.csrfToken,
            }),
          );
          store.dispatch(setISSaveRequiredFalse({ isUpdatedRequired: false }));
          return data;
        } catch (error) {
          return {};
        }
      },
    }),

    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'api/Auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { ...credentials },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        dispatch(AppLoadingModal());
        try {
          const { data, message } = await queryFulfilled;
          const newData: IAuthenticatedUser = {
            ...data?.data,
            isAuthenticated: false,
            userName: args?.username,
          };

          if (data?.data.isChangePasswordRequired) {
            dispatch(setUser({ ...newData, isAuthenticated: false }));
            dispatch(changePassWordFirstTimePopUp());
          } else {
            dispatch(setUser({ ...newData, isAuthenticated: false }));
            dispatch(otpPopupModal());
          }
          return newData;
        } catch (error: any) {
          dispatch(AppError(error));
        }
      },
    }),

    refreshAccessToken: builder.mutation({
      query: () => ({
        url: 'api/auth/refresh-token',
        method: 'POST',
        body: {
          token: store.getState().persistUser.refreshToken,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken({ accessToken: data?.data?.accessToken }));
          store.dispatch(setISSaveRequiredFalse({ isUpdatedRequired: false }));
          return data;
        } catch (error) {
          return error;
          // console.error('Error in getAccess query:', error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: 'api/Auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data, message } = await queryFulfilled;
          dispatch(
            AppSuccess({
              message: message || data?.data?.message,
            } as any),
          );

          dispatch(logout({}));
          dispatch(closeModal());
        } catch (error: any) {
          dispatch(logout({}));
          dispatch(closeModal());
        }
      },
    }),
    changePassword: builder.mutation({
      query: (credentials: IchangePassword) => ({
        url: 'api/Auth/change-password',
        method: 'POST',
        body: {
          ...credentials,
          isAcceptTermsRequired: undefined,
          acceptTermsRequired: credentials.isAcceptTermsRequired,
        },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data, message } = await queryFulfilled;
          const newData: IAuthenticatedUser = {
            ...data?.data,
            isAuthenticated: false,
          };
          dispatch(resetAuth());
          dispatch(
            AppSuccess({
              message:
                message || data.message || 'Password was changed successfully',
              url: '/auth/login',
              isTimed: 2000,
            }),
          );
          return newData;
        } catch (error: any) {}
      },
    }),
    requestPasswordOtp: builder.mutation({
      query: (credentials: IPasswordRequestOtp) => ({
        url: 'api/Auth/forgot-password',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        dispatch(AppLoadingModal());

        try {
          const { data, message } = await queryFulfilled;
          const newData: IAuthenticatedUser = {
            ...data?.data,
            isAuthenticated: false,
          };
          dispatch(
            AppSuccess({
              message: message || data?.message,
              isTimed: 2000,
            }),
          );
          return newData;
        } catch (error: any) {
          dispatch(AppError(error));
        }
      },
    }),
    requestLoginOtp: builder.mutation({
      query: (credentials: IPasswordRequestOtp) => ({
        url: 'api/Auth/send-token',
        method: 'GET',
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data, message } = await queryFulfilled;
          return data.data;
        } catch (error: any) {}
      },
    }),

    changePasswordWithOtp: builder.mutation({
      query: (credentials: IChangePasswordWithOtp) => ({
        url: 'api/Auth/reset-password',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        dispatch(AppLoadingModal());
        try {
          const { data, message } = await queryFulfilled;
          const newData: IAuthenticatedUser = {
            ...data?.data,
            isAuthenticated: false,
          };
          dispatch(
            AppSuccess({
              message: message || data?.message,
              url: '/auth/login',
              isTimed: 2000,
            }),
          );
          return newData;
        } catch (error: any) {
          dispatch(AppError(error));
        }
      },
    }),

    changeRole: builder.mutation({
      query: (role: SystemRoles) => ({
        url: `api/Auth/get-role-token/${SystemRoles[role]}`,
        method: 'GET',
      }),
      async onQueryStarted(
        args: SystemRoles,
        { queryFulfilled, dispatch }: any,
      ) {
        try {
          dispatch(AppLoadingModal());
          const { data, message } = await queryFulfilled;
          dispatch(
            SwitchCurrentRole({
              currentRole: data?.data?.currentRole,
              accessToken: data?.data?.accessToken,
            }),
          );
          dispatch(setUserSide(sideBarData[`${SystemRoles[args]}`]));
          dispatch(
            AppSuccess({ message: message || data?.message, isTimed: 2000 }),
          );
          return data;
        } catch (error: any) {
          dispatch(AppError(error));
        }
      },
    }),
    validateOtp: builder.mutation({
      query: (body: { token: string; userName: string }) => ({
        url: `api/Auth/validate`,
        method: 'POST',
        body: { token: body.token, userName: body.userName },
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data, message } = await queryFulfilled;
          dispatch(
            AppSuccess({
              message: message || data.message,
              isTimed: 2000,
            }),
          );
          dispatch(
            setUser({
              ...data.data,
              isAuthenticated: true,
              sideBar: sideBarData[
                data?.data?.currentRole as SystemRoles
              ] as any as ISidBarItems[],
            }),
          );
          if (
            data.data?.roles?.includes('SuperAdmin') ||
            data?.data?.roles?.includes('Administrator')
          ) {
            dispatch(
              AppSuccess({
                message: message || data.message,
                url: '/profile/admin/analytics',
                isTimed: 2000,
              }),
            );
          } else {
            dispatch(
              AppSuccess({
                message: message || data.message,
                url: '/profile/client/overview',
                isTimed: 2000,
              }),
            );
          }
          const getAccessResult = await dispatch(
            authApi.endpoints.getAccess.initiate(),
          ).unwrap();
          dispatch(
            updateUserData({
              key: 'theme',
              value: getAccessResult?.data?.csrfToken,
            }),
          );
          dispatch(setISSaveRequiredFalse({ isUpdatedRequired: false }));
          localStorage.setItem('initialize', getAccessResult?.data?.csrfToken);

          return data;
        } catch (error: any) {}
      },
    }),
    desktopLogin: builder.mutation({
      query: () => ({
        url: `api/Auth/autoLogin`,
        method: 'GET',
      }),
      async onQueryStarted(args: any, { queryFulfilled, dispatch }: any) {
        try {
          const { data, message } = await queryFulfilled;
          const newData: IAuthenticatedUser = {
            ...data?.data,
            isAuthenticated: false,
          };

          if (data?.data.isChangePasswordRequired) {
            dispatch(setUser({ ...newData, isAuthenticated: false }));
            dispatch(
              AppSuccess({
                message: message || data.message,
                url: '/auth/change-password',
                isTimed: 2000,
              }),
            );
          } else {
            dispatch(setUser({ ...newData, isAuthenticated: true }));
            if (
              data.data?.currentRole == SystemRoles.SuperAdmin ||
              data.data?.currentRole == SystemRoles.Administrator
            ) {
              dispatch(
                AppSuccess({
                  message: message || data.message,
                  url: '/profile/admin/analytics',
                  isTimed: 2000,
                }),
              );
            } else {
              dispatch(
                AppSuccess({
                  message: message || data.message,
                  url: '/profile/client/inbox',
                  isTimed: 2000,
                }),
              );
            }
          }
        } catch (error: any) {
          dispatch(resetAuth());
          dispatch(AppError(error));
        }
      },
    }),
  }),
});

export const {
  useGetAccessMutation,
  useLogoutMutation,
  useLoginMutation,
  useValidateOtpMutation,
  useChangePasswordMutation,
  useDesktopLoginMutation,
  useRequestPasswordOtpMutation,
  useRequestLoginOtpMutation,
  useChangePasswordWithOtpMutation,
  useRefreshAccessTokenMutation,
  useChangeRoleMutation,
} = authApi;
