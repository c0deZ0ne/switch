import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="signup" options={{ title: "SignUp" }} />
    </Stack>
  );
};

export default AuthLayout;
