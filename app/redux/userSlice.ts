import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
const initialState: User = {
  name: "",
  isAuthenticated: false,
  id: "",
  email: "",
  phone: "",
  password: "",
  biometricEnabled: false,
  createdAt: "",
  lastEvent: null,
  lastEventTime: null,
  lastEventMessage: "",
  bankAccounts: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => { 
      return {...state,...action.payload ,isAuthenticated:true,lastEventMessage : ` GoodBy, ${action.payload.name}! 👋`,lastEventTime : new Date().toISOString()
    
    }
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      return {...state,...action.payload ,isAuthenticated:true,lastEvent:"Register", lastEventMessage : `GoodBy, ${action.payload.name}! 👋`,lastEventTime : new Date().toISOString()
    
    }
    },
    logout: (state) => {
    
      return {...state,isAuthenticated:false, lastEventMessage:"Goodby "+state.name, lastEvent:"Logout",lastEventTime:new Date().toISOString()}
    },
  },
});

export const { logout, loginSuccess, registerSuccess } = userSlice.actions;
export default userSlice.reducer;
