
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface BankAccount {
  id: string;
  account_id: string;
  account_type: string;
  opening_date: string;
  balance: number;
  user_id: string;
  account_number: string;
  status: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
  related_account_id?: string;
}

export const DatabaseService = {
  // User Profiles - using mock functions until tables are created
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      // Check if user_profiles table exists
      const { error: checkError } = await supabase
        .from('accounts')
        .select('*')
        .limit(1);

      // If table doesn't exist yet, return mock data
      if (checkError) {
        console.log('Using mock data for user profile:', checkError.message);
        return {
          id: userId,
          full_name: 'Demo User',
          email: 'demo@example.com',
          created_at: new Date().toISOString(),
        };
      }
      
      // If we get here in the future when table exists
      return null;
    } catch (error) {
      console.error('Unexpected error in getUserProfile:', error);
      return null;
    }
  },
  
  createUserProfile: async (profile: Omit<UserProfile, 'created_at'>): Promise<UserProfile | null> => {
    try {
      // Mock successful creation
      return {
        ...profile,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Unexpected error in createUserProfile:', error);
      return null;
    }
  },
  
  // Bank Accounts - using mock functions until tables are created
  getAccountsByUserId: async (userId: string): Promise<BankAccount[]> => {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          account_id: '101',
          account_type: 'Checking',
          opening_date: new Date().toISOString(),
          balance: 5000,
          user_id: userId,
          account_number: '1234567890',
          status: 'Active'
        }
      ];
    } catch (error) {
      console.error('Unexpected error in getAccountsByUserId:', error);
      return [];
    }
  },
  
  createAccount: async (account: Omit<BankAccount, 'id'>): Promise<BankAccount | null> => {
    try {
      // Mock successful creation
      return {
        ...account,
        id: Math.random().toString(36).substring(7),
      };
    } catch (error) {
      console.error('Unexpected error in createAccount:', error);
      return null;
    }
  },
  
  // Transactions - using mock functions until tables are created
  getTransactionsByAccountId: async (accountId: string): Promise<Transaction[]> => {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          account_id: accountId,
          type: 'Deposit',
          amount: 1000,
          description: 'Initial deposit',
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Unexpected error in getTransactionsByAccountId:', error);
      return [];
    }
  },
  
  getAllUserTransactions: async (userId: string): Promise<Transaction[]> => {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          account_id: '101',
          type: 'Deposit',
          amount: 1000,
          description: 'Initial deposit',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          account_id: '101',
          type: 'Withdrawal',
          amount: 200,
          description: 'ATM withdrawal',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch (error) {
      console.error('Unexpected error in getAllUserTransactions:', error);
      return [];
    }
  },
  
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> => {
    try {
      // Mock successful creation
      return {
        ...transaction,
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Unexpected error in createTransaction:', error);
      return null;
    }
  },
  
  // Helper function for transfers
  createTransfer: async (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ): Promise<boolean> => {
    try {
      // Mock successful transfer
      console.log(`Transfer from ${fromAccountId} to ${toAccountId}: $${amount}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in createTransfer:', error);
      return false;
    }
  },
  
  // Handle deposit by creating a transaction and updating account balance
  deposit: async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      // Mock successful deposit
      console.log(`Deposit to ${accountId}: $${amount}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in deposit:', error);
      return false;
    }
  },
  
  // Handle withdrawal by creating a transaction and updating account balance
  withdraw: async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      // Mock successful withdrawal
      console.log(`Withdrawal from ${accountId}: $${amount}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in withdraw:', error);
      return false;
    }
  }
};
