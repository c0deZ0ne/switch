import { View, Text, Button, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/store";
import React, { useEffect, useState } from "react";
import { logout } from "./redux/userSlice";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
export default function HomeScreen() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets(); // ✅ Get Safe Area Insets
  const [isReady, setIsReady] = useState(false);
  const primaryColor = "blue"; // Change this to match your theme

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    NavigationBar.setBackgroundColorAsync(primaryColor); // ✅ Set bottom navbar color
    NavigationBar.setButtonStyleAsync("light"); // ✅ Set icons to light mode
    NavigationBar.setVisibilityAsync("hidden");
    
    async function prepare() {
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
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/home-bg.jpg")} // ✅ Set your background image path
      style={[styles.container, { paddingTop: -insets.top, paddingBottom: -insets.bottom }]}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.text}>Welcome, {user.name || "Guest"} 👋</Text>
        <Button
          title="Login"
          onPress={() => {
            router.push({ pathname: "/(auth)/login" });
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // ✅ Forces full-screen layout (Ignores Safe Area)
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 255, 0.2)", // ✅ Semi-transparent blue overlay
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
