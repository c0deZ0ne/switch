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
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useLoginUserMutation } from "../redux/apiSlice";
import CustomButton from "../components/CustomButton";
import * as LocalAuthentication from "expo-local-authentication";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// 📌 Define validation schema
const loginSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootState)=>state.user)
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [biometricSupported, setBiometricSupported] = useState(false);

  // Check if Biometrics are available on device
  useEffect(() => {
    async function checkBiometricSupport() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(hasHardware && isEnrolled);
    }
    checkBiometricSupport();
  }, []);

  // Biometric Authentication Function
  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Switch in with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true, // Only use biometrics
    });

    if (result.success) {
      formik.setValues({ username:user.email,password:user.password });
      handleLogin({username:user.email,password:user.password  });
    } else {
      Toast.show({
        type: "error",
        text1: "Biometric Authentication Failed",
      });
    }
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      Keyboard.dismiss();
      console.log("Submitting values:", values);
      handleLogin(values);
      setSubmitting(false);
    },
  });

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const res = await loginUser(values).unwrap();
      router.replace("/profile");
      Toast.show({ type: "success", text1: "Login Successful", text2: "Welcome back!" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Invalid credentials" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View style={styles.container}>
        {formik.isSubmitting || isLoading ? (
          <ActivityIndicator style={styles.loader} size="large" color="blue" />
        ) : null}

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

        {/* Normal Login Button */}
        <CustomButton
          onPress={formik.handleSubmit}
          disabled={formik.isSubmitting || isLoading}
          buttonStyle={styles.button}
          title={formik.isSubmitting || isLoading ? "Switching..." : "Switch in"}
        />

        {/* Biometric Login Button */}
        {biometricSupported && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Text style={styles.biometricText}>Login with Biometrics</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text>Don't Have an Account? Register Here...</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    width: "100%",
    opacity: 0.8,
    borderRadius: 10,
    height: "50%",
    shadowOpacity: 0.7,
    marginTop: 10,
  },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10, height: 40 },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
  button: { height: 40, justifyContent: "center", marginVertical: 10 },
  loader: { position: "absolute", top: "10%", left: "50%", right: "50%" },
  biometricButton: { marginTop: 10, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 },
  biometricText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

export default LoginScreen;

