import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import Toast from "react-native-toast-message";
import ErrorBoundary from "./components/ErrorBoundary";
import store, { persistor } from "./redux/store";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <ErrorBoundary>
          <AuthHandler />
          <Toast />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

//Show a loading screen while Redux Persist is rehydrating state
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="blue" />
      <StatusBar backgroundColor="blue" barStyle="light-content" />
    </View>
  );
}

//Handles navigation based on authentication state
function AuthHandler() {
  const router = useRouter();
  const segments = useSegments();
  const user = useSelector((state: RootState) => state.user);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await NavigationBar.setBackgroundColorAsync("blue");
      await NavigationBar.setButtonStyleAsync("light");
      setTimeout(() => {
        setIsAppReady(true);
        SplashScreen.hideAsync();
      }, 1000);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      if (!user.isAuthenticated && segments[0] !== "(auth)") {
        // router.replace("/(auth)/login");
      }
    }
  }, [user.isAuthenticated, isAppReady]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
