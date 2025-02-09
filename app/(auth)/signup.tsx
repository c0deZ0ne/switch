import React from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { useRegisterUserMutation } from "../redux/apiSlice";
import { setUser } from "../redux/userSlice";

// 📌 Define validation schema
const signupSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignupScreen = () => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ Use Expo Router

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={signupSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const result = await registerUser(values).unwrap();
          dispatch(setUser(result.name)); // ✅ Save user to Redux
          router.replace("/(tabs)/home"); // ✅ Navigate to home after signup
        } catch (error) {
          setErrors({ email: "Signup failed. Try a different email." });
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

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            keyboardType="email-address"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email || ""}
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
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
            title={isSubmitting || isLoading ? "Signing up..." : "Sign Up"}
            onPress={() => handleSubmit()} // ✅ Direct function reference
            disabled={isSubmitting || isLoading}
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

export default SignupScreen;
