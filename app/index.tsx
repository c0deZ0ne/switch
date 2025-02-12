import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { RootState } from "./redux/store";
import { logout } from "./redux/userSlice";
import LoginScreen from "./(auth)/login";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const primaryColor = "#FFF";

  const user = useSelector((state: RootState) => state.user);
  const { name, isAuthenticated, lastEvent, lastEventTime, lastEventMessage } =
    user;

  const [isReady, setIsReady] = useState(false);
  const [greeting, setGreeting] = useState(lastEventMessage || "Welcome!");

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();

      //  Only set Navigation Bar on Android
      if (Platform.OS === "android") {
        const NavigationBar = await import("expo-navigation-bar");
        await NavigationBar.setBackgroundColorAsync("#fff");
        await NavigationBar.setButtonStyleAsync("light");
      }

      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 2000);
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (isAuthenticated) {
        router.replace("/(tabs)/dashboard");
      } else {
        setGreeting(determineGreeting());
      }
    }
  }, [isAuthenticated, isReady]);

  function determineGreeting() {
    if (!lastEventTime) return `Welcome, ${name || "Switcher"}!`;

    const lastEventTimestamp = new Date(lastEventTime).getTime();
    const currentTime = new Date().getTime();
    const timeDiffInHours = (currentTime - lastEventTimestamp) / (1000 * 60);

    if (lastEvent === "Logout" && timeDiffInHours < 1) {
      return `Goodbye, ${name || "Switcher"}! 👋`; // Logout within an hour
    }
    return `Welcome back, ${name || "Switcher"}! 👋`; // Returning after an hour or reopening app
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"blue"} />
        <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />
      <View style={styles.innerContainer}>
        <LoginScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 255, 0.01)",
    padding: 20,
    minHeight: 600,
    alignContent: "center",
  },
  text: {
    color: "#14425F",
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
