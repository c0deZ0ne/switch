// // import React from "react";
// // import { Stack } from "expo-router";
// // import { Provider } from "react-redux";
// // import { PersistGate } from "redux-persist/integration/react";
// // import { ActivityIndicator, View } from "react-native";
// // import { persistor, store } from "./redux/store";

// // const RootLayout = () => {
// //   return (
// //     <Provider store={store}>
// //       <PersistGate
// //         loading={
// //           <View
// //             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
// //           >
// //             <ActivityIndicator size="large" color="#0000ff" />
// //           </View>
// //         }
// //         persistor={persistor}
// //       >
// //         <Stack>
// //           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
// //           <Stack.Screen name="index" options={{ headerShown: false }} />
// //         </Stack>
// //       </PersistGate>
// //     </Provider>
// //   );
// // };

// // export default RootLayout;

// import React from "react";
// import { Stack } from "expo-router";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { ActivityIndicator, View } from "react-native";
// import store, { persistor } from "./redux/store";

// const RootLayout = () => {
//   return (
//     <Provider store={store}>
//       <PersistGate
//         loading={
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <ActivityIndicator size="large" color="#0000ff" />
//           </View>
//         }
//         persistor={persistor}
//       >
//         <Stack
//           screenOptions={{ title: "Welcome Switcher", headerShown: false }}
//         />
//       </PersistGate>
//     </Provider>
//   );
// };

// export default RootLayout;

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Stack />;
}
