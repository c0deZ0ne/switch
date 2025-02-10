
export interface BankAccount {
  id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: "Savings" | "Current" | "Fixed Deposit"; // Add more types if needed
  bankName: string;
  createdAt: string; // ISO date string
}

    export type User = {
        id: string;
        name: string;
        email: string;
        phone: string;
        password: string;
        biometricEnabled: boolean;
        createdAt: string; // ISO date format
        isAuthenticated:boolean;
        lastEvent:"Login"|"Logout"|"Register"|null;
        lastEventTime:Date|null|string;
        lastEventMessage:string;
        bankAccounts:BankAccount[];
      };
      