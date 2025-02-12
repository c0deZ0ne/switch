import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { router, usePathname } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const CustomDrawer = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = new Animated.Value(drawerOpen ? 0 : -250);
  const pathname = usePathname();

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
      {/* Drawer Overlay */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}

      {/* Drawer Menu */}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <TouchableOpacity onPress={() => toggleDrawer()}>
          <Text style={styles.item}></Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main App Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
        <AntDesign name="menu-fold" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(187, 29, 29, 0.2)",
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
    fontSize: 8,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "red",
  },
  active: {
    backgroundColor: "#f0f0f0",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});

export default CustomDrawer;
