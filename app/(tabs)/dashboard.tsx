import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Carousel, Button } from "@ant-design/react-native";
import { RootState } from "../redux/store";
import { BankAccount, Transaction } from "../types";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Slot, useRouter, useSegments } from "expo-router";
import { Empty, EmptyProps } from "antd-mobile";

const DashboardScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const accounts: BankAccount[] = useSelector(
    (state: RootState) => state.user.bankAccounts
  );
  const transactions: Transaction[] = useSelector(
    (state: RootState) => state.user?.transactions || []
  );
  const segments = useSegments();

  useEffect(() => {
    if (!user.isAuthenticated && segments?.[0] !== "/") {
      router.replace("/(auth)/login");
    }
  }, [user.isAuthenticated, segments]);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />

      <Text style={styles.greeting}>Welcome, {user.name}!</Text>
      {accounts.length > 0 && (
        <Carousel
          style={styles.carousel}
          selectedIndex={0}
          dots={true}
          infinite
          autoplay
        >
          {accounts.map((item) => (
            <View style={[styles.accountCard, styles.shadow]} key={item.id}>
              <FontAwesome5 name="university" size={24} color="#4A90E2" />
              <Text style={styles.accountType}>{item.type}</Text>
              <Text style={styles.accountBalance}>
                {item.currency} {item.balance.toLocaleString()}
              </Text>
            </View>
          ))}
        </Carousel>
      )}
      <Text style={styles.sectionTitle}>Transaction History</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.transactionItem, styles.shadow]}>
              <Text>
                {item.type.toLocaleString()} {item.currency}
              </Text>
              <Text>{item.id.toLocaleString()}</Text>
              <Text
                style={{ color: item.status == "Success" ? "green" : "red" }}
              >
                {item.status.toLocaleString()}
              </Text>
              <Text style={{ color: item.amount > 0 ? "green" : "red" }}>
                {item.amount > 0 ? "+" : ""}
                {item.amount.toLocaleString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Empty />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
  },
  greeting: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  carousel: { height: 200 },
  accountCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  accountType: { fontSize: 16, fontWeight: "bold" },
  accountBalance: { fontSize: 20, fontWeight: "bold", marginTop: 5 },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default DashboardScreen;
