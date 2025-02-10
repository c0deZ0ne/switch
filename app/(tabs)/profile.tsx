import { View, Text, Button, StatusBar } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { User } from "../types";

export default function Profile() {
  const dispatch = useDispatch();
  const { name, isAuthenticated } = useSelector(
    (state: RootState) => state.user as User
  );

  const router = useRouter();
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname !== "/") {
        router.replace("/"); // Prevents back navigation to protected pages
      }
    }
  }, [isAuthenticated, pathname]);

  return (
    <View>      
      <Text>Welcome {name} To Your profile</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}
