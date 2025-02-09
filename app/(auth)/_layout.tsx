import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="/(auth)/login" options={{ title: "Login" }} />
      <Stack.Screen name="/(auth)/signup" options={{ title: "SignUp" }} />
    </Stack>
  );
};

export default AuthLayout;
