import { View, Text, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { Tabs, useRouter, usePathname } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types";

const TabsLayout = () => {
  const { name, isAuthenticated } = useSelector(
    (state: RootState) => state.user as User
  );

  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current route

  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname !== "/") {
        router.replace("/"); // ✅ Prevents back navigation to protected pages
      }
    }
  }, [isAuthenticated, pathname]);

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard", headerTitle: "Dashboard" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerTitle: "Profile" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
