import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { router } from "expo-router";

interface UserState {
  name: string;
}

const initialState: UserState = { name: "" };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },


    logout:()=>{
      router.replace("/login");
      console.log("Logout")
    }
  },
});

export const { setUser,logout } = userSlice.actions;
export const userReducer =  userSlice.reducer;
