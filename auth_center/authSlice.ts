// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from '../../redux/store';
import { IAuthenticatedUser } from '../../types';
import { apiService } from '../../redux/apiService';
import reduxDataStorage from 'redux-persist/es/storage';
const initialState: IAuthenticatedUser = {
  clientId: null,
  country: '',
  daysToExpiration: 0,
  email: '',
  firstName: '',
  imageContent: '',
  imageName: '',
  isChangePasswordRequired: false,
  jobTitle: '',
  lastName: '',
  middleName: '',
  theme: null,
  permissions: [],
  phoneNumber: '',
  roles: [],
  taxTypes: [],
  userName: '',
  isAuthenticated: false,
  accessToken: null,
  isGroup: false,
  userData: undefined,
  address: '',
  companyEmail: null,
  supervisorEmail: null,
  department: null,
  isUpdatedRequired: false,
  sysConfig: null,
  isOrgActive: false,
  currentRole: '',
  refreshToken: null,
  sideBar: [],
  isAcceptTermsRequired: false,
};
// Auth Slice
export const authSlice = createSlice({
  name: 'persistUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthenticatedUser>) => {
      state = action.payload;
      return state;
    },
    seToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state = {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken || state.refreshToken,
      };
      return state;
    },

    updateUserData: (
      state,
      action: PayloadAction<{ key: string; value: any }>,
    ) => {
      state = {
        ...state,
        isUpdatedRequired: true,
        [action.payload.key]: action.payload.value,
      };
      return state;
    },
    activateOrganisation: (state) => {
      state = { ...state, isOrgActive: true };
      return state;
    },

    setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state = { ...state, accessToken: action.payload.accessToken };
      return state;
    },

    setISSaveRequiredFalse: (
      state,
      action: PayloadAction<{ isUpdatedRequired: boolean }>,
    ) => {
      state = { ...state, isUpdatedRequired: action.payload.isUpdatedRequired };
      return state;
    },

    SwitchCurrentRole: (
      state,
      action: PayloadAction<{ currentRole: string; accessToken: string }>,
    ) => {
      state = {
        ...state,
        currentRole: action.payload.currentRole,
        accessToken: action.payload.accessToken,
      };
      return state;
    },
    resetAuth: (state) => {
      state = initialState;
      reduxDataStorage.removeItem('persist:root');
      apiService.util.resetApiState();
      apiService.util.resetApiState();
      return state;
    },

    logout: (state, action) => {
      reduxDataStorage.removeItem('persist:root');
      localStorage.removeItem('persist:root');
      localStorage.clear();
      apiService.util.resetApiState();
      // window.location.href = '#/auth/login';
      window.location.reload();
    },
    setUserSide: (state, action) => {
      const newSate = { ...state, sideBar: action.payload };
      return newSate;
    },
    handleSideClick: (state, action) => {
      const updatedSideData = state.sideBar.map((curr) => {
        if (!curr.children) {
          return {
            ...curr,
            isActive: curr.path == action.payload.path,
          };
        } else {
          return {
            ...curr,
            children: curr?.children
              ? curr.children?.map((child) => ({
                  ...child,
                  isActive: child.path == action.payload.path,
                }))
              : undefined,
          };
        }
      });
      return { ...state, sideBar: updatedSideData };
    },

    updateTermsAndConditions: (state, action) => {
      state = {
        ...state,
        isAcceptTermsRequired: action.payload.isAcceptTermsRequired,
      };
      return state;
    },
  },
});

export const {
  setUser,
  seToken,
  resetAuth,
  setUserSide,
  logout,
  updateUserData,
  setISSaveRequiredFalse,
  SwitchCurrentRole,
  setAccessToken,
  activateOrganisation,
  handleSideClick,
  updateTermsAndConditions,
} = authSlice.actions;

export const selectUser = (state: RootState) => state.persistUser;

export const authReducer = authSlice.reducer;
