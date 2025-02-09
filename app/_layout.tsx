
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Stack } from "expo-router";
import { View, ActivityIndicator, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import Toast from "react-native-toast-message";
import ErrorBoundary from "./components/ErrorBoundary";
import store, { persistor } from "./redux/store";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const primaryColor = "blue";

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await NavigationBar.setBackgroundColorAsync(primaryColor);
      await NavigationBar.setButtonStyleAsync("light");
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
        <ErrorBoundary> 
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
          <Toast />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

