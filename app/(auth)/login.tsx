import React from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useLoginUserMutation } from "../redux/apiSlice";
import { Button } from "@ant-design/react-native";
import CustomButton from "../components/CustomButton";

const loginSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser, { isLoading ,isError,error}] = useLoginUserMutation();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      Keyboard.dismiss(); 
      console.log("Submitting values:", values);

      try {
        const res= await loginUser(values).unwrap();
        // dispatch(loginSuccess({ user, token }));
        console.log(res)
        // router.replace("/(tabs)/home");
      } catch (error) {
       
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      {formik.isSubmitting || isLoading ? (
        <ActivityIndicator size="large" color="blue" />
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
        <CustomButton
         onPress={(e: React.FormEvent<HTMLFormElement> | undefined)=>formik.handleSubmit(e)}
         disabled={formik.isSubmitting || isLoading}
         buttonStyle={styles.button}
         title={formik.isSubmitting || isLoading ? "Logging in..." : "Login"} 

        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10,height:40 },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
  button:{height:40, justifyContent:"center"}
});

export default LoginScreen;
