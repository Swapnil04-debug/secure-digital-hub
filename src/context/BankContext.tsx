
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

// Define types
export type AccountType = 'Savings' | 'Checking' | 'Investment';

export type Account = {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  status: 'Active' | 'Inactive' | 'Closed';
  createdAt: string;
};

export type TransactionType = 'Deposit' | 'Withdrawal' | 'Transfer';

export type Transaction = {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  relatedAccountId?: string;
  timestamp: string;
};

type BankContextType = {
  accounts: Account[];
  transactions: Transaction[];
  isLoading: boolean;
  createAccount: (accountType: AccountType) => Promise<boolean>;
  deposit: (accountId: string, amount: number, description: string) => Promise<boolean>;
  withdraw: (accountId: string, amount: number, description: string) => Promise<boolean>;
  transfer: (fromAccountId: string, toAccountId: string, amount: number, description: string) => Promise<boolean>;
  getAccountById: (id: string) => Account | undefined;
  getAccountTransactions: (accountId: string) => Transaction[];
};

// Create the context with default values
const BankContext = createContext<BankContextType>({
  accounts: [],
  transactions: [],
  isLoading: true,
  createAccount: async () => false,
  deposit: async () => false,
  withdraw: async () => false,
  transfer: async () => false,
  getAccountById: () => undefined,
  getAccountTransactions: () => [],
});

// Mock data generator functions
const generateAccountNumber = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Initialize with mock data
const initializeMockBankData = (userId: string) => {
  const accounts: Account[] = [
    {
      id: '1',
      customerId: userId,
      accountNumber: '12345678',
      accountType: 'Savings',
      balance: 5000,
      status: 'Active',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      customerId: userId,
      accountNumber: '87654321',
      accountType: 'Checking',
      balance: 2500,
      status: 'Active',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      accountId: '1',
      type: 'Deposit',
      amount: 1000,
      description: 'Initial deposit',
      timestamp: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      accountId: '1',
      type: 'Deposit',
      amount: 500,
      description: 'Salary',
      timestamp: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      accountId: '1',
      type: 'Withdrawal',
      amount: 200,
      description: 'ATM withdrawal',
      timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      accountId: '2',
      type: 'Deposit',
      amount: 2500,
      description: 'Initial deposit',
      timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      accountId: '1',
      type: 'Transfer',
      amount: 300,
      description: 'Transfer to Checking',
      relatedAccountId: '2',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      accountId: '2',
      type: 'Transfer',
      amount: 300,
      description: 'Transfer from Savings',
      relatedAccountId: '1',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return { accounts, transactions };
};

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bank data when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, this would fetch from an API
      const mockData = initializeMockBankData(user.id);
      setAccounts(mockData.accounts);
      setTransactions(mockData.transactions);
    } else {
      setAccounts([]);
      setTransactions([]);
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);

  const createAccount = async (accountType: AccountType): Promise<boolean> => {
    if (!user) return false;

    return new Promise((resolve) => {
      setTimeout(() => {
        const newAccount: Account = {
          id: (accounts.length + 1).toString(),
          customerId: user.id,
          accountNumber: generateAccountNumber(),
          accountType: accountType,
          balance: 0,
          status: 'Active',
          createdAt: new Date().toISOString(),
        };

        setAccounts((prev) => [...prev, newAccount]);
        
        toast({
          title: "Account Created",
          description: `Your new ${accountType} account has been created successfully`,
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const deposit = async (accountId: string, amount: number, description: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = accounts.find((a) => a.id === accountId);
        
        if (!account) {
          toast({
            title: "Error",
            description: "Account not found",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        if (amount <= 0) {
          toast({
            title: "Error",
            description: "Amount must be greater than zero",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        // Update account balance
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === accountId ? { ...a, balance: a.balance + amount } : a
          )
        );

        // Create transaction record
        const newTransaction: Transaction = {
          id: (transactions.length + 1).toString(),
          accountId,
          type: 'Deposit',
          amount,
          description,
          timestamp: new Date().toISOString(),
        };

        setTransactions((prev) => [...prev, newTransaction]);
        
        toast({
          title: "Deposit Successful",
          description: `$${amount.toFixed(2)} has been deposited to your account`,
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const withdraw = async (accountId: string, amount: number, description: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = accounts.find((a) => a.id === accountId);
        
        if (!account) {
          toast({
            title: "Error",
            description: "Account not found",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        if (amount <= 0) {
          toast({
            title: "Error",
            description: "Amount must be greater than zero",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        if (account.balance < amount) {
          toast({
            title: "Error",
            description: "Insufficient funds",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        // Update account balance
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === accountId ? { ...a, balance: a.balance - amount } : a
          )
        );

        // Create transaction record
        const newTransaction: Transaction = {
          id: (transactions.length + 1).toString(),
          accountId,
          type: 'Withdrawal',
          amount,
          description,
          timestamp: new Date().toISOString(),
        };

        setTransactions((prev) => [...prev, newTransaction]);
        
        toast({
          title: "Withdrawal Successful",
          description: `$${amount.toFixed(2)} has been withdrawn from your account`,
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const transfer = async (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fromAccount = accounts.find((a) => a.id === fromAccountId);
        const toAccount = accounts.find((a) => a.id === toAccountId);
        
        if (!fromAccount || !toAccount) {
          toast({
            title: "Error",
            description: "One or both accounts not found",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        if (amount <= 0) {
          toast({
            title: "Error",
            description: "Amount must be greater than zero",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        if (fromAccount.balance < amount) {
          toast({
            title: "Error",
            description: "Insufficient funds",
            variant: "destructive",
          });
          resolve(false);
          return;
        }

        // Update account balances
        setAccounts((prev) =>
          prev.map((a) => {
            if (a.id === fromAccountId) {
              return { ...a, balance: a.balance - amount };
            }
            if (a.id === toAccountId) {
              return { ...a, balance: a.balance + amount };
            }
            return a;
          })
        );

        // Create transaction records for both accounts
        const fromTransaction: Transaction = {
          id: (transactions.length + 1).toString(),
          accountId: fromAccountId,
          type: 'Transfer',
          amount,
          description: `${description} (to ${toAccount.accountNumber})`,
          relatedAccountId: toAccountId,
          timestamp: new Date().toISOString(),
        };

        const toTransaction: Transaction = {
          id: (transactions.length + 2).toString(),
          accountId: toAccountId,
          type: 'Transfer',
          amount,
          description: `${description} (from ${fromAccount.accountNumber})`,
          relatedAccountId: fromAccountId,
          timestamp: new Date().toISOString(),
        };

        setTransactions((prev) => [...prev, fromTransaction, toTransaction]);
        
        toast({
          title: "Transfer Successful",
          description: `$${amount.toFixed(2)} has been transferred to the destination account`,
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const getAccountById = (id: string): Account | undefined => {
    return accounts.find((account) => account.id === id);
  };

  const getAccountTransactions = (accountId: string): Transaction[] => {
    return transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return (
    <BankContext.Provider
      value={{
        accounts,
        transactions,
        isLoading,
        createAccount,
        deposit,
        withdraw,
        transfer,
        getAccountById,
        getAccountTransactions,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => useContext(BankContext);
