import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { router } from "expo-router";


interface UserState {
  name: string;
  email?:string
  accessToken:string;
  isAuthenticated:boolean
}

const initialState: UserState = {
  name: "",
  accessToken: "",
  isAuthenticated: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    loginSuccess:(state,action)=>{
      state=action.payload
    },

    logout:()=>{
      router.replace("/login");
      console.log("Logout")
    }
  },
});

export const { setUser,logout,loginSuccess } = userSlice.actions;
 const userReducer =  userSlice.reducer;
export default userReducer 
