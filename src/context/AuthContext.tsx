
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Mock user data (would be replaced by actual API calls)
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, store hashed passwords only
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('bankUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('bankUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          // Create a user object without the password
          const { password: _, ...safeUser } = foundUser;
          setUser(safeUser);
          localStorage.setItem('bankUser', JSON.stringify(safeUser));
          toast({
            title: "Login successful",
            description: `Welcome back, ${safeUser.name}!`,
          });
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          resolve(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userExists = mockUsers.some((u) => u.email === email);

        if (userExists) {
          toast({
            title: "Registration failed",
            description: "Email already in use",
            variant: "destructive",
          });
          resolve(false);
        } else {
          // In a real app, this would add to the database
          const newUser = {
            id: (mockUsers.length + 1).toString(),
            name,
            email,
          };
          setUser(newUser);
          localStorage.setItem('bankUser', JSON.stringify(newUser));
          toast({
            title: "Registration successful",
            description: "Your account has been created",
          });
          resolve(true);
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bankUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
