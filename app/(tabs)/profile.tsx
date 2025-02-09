import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { logout } from "../redux/userSlice";
import { RootState } from "../redux/store";

export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Welcome, {user.name || "Guest"} 👋</Text>
      <Button title="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
}
