// // import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// // import { router } from "expo-router";
// // import apiSlice from "./apiSlice";
// // import { User } from "../../types";

// // const initialState: User = {
// //   id: "",
// //   name: "",
// //   email: "",
// //   phone: "",
// //   password: "",
// //   biometricEnabled: false,
// //   createdAt: "",
// //   lastEvent: null,
// //   isAuthenticated: false,
// //   lastEventTime: null
// // };

// // const userSlice = createSlice({
// //   name: "user",
// //   initialState,
// //   reducers: {
// //     loginSuccess: (state, action: PayloadAction<User>) => {
// //       Object.assign(state, action.payload); // ✅ Properly update state
// //       state.isAuthenticated = true; // ✅ Ensure user is authenticated
// //       state.lastEvent="Login"
// //     },

// //     logout: (state) => {
// //       router.replace("/"); // ✅ Redirect to login screen
// //       apiSlice.util.resetApiState();
// //       Object.assign(state, {...state,isAuthenticated:false,lastEvent:"Logout"}); // ✅ Reset state on logout
// //       console.log("✅ User logged out");
// //     },
// //   },
// // });

// // export const { logout, loginSuccess } = userSlice.actions;
// // export default userSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "../../types";

// const initialState: User = {
//   name: "",
//   isAuthenticated: false,
//   id: "",
//   email: "",
//   phone: "",
//   password: "",
//   biometricEnabled: false,
//   createdAt: "",
//   lastEvent: null, // ✅ Stores "Login" or "Logout"
//   lastEventTime: null, // ✅ Stores event timestamp
//   lastEventMessage: "", // ✅ Stores last greeting message
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     loginSuccess: (state, action: PayloadAction<User>) => {
//       state.name = action.payload.name;
//       state.isAuthenticated = true;
//       state.lastEvent = "Login"; // ✅ Mark as login
//       state.lastEventTime = new Date().toISOString(); // ✅ Save login time
//       state.lastEventMessage = `Welcome back, ${action.payload.name}! 👋`; // ✅ Save greeting
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.lastEvent = "Logout"; // ✅ Mark as logout
//       state.lastEventTime = new Date().toISOString(); // ✅ Save logout time
//       state.lastEventMessage = `Goodbye, ${state.name}! 👋`; // ✅ Save farewell message
//     },
//   },
// });

// export const { logout, loginSuccess } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.name = action.payload.name;
      state.isAuthenticated = true;
      state.lastEvent = "Login";
      state.lastEventTime = new Date().toISOString();
      state.lastEventMessage = `Welcome back, ${action.payload.name}! 👋`;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.lastEvent = "Register";
      state.lastEventTime = new Date().toISOString();
      state.lastEventMessage = `Welcome, ${action.payload.name}! 🎉`;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.lastEvent = "Logout";
      state.lastEventTime = new Date().toISOString();
      state.lastEventMessage = `Goodbye, ${state.name}! 👋`;
    },
  },
});

export const { logout, loginSuccess, registerSuccess } = userSlice.actions;
export default userSlice.reducer;
