import React, { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  View,
  ActivityIndicator,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import store, { persistor, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <AuthHandler />
        <Toast />
      </PersistGate>
    </Provider>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="blue" />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </View>
  );
}

function AuthHandler() {
  const router = useRouter();
  const segments = useSegments();
  const user = useSelector((state: RootState) => state.user);
  const [isAppReady, setIsAppReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = new Animated.Value(drawerOpen ? 0 : -250);
  const dispatch = useDispatch();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (Platform.OS === "android") {
        const NavigationBar = await import("expo-navigation-bar");
        await NavigationBar.setBackgroundColorAsync("#fff");
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
    if (isAppReady && !user.isAuthenticated) {
      if (
        segments &&
        segments.length > 0 &&
        !segments.includes("(auth)") &&
        segments[0] !== "/"
      ) {
        router.replace("/(auth)/login");
      } else if (segments && segments.length > 0) {
        router.replace("/(auth)/login");
      }
    }
  }, [user.isAuthenticated, isAppReady, segments]);

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {drawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <TouchableOpacity onPress={() => dispatch(logout())}>
          <Text style={styles.item}>
            <AntDesign name="logout" size={18} /> Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <Slot screenOptions={{ headerShown: false }} />
      <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
        <AntDesign name="menu-fold" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: -250,
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    zIndex: 10,
    elevation: 5,
  },
  item: {
    fontSize: 18,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menuButton: {
    position: "absolute",
    top: "90%", // Adjust as needed
    left: 0,
    zIndex: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
