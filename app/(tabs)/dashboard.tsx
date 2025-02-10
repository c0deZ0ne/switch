import { View, Text, Button, StatusBar } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { User } from "../types";

export default function Dashboard() {
  const { name, isAuthenticated } = useSelector(
    (state: RootState) => state.user as User
  );

  const dispatch =useDispatch()
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push({ pathname: "/" });
  }, [isAuthenticated]);

  return (
    <View>      
      <Text>Welcome {name} To Your Dashboard👋</Text>
      <Button title="Logout" onPress={()=>dispatch(logout())} />
    </View>
  );
}
