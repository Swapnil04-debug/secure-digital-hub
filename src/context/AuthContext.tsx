
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Define types
interface UserWithMetadata extends User {
  // Add name property to the extended User type
  name?: string; 
}

type AuthContextType = {
  user: UserWithMetadata | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithMetadata | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (currentSession) {
          // Process user info to add name from metadata
          const userData: UserWithMetadata = currentSession.user;
          if (userData.user_metadata && userData.user_metadata.full_name) {
            userData.name = userData.user_metadata.full_name;
          }
          setUser(userData);
        } else {
          setUser(null);
        }
        setSession(currentSession);
        console.log('Auth state changed:', event, currentSession?.user?.email);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession) {
        // Process user info to add name from metadata
        const userData: UserWithMetadata = currentSession.user;
        if (userData.user_metadata && userData.user_metadata.full_name) {
          userData.name = userData.user_metadata.full_name;
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Process user info to add name from metadata
      if (data.user && data.user.user_metadata && data.user.user_metadata.full_name) {
        const userData = data.user as UserWithMetadata;
        userData.name = data.user.user_metadata.full_name;
        setUser(userData);
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user?.email}!`,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // First, register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Process user info to add name from metadata
      if (data.user) {
        const userData = data.user as UserWithMetadata;
        userData.name = name;
        setUser(userData);
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please verify your email.",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
