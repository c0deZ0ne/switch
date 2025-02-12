import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useLoginUserMutation } from "../redux/apiSlice";
import CustomButton from "../components/CustomButton";
import * as LocalAuthentication from "expo-local-authentication";
import { RootState } from "../redux/store";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const loginSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { name, isAuthenticated, lastEvent, lastEventTime, lastEventMessage } =
    user;
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function checkBiometricSupport() {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricSupported(hasHardware && isEnrolled);
      } catch (error) {
        console.error("Biometric support check failed:", error);
      }
    }
    checkBiometricSupport();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      if (!user.email) throw "First time login required to used biometric";
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Switch in with Biometrics",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (result.success) {
        formik.setValues({ username: user.email, password: user.password });
        handleLogin({ username: user.email, password: user.password });
      } else {
        Toast.show({
          type: "error",
          text1: "Biometric Authentication Failed",
        });
      }
    } catch (error: any) {
      Alert.alert(error);
    }
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      Keyboard.dismiss();
      handleLogin(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (user.email) {
      formik.setValues({ username: user.email } as unknown as any);
    }
  }, [user]);

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await loginUser(values).unwrap();
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const [isReady, setIsReady] = useState(false);
  const [greeting, setGreeting] = useState(lastEventMessage || "Welcome!");

  function determineGreeting() {
    if (!lastEventTime) return `Welcome, ${name || "Switcher"}!`;

    const lastEventTimestamp = new Date(lastEventTime).getTime();
    const currentTime = new Date().getTime();
    const timeDiffInHours = (currentTime - lastEventTimestamp) / (1000 * 60);

    if (lastEvent === "Logout" && timeDiffInHours < 1) {
      return `Goodbye, ${name || "Switcher"}! 👋`;
    }
    return `Welcome back, ${name || "Switcher"}! 👋`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{determineGreeting()}</Text>

      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View style={styles.container}>
          {formik.isSubmitting || isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color="blue"
            />
          ) : null}

          {!user.email && (
            <>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                onChangeText={formik.handleChange("username")}
                onBlur={formik.handleBlur("username")}
                value={formik.values.username}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formik.touched.username && formik.errors.username && (
                <Text style={styles.error}>{formik.errors.username}</Text>
              )}
            </>
          )}

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

          <CustomButton
            onPress={formik.handleSubmit}
            disabled={formik.isSubmitting || isLoading}
            buttonStyle={styles.button}
            title={
              formik.isSubmitting || isLoading ? "Switching..." : "Switch in"
            }
          />

          {biometricSupported && Platform.OS !== "web" && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Text style={styles.biometricText}>Login with Biometrics</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ marginVertical: 20 }}
            onPress={() => router.push("/signup")}
          >
            <Text>Don't Have an Account? Register Here...</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: "auto",
    justifyContent: "center",
    padding: 20,
    // flex: 1,
    alignSelf: "center",
    backgroundColor: "#fff",
    width: "100%",
    opacity: 0.9,
    borderRadius: 10,
    height: "50%",
    shadowOpacity: 0.7,
    // marginTop: 10,
  },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
  },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
  button: { height: 40, justifyContent: "center", marginVertical: 10 },
  loader: { position: "absolute", top: "10%", left: "50%", right: "50%" },
  biometricButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  biometricText: { color: "white", textAlign: "center", fontWeight: "bold" },

  greeting: {
    color: "#14425F",
    fontSize: 20,
    marginHorizontal: "auto",
  },
});

export default LoginScreen;
