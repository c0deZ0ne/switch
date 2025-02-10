import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { User } from "../../types";

export default function Dashboard() {
  const { name, isAuthenticated } = useSelector(
    (state: RootState) => state.user as User
  );

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push({ pathname: "/(auth)/login" });
  }, [isAuthenticated]);

  return (
    <View>
      <Text>Welcome {name} To Your Dashboard👋</Text>
      <Button title="Logout" />
    </View>
  );
}
