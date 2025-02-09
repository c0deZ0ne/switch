import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { Stack } from "expo-router";
import { View, ActivityIndicator, StatusBar, Platform, } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const primaryColor = "blue"; // Change this to match your theme
   NavigationBar.setBackgroundColorAsync(primaryColor); // ✅ Set bottom navbar color
   NavigationBar.setButtonStyleAsync("light"); // ✅ Set icons to light mode
  //  NavigationBar.setVisibilityAsync("hidden")
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
        await NavigationBar.setBackgroundColorAsync(primaryColor); // ✅ Set bottom navbar color
        await NavigationBar.setButtonStyleAsync("light"); // ✅ Set icons to light mode
        // await NavigationBar.setVisibilityAsync("hidden")
      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 2000);
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={primaryColor} />
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        }
        persistor={persistor}
      >
        <Stack screenOptions={{ title: "Welcome Switcher", headerShown: false }} />
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      </PersistGate>
    </Provider>
  );
}
