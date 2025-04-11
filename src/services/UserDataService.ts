
// This service provides mock user data for demonstration purposes

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

/*
 * This service mimics interaction with a normalized database schema that includes:
 * - Users: Core user data (credentials, personal info)
 * - UserProfiles: Extended user information (contact details, preferences)
 * - AccountTypes: Different account categories (Savings, Checking, etc.)
 * - Accounts: Individual bank accounts owned by users
 * - TransactionTypes: Categories of financial transactions
 * - Transactions: Record of all financial activities
 * - Transfers: Records of money movements between accounts
 */

// Mock data to simulate backend responses
const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", balance: 5000 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", balance: 7500 },
  { id: 3, name: "Michael Johnson", email: "michael@example.com", balance: 2300 },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", balance: 10250 },
];

// Simulate API delays for more realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserDataService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      // Simulate network delay
      await delay(600);
      return [...mockUsers];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    try {
      await delay(400);
      const user = mockUsers.find(user => user.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      return {...user};
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    try {
      await delay(800);
      // Check if email already exists
      if (mockUsers.some(user => user.email === userData.email)) {
        throw new Error("Email already exists");
      }
      
      // Generate new ID (in a real API this would be handled by the database)
      const newId = Math.max(...mockUsers.map(user => user.id), 0) + 1;
      
      const newUser: User = {
        id: newId,
        ...userData
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      return {...newUser};
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    try {
      await delay(600);
      const userIndex = mockUsers.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Check for email uniqueness if changing email
      if (
        userData.email && 
        userData.email !== mockUsers[userIndex].email && 
        mockUsers.some(user => user.email === userData.email)
      ) {
        throw new Error("Email already exists");
      }
      
      // Update user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData
      };
      
      return {...mockUsers[userIndex]};
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    try {
      await delay(500);
      const userIndex = mockUsers.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Remove user
      mockUsers.splice(userIndex, 1);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // Health check - always returns connected for mock service
  checkHealth: async (): Promise<{ status: string }> => {
    await delay(300);
    return { status: "ok" };
  }
};
