import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerTitle: "Home", title: "Home" }}
      />
      <Tabs.Screen
        name="users/[id]"
        options={{ title: "User", headerTitle: "User Page" }}
      />
      <Tabs.Screen
        name="HomeScreen"
        options={{ title: "User", headerTitle: "User Page" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
