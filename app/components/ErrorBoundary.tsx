import React, { Component, ReactNode } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
       NavigationBar.setBackgroundColorAsync("red");
    
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Something went wrong! 😢</Text>
          <Button title="Try Again" onPress={this.resetError} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", fontSize: 18, marginBottom: 10 },
});

export default ErrorBoundary;
