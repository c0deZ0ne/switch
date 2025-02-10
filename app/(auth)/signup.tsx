
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   StyleSheet,
//   ActivityIndicator,
//   ImageBackground,
//   StatusBar,
//   TextInput,
// } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { router } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as SplashScreen from "expo-splash-screen";
// import * as NavigationBar from "expo-navigation-bar";
// import { Formik, useFormik } from "formik";
// import * as Yup from "yup";
// import { RootState } from "../redux/store";
// import CustomButton from "../components/CustomButton";
// import { useRegisterUserMutation } from "../redux/apiSlice";

// // 📌 Define validation schema
// const registerSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });
// export default function SignupScreen() {
//   const dispatch = useDispatch();
//   const insets = useSafeAreaInsets();
//   const primaryColor = "#FFF";
//   const [registerUser, { isLoading }] = useRegisterUserMutation();

//   const user = useSelector((state: RootState) => state.user);
//   const { name, isAuthenticated, lastEvent, lastEventTime, lastEventMessage } =
//     user;

//   const [isReady, setIsReady] = useState(false);
//   const [greeting, setGreeting] = useState(lastEventMessage || "Welcome!");

//   useEffect(() => {
//     async function prepare() {
//       await SplashScreen.preventAutoHideAsync();
//       await NavigationBar.setBackgroundColorAsync("#fff");
//       await NavigationBar.setButtonStyleAsync("dark");

//       setTimeout(() => {
//         setIsReady(true);
//         SplashScreen.hideAsync();
//       }, 2000);
//     }
//     prepare();
//   }, []);

//   useEffect(() => {
//     if (isReady) {
//       if (isAuthenticated) {
//         router.replace("/(tabs)/profile");
//       } else {
//         setGreeting(determineGreeting());
//       }
//     }
//   }, [isAuthenticated, isReady]);

//   const handleLogout = () => {
//     // dispatch(logout());
//     setGreeting(`Goodbye, ${name}! 👋`);
//   };

//   function determineGreeting() {
//     if (!lastEventTime) return `Welcome, ${name || "Switcher"}!`;

//     const lastEventTimestamp = new Date(lastEventTime).getTime();
//     const currentTime = new Date().getTime();
//     const timeDiffInHours = (currentTime - lastEventTimestamp) / (1000 * 60);

//     if (lastEvent === "Logout" && timeDiffInHours < 1) {
//       return `Goodbye, ${name || "Switcher"}! 👋`; // ✅ Logout within an hour
//     }
//     return `Welcome back, ${name || "Switcher"}! 👋`; // ✅ Returning after an hour or reopening app
//   }

//   if (!isReady) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={"blue"} />
//         <StatusBar backgroundColor={primaryColor} barStyle="dark-content" />
//       </View>
//     );
//   }

//     const formik = useFormik({
//     initialValues: { name: "", email: "", password: "" },
//     validationSchema: registerSchema,
//     onSubmit: async (values, { setSubmitting, setErrors }) => {
//       try {
//         // const result = await registerUser(values).unwrap();
      
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });
//   return (
//     <ImageBackground
//       source={require("../../assets/home-bg.jpg")}
//       style={[
//         styles.container,
//         { paddingTop: -insets.top, paddingBottom: -insets.bottom },
//       ]}
//       resizeMode="cover"
//     >
//         <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />

//       {/* <View style={styles.innerContainer}>
//         <Text style={styles.text}>{greeting}</Text>

//         <LoginScreen/>
        
//       </View> */}
//           <View style={styles.container}>
//      <Text style={styles.label}>Name</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter name"
//         onChangeText={formik.handleChange("name")}
//         onBlur={formik.handleBlur("name")}
//         value={formik.values.name}
//       />
//       {formik.touched.name && formik.errors.name && (
//         <Text style={styles.error}>{formik.errors.name}</Text>
//       )}

//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter email"
//         keyboardType="email-address"
//         onChangeText={formik.handleChange("email")}
//         onBlur={formik.handleBlur("email")}
//         value={formik.values.email}
//       />
//       {formik.touched.email && formik.errors.email && (
//         <Text style={styles.error}>{formik.errors.email}</Text>
//       )}

//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter password"
//         secureTextEntry
//         onChangeText={formik.handleChange("password")}
//         onBlur={formik.handleBlur("password")}
//         value={formik.values.password}
//       />
//       {formik.touched.password && formik.errors.password && (
//         <Text style={styles.error}>{formik.errors.password}</Text>
//       )}

//       <CustomButton
//         title={formik.isSubmitting || isLoading ? "Switching up..." : "Be A Switcher"}
//         onPress={formik.handleSubmit}
//         disabled={formik.isSubmitting || isLoading}
//       />
//     </View>
      
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
//     minHeight:600
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
//     // container: { flex: 1, justifyContent: "center", padding: 20 },
//   label: { fontSize: 16, marginBottom: 5 },
//   input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
//   error: { color: "red", fontSize: 12, marginBottom: 10 },
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
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RootState } from "../redux/store";
import { useRegisterUserMutation } from "../redux/apiSlice";
import Toast from "react-native-toast-message";
import CustomButton from "../components/CustomButton";

// 📌 Define validation schema
const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const primaryColor = "#FFF";
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const user = useSelector((state: RootState) => state.user);
  const { name, isAuthenticated, lastEvent, lastEventTime, lastEventMessage } = user;

  const [isReady, setIsReady] = useState(false);
  // const [greeting, setGreeting] = useState<string>(lastEventMessage || "Welcome!");

  // ✅ Use Formik at the top level (Avoid breaking hook rules)
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const result = await registerUser(values).unwrap();
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: `Welcome, ${result.name}! 🎉`,
        });
        

        router.replace("/(tabs)/profile");
      } catch (error: any) {
        setErrors({ email: "Email already in use" });
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: "Email already taken",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await NavigationBar.setBackgroundColorAsync("#fff");
      await NavigationBar.setButtonStyleAsync("dark");

      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 2000);
    }
    prepare();
  }, []);


  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"blue"} />
        <StatusBar backgroundColor={primaryColor} barStyle="dark-content" />
      </View>
    );
  }

  return (

    <ImageBackground
      source={require("../../assets/home-bg.jpg")}
      style={[
        styles.container,
        { paddingTop: -insets.top, paddingBottom: -insets.bottom },
      ]}
      resizeMode="cover"
      onProgress={()=>Keyboard.dismiss()}
    >
      <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />
<TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} accessible={false}>
< View style={styles.innerContainer} >


      <View style={styles.formContainer}>
        <View style={styles.inputViewContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          onChangeText={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name && (
          <Text style={styles.error}>{formik.errors.name}</Text>
        )}
        </View>
       

        {/* ✅ Email Input */}
        <View style={styles.inputViewContainer}>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.error}>{formik.errors.email}</Text>
        )}
        </View>

        {/* ✅ Password Input */}
        <View style={styles.inputViewContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.error}>{formik.errors.password}</Text>
        )}
        </View>

        {/* ✅ Submit Button */}
        <CustomButton
          title={formik.isSubmitting || isLoading ? "Switching up..." : "Be A Switcher"}
          onPress={formik.handleSubmit} // ✅ Ensure function is executed
          disabled={formik.isSubmitting || isLoading}
          buttonStyle={styles.button}

        />
      </View>

</View>
      </TouchableWithoutFeedback>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,   
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#fff",
    padding: 20,
    marginTop:"auto",
    marginBottom:"auto",
    minHeight: 100,
    borderRadius:10,
    opacity:0.8,
    width:'100%'
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
 
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },

  inputViewContainer:{display:"flex",width:"100%"},
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10,height:40 ,display:"flex",width:"100%" },
  button:{height:40, justifyContent:"center",marginVertical:10 , display:"flex",width:"100%"},
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 255, 0.2)",
    padding: 20,
    minHeight:600
  },
});
