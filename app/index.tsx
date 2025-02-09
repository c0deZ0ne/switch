import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/store";
import React from "react";
import { logout } from "./redux/userSlice";
import { router } from "expo-router";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Welcome, {user.name || "Guest"} 👋</Text>
      <Button
        title="login"
        onPress={() => {
          router.push({ pathname: "/(auth)/login" });
        }}
      />
    </View>
  );
}
