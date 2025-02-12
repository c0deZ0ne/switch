import { BankAccount } from "../types";
import { nanoid } from "nanoid/non-secure"; // Optimized for React Native

export const generateBankDetails = (userId: string): BankAccount => {
  const accountNumber = generateRandomAccountNumber();
  const bankNames = ["Moniepoint Bank", "Kuda Bank", "GTBank", "Zenith Bank", "Access Bank"];

  return {
    id: nanoid(), //Generates a unique account ID
    userId,
    accountName: `User ${userId}'s Account`,
    accountNumber,
    balance: 0, // Start with zero balance
    currency: "NGN",
    type: "Savings", // Default account type
    bankName: bankNames[Math.floor(Math.random() * bankNames.length)], // Random bank name
    createdAt: new Date().toISOString(),
  };
};

// 🔹 Generate a random 10-digit account number
const generateRandomAccountNumber = (): string => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};
