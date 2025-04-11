
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserDataService } from "@/services/UserDataService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, UserPlus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

interface UserFormData {
  name: string;
  email: string;
  balance: string;
}

const DatabaseUsers = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    balance: "0",
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "failed"
  >("checking");

  // Check connection to Python backend
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch("http://localhost:5000/api/health", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Failed to connect to Python backend:", error);
        setConnectionStatus("failed");
      }
    };
    
    checkConnection();
  }, []);

  // Query for fetching all users
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: UserDataService.getAllUsers,
    enabled: connectionStatus === "connected",
  });

  // Mutation for creating a user
  const createUserMutation = useMutation({
    mutationFn: UserDataService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User Created",
        description: "The user has been successfully added to the database.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      UserDataService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User Updated",
        description: "The user has been successfully updated in the database.",
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: UserDataService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User Deleted",
        description: "The user has been successfully removed from the database.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: formData.name,
      email: formData.email,
      balance: parseFloat(formData.balance),
    };
    createUserMutation.mutate(userData);
  };

  // Handle form submission for editing user
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;

    const userData = {
      name: formData.name,
      email: formData.email,
      balance: parseFloat(formData.balance),
    };
    updateUserMutation.mutate({ id: currentUserId, userData });
  };

  // Open edit dialog and populate form with user data
  const openEditDialog = (user: User) => {
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      balance: user.balance.toString(),
    });
    setIsEditDialogOpen(true);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      balance: "0",
    });
    setCurrentUserId(null);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  if (connectionStatus === "checking") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-bank-primary mx-auto" />
            <h2 className="mt-4 text-xl font-medium">Checking connection...</h2>
            <p className="mt-2 text-gray-500">Connecting to Python backend</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (connectionStatus === "failed") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-red-500">Connection Failed</CardTitle>
              <CardDescription>
                Could not connect to the Python backend server
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The application could not establish a connection to your Python backend.
                  This could be due to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Python backend server is not running</li>
                  <li>CORS policy issues preventing the connection</li>
                  <li>Different base URL than expected (http://localhost:5000)</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-4">
                  <h3 className="font-medium text-amber-800">Python Backend Setup Instructions</h3>
                  <p className="mt-2 text-amber-700 text-sm">
                    Here's a minimal example of a Python Flask API with SQLite that would work with this frontend:
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto mt-2">
{`# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        balance REAL NOT NULL DEFAULT 0
    )
    ''')
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

# Get all users
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

# Get a single user
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(user))

# Create a new user
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if not data or not all(key in data for key in ['name', 'email']):
        return jsonify({"error": "Missing required fields"}), 400
    
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO users (name, email, balance) VALUES (?, ?, ?)',
            (data['name'], data['email'], data.get('balance', 0))
        )
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            "id": user_id,
            "name": data['name'],
            "email": data['email'],
            "balance": data.get('balance', 0)
        }), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email already exists"}), 400

# Update a user
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if user is None:
        conn.close()
        return jsonify({"error": "User not found"}), 404
    
    # Build the update query dynamically based on provided fields
    fields = []
    values = []
    for key in ['name', 'email', 'balance']:
        if key in data:
            fields.append(f'{key} = ?')
            values.append(data[key])
    
    if not fields:
        conn.close()
        return jsonify({"error": "No valid fields to update"}), 400
    
    values.append(user_id)  # Add user_id for WHERE clause
    
    try:
        conn.execute(
            f'UPDATE users SET {", ".join(fields)} WHERE id = ?',
            tuple(values)
        )
        conn.commit()
        
        # Get updated user
        updated_user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        
        return jsonify(dict(updated_user))
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email already exists"}), 400

# Delete a user
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if user is None:
        conn.close()
        return jsonify({"error": "User not found"}), 404
    
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
`}
                  </pre>
                  
                  <div className="mt-4 text-sm text-amber-700">
                    <p className="font-medium">Requirements:</p>
                    <code>pip install flask flask-cors</code>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setConnectionStatus("checking")}
                className="bg-bank-primary hover:bg-bank-primary/90"
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Database</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bank-primary hover:bg-bank-primary/90">
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details of the new user to add to the database.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="balance" className="text-sm font-medium">
                      Balance
                    </label>
                    <Input
                      id="balance"
                      name="balance"
                      type="number"
                      step="0.01"
                      value={formData.balance}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-bank-primary hover:bg-bank-primary/90"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Records</CardTitle>
            <CardDescription>
              View and manage user data from the SQL database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-bank-primary mx-auto" />
                <p className="mt-2">Loading user data...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8 text-red-500">
                <p>Failed to load user data from the database.</p>
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
                  variant="outline"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                          ${user.balance.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleteUserMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No users found in the database.</p>
                <p className="text-sm mt-2">
                  Click "Add User" to create your first record.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details for this user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-balance" className="text-sm font-medium">
                  Balance
                </label>
                <Input
                  id="edit-balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-bank-primary hover:bg-bank-primary/90"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DatabaseUsers;
