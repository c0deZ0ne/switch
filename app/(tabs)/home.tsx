import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import React from "react";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!user?.name) {
    router.replace("/(auth)/login"); // Redirect if not logged in
    return null;
  }

  return (
    <View>
      <Text>Welcome, {user?.name || "Guest"} 👋</Text>
      <Button title="Logout" />
    </View>
  );
}
