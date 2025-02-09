import React from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../redux/apiSlice";
import { setUser } from "../redux/userSlice";
import { useRouter } from "expo-router";

// 📌 Define validation schema
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const result = await loginUser(values).unwrap();
          dispatch(setUser(result.name)); // Save user to Redux state
        } catch (error) {
          setErrors({ password: "Invalid credentials" });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username || ""}
          />
          {touched.username && errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password || ""}
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Button
            title={isSubmitting || isLoading ? "Logging in..." : "Login"}
            onPress={() => handleSubmit} // ✅ Fixed
            disabled={isSubmitting || isLoading}
          />

          <Button
            title="Sign Up"
            onPress={() => router.push("/(auth)/signup")}
          />
        </View>
      )}
    </Formik>
  );
};

// 📌 Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default LoginScreen;
