import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, StatusBar, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import ErrorBoundary from "./components/ErrorBoundary";
import store, { persistor } from "./redux/store";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

//  RootLayout Component
export default function RootLayout() {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <ErrorBoundary>
          <AuthHandler />
          <Toast />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

function AuthHandler() {
  const router = useRouter();
  const segments = useSegments();
  const user = useSelector((state: RootState) => state.user);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();

      if (Platform.OS === "android") {
        const NavigationBar = await import("expo-navigation-bar");
        await NavigationBar.setBackgroundColorAsync("blue");
        await NavigationBar.setButtonStyleAsync("light");
      }

      setTimeout(() => {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }, 1000);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      if (!user.isAuthenticated && segments?.[0] !== "/") {
      }
    }
  }, [user.isAuthenticated, isAppReady, segments]);

  if (!isAppReady) {
    return (
      <>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="blue" />
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        </View>
      </>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
