// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   ActivityIndicator,
//   ImageBackground,
//   StatusBar,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { router } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as SplashScreen from "expo-splash-screen";
// import * as NavigationBar from "expo-navigation-bar";
// import { RootState } from "./redux/store";
// import { logout } from "./redux/userSlice";
// import { User } from "../types";

// export default function HomeScreen() {
//   const dispatch = useDispatch();
//   const insets = useSafeAreaInsets();
//   const primaryColor = "purple";

//   const user = useSelector((state: RootState) => state.user);
//   const { name, isAuthenticated, lastEvent } = user as User;

//   const [isReady, setIsReady] = useState(false);
//   const [lastAction, setLastAction] = useState<"login" | "logout" | null>(null);

//   useEffect(() => {
//     async function prepare() {
//       await SplashScreen.preventAutoHideAsync();
//       await NavigationBar.setBackgroundColorAsync(primaryColor);
//       await NavigationBar.setButtonStyleAsync("light");

//       setTimeout(() => {
//         setIsReady(true);
//         SplashScreen.hideAsync();
//       }, 2000);
//     }
//     prepare();
//   }, []);

//   useEffect(() => {
//     if (isReady && isAuthenticated) {
//       router.replace("/(tabs)/profile");
//     }
//   }, [isAuthenticated, lastEvent, isReady]);

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   if (!isReady) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={primaryColor} />
//         <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require("../assets/home-bg.jpg")}
//       style={[
//         styles.container,
//         { paddingTop: -insets.top, paddingBottom: -insets.bottom },
//       ]}
//       resizeMode="cover"
//     >
//       <View style={styles.innerContainer}>
//         <Text style={styles.text}>
//           {lastEvent === "Logout"
//             ? `Goodbye, ${name}! 👋`
//             : `Welcome${isAuthenticated ? ` back, ${name}` : ", Guest"}!`}
//         </Text>

//         {!isAuthenticated ? (
//           <Button title="Login" onPress={() => router.push("/(auth)/login")} />
//         ) : (
//           <Button title="Logout" onPress={handleLogout} color="red" />
//         )}
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 255, 0.2)",
//     padding: 20,
//   },
//   text: {
//     color: "white",
//     fontSize: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { RootState } from "./redux/store";
import { logout } from "./redux/userSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const primaryColor = "purple";

  const user = useSelector((state: RootState) => state.user);
  const { name, isAuthenticated, lastEvent, lastEventTime, lastEventMessage } =
    user;

  const [isReady, setIsReady] = useState(false);
  const [greeting, setGreeting] = useState(lastEventMessage || "Welcome!");

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

  useEffect(() => {
    if (isReady) {
      if (isAuthenticated) {
        router.replace("/(tabs)/profile");
      } else {
        setGreeting(determineGreeting());
      }
    }
  }, [isAuthenticated, isReady]);

  const handleLogout = () => {
    dispatch(logout());
    setGreeting(`Goodbye, ${name}! 👋`);
  };

  function determineGreeting() {
    if (!lastEventTime) return `Welcome, ${name || "Guest"}!`;

    const lastEventTimestamp = new Date(lastEventTime).getTime();
    const currentTime = new Date().getTime();
    const timeDiffInHours = (currentTime - lastEventTimestamp) / (1000 * 60);

    if (lastEvent === "Logout" && timeDiffInHours < 1) {
      return `Goodbye, ${name || "Guest"}! 👋`; // ✅ Logout within an hour
    }
    return `Welcome back, ${name || "Guest"}! 👋`; // ✅ Returning after an hour or reopening app
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/home-bg.jpg")}
      style={[
        styles.container,
        { paddingTop: -insets.top, paddingBottom: -insets.bottom },
      ]}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{greeting}</Text>
        {!isAuthenticated ? (
          <Button title="Login" onPress={() => router.push("/(auth)/login")} />
        ) : (
          <Button title="Logout" onPress={handleLogout} color="red" />
        )}
      </View>
    </ImageBackground>
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
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    padding: 20,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
