
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
  // User Profiles
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error in getUserProfile:', error);
      return null;
    }
  },
  
  createUserProfile: async (profile: Omit<UserProfile, 'created_at'>): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Unexpected error in createUserProfile:', error);
      return null;
    }
  },
  
  // Bank Accounts
  getAccountsByUserId: async (userId: string): Promise<BankAccount[]> => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching accounts:', error);
        return [];
      }
      
      return data as BankAccount[];
    } catch (error) {
      console.error('Unexpected error in getAccountsByUserId:', error);
      return [];
    }
  },
  
  createAccount: async (account: Omit<BankAccount, 'id'>): Promise<BankAccount | null> => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert(account)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bank account:', error);
        return null;
      }
      
      return data as BankAccount;
    } catch (error) {
      console.error('Unexpected error in createAccount:', error);
      return null;
    }
  },
  
  // Transactions
  getTransactionsByAccountId: async (accountId: string): Promise<Transaction[]> => {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
      
      return data as Transaction[];
    } catch (error) {
      console.error('Unexpected error in getTransactionsByAccountId:', error);
      return [];
    }
  },
  
  getAllUserTransactions: async (userId: string): Promise<Transaction[]> => {
    try {
      // Join bank_accounts with bank_transactions to get all transactions for user
      const { data, error } = await supabase
        .from('bank_accounts')
        .select(`
          *,
          bank_transactions(*)
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching all user transactions:', error);
        return [];
      }
      
      // Flatten the nested structure to get all transactions
      const transactions: Transaction[] = [];
      data.forEach(account => {
        if (account.bank_transactions && Array.isArray(account.bank_transactions)) {
          transactions.push(...account.bank_transactions);
        }
      });
      
      // Sort by created_at date
      return transactions.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Unexpected error in getAllUserTransactions:', error);
      return [];
    }
  },
  
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction | null> => {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating transaction:', error);
        return null;
      }
      
      return data as Transaction;
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
      // Start a transaction
      const { error } = await supabase.rpc('create_transfer', {
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        transfer_amount: amount,
        transfer_description: description
      });
      
      if (error) {
        console.error('Error creating transfer:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in createTransfer:', error);
      return false;
    }
  },
  
  // Handle deposit by creating a transaction and updating account balance
  deposit: async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('create_deposit', {
        account_id: accountId,
        deposit_amount: amount,
        deposit_description: description
      });
      
      if (error) {
        console.error('Error creating deposit:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in deposit:', error);
      return false;
    }
  },
  
  // Handle withdrawal by creating a transaction and updating account balance
  withdraw: async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('create_withdrawal', {
        account_id: accountId,
        withdrawal_amount: amount,
        withdrawal_description: description
      });
      
      if (error) {
        console.error('Error creating withdrawal:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected error in withdraw:', error);
      return false;
    }
  }
};
