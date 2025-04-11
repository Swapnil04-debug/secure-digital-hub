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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, UserPlus, Edit, Trash2, Database } from "lucide-react";
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

interface TableSchema {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
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
    "checking" | "connected"
  >("checking");
  const [showSchemaInfo, setShowSchemaInfo] = useState(false);

  const databaseSchema: TableSchema[] = [
    {
      name: "Users",
      description: "Stores core user authentication and identity information",
      columns: [
        { name: "user_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for each user" },
        { name: "username", type: "VARCHAR(50)", constraints: "NOT NULL, UNIQUE", description: "User's login name" },
        { name: "email", type: "VARCHAR(100)", constraints: "NOT NULL, UNIQUE", description: "User's email address" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Securely hashed password" },
        { name: "first_name", type: "VARCHAR(50)", constraints: "NOT NULL", description: "User's first name" },
        { name: "last_name", type: "VARCHAR(50)", constraints: "NOT NULL", description: "User's last name" },
        { name: "date_created", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP", description: "When the user account was created" },
        { name: "last_login", type: "TIMESTAMP", constraints: "NULL", description: "Last successful login time" },
        { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE", description: "Whether the user account is active" }
      ]
    },
    {
      name: "UserProfiles",
      description: "Contains extended user information",
      columns: [
        { name: "profile_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for each profile" },
        { name: "user_id", type: "INTEGER", constraints: "FOREIGN KEY (Users.user_id)", description: "Reference to the Users table" },
        { name: "address", type: "VARCHAR(200)", constraints: "NULL", description: "User's street address" },
        { name: "city", type: "VARCHAR(100)", constraints: "NULL", description: "User's city" },
        { name: "state", type: "VARCHAR(50)", constraints: "NULL", description: "User's state/province" },
        { name: "postal_code", type: "VARCHAR(20)", constraints: "NULL", description: "User's ZIP/postal code" },
        { name: "country", type: "VARCHAR(50)", constraints: "NULL", description: "User's country" },
        { name: "phone_number", type: "VARCHAR(20)", constraints: "NULL", description: "User's contact number" },
        { name: "date_of_birth", type: "DATE", constraints: "NULL", description: "User's birth date" },
        { name: "profile_picture_url", type: "VARCHAR(255)", constraints: "NULL", description: "URL to profile picture" }
      ]
    },
    {
      name: "AccountTypes",
      description: "Defines different types of bank accounts",
      columns: [
        { name: "account_type_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for account types" },
        { name: "type_name", type: "VARCHAR(50)", constraints: "NOT NULL, UNIQUE", description: "Name of account type (Savings, Checking, etc.)" },
        { name: "description", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Description of account type" },
        { name: "interest_rate", type: "DECIMAL(5,2)", constraints: "DEFAULT 0.00", description: "Interest rate for this account type" },
        { name: "minimum_balance", type: "DECIMAL(10,2)", constraints: "DEFAULT 0.00", description: "Required minimum balance" }
      ]
    },
    {
      name: "Accounts",
      description: "Bank accounts owned by users",
      columns: [
        { name: "account_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for each account" },
        { name: "user_id", type: "INTEGER", constraints: "FOREIGN KEY (Users.user_id)", description: "User who owns this account" },
        { name: "account_type_id", type: "INTEGER", constraints: "FOREIGN KEY (AccountTypes.account_type_id)", description: "Type of this account" },
        { name: "account_number", type: "VARCHAR(20)", constraints: "NOT NULL, UNIQUE", description: "Unique account number" },
        { name: "balance", type: "DECIMAL(12,2)", constraints: "NOT NULL DEFAULT 0.00", description: "Current account balance" },
        { name: "currency_code", type: "CHAR(3)", constraints: "NOT NULL DEFAULT 'USD'", description: "Currency of the account" },
        { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE", description: "Whether the account is active" },
        { name: "date_opened", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP", description: "When the account was opened" },
        { name: "date_closed", type: "TIMESTAMP", constraints: "NULL", description: "When the account was closed (if applicable)" }
      ]
    },
    {
      name: "TransactionTypes",
      description: "Types of financial transactions",
      columns: [
        { name: "transaction_type_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for transaction types" },
        { name: "type_name", type: "VARCHAR(50)", constraints: "NOT NULL, UNIQUE", description: "Name of transaction type (Deposit, Withdrawal, etc.)" },
        { name: "description", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Description of this transaction type" },
        { name: "affects_balance", type: "VARCHAR(10)", constraints: "NOT NULL", description: "How it affects balance (credit, debit, both)" }
      ]
    },
    {
      name: "Transactions",
      description: "Record of all financial transactions",
      columns: [
        { name: "transaction_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for each transaction" },
        { name: "account_id", type: "INTEGER", constraints: "FOREIGN KEY (Accounts.account_id)", description: "Account involved in transaction" },
        { name: "transaction_type_id", type: "INTEGER", constraints: "FOREIGN KEY (TransactionTypes.transaction_type_id)", description: "Type of transaction" },
        { name: "amount", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Amount of the transaction" },
        { name: "running_balance", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Account balance after transaction" },
        { name: "description", type: "VARCHAR(255)", constraints: "NULL", description: "Transaction description or notes" },
        { name: "transaction_date", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP", description: "When the transaction occurred" },
        { name: "status", type: "VARCHAR(20)", constraints: "DEFAULT 'completed'", description: "Transaction status" },
        { name: "reference_number", type: "VARCHAR(50)", constraints: "UNIQUE", description: "Unique reference for the transaction" }
      ]
    },
    {
      name: "Transfers",
      description: "Records transfers between accounts",
      columns: [
        { name: "transfer_id", type: "INTEGER", constraints: "PRIMARY KEY, AUTO_INCREMENT", description: "Unique identifier for each transfer" },
        { name: "transaction_id", type: "INTEGER", constraints: "FOREIGN KEY (Transactions.transaction_id)", description: "Associated transaction" },
        { name: "from_account_id", type: "INTEGER", constraints: "FOREIGN KEY (Accounts.account_id)", description: "Source account" },
        { name: "to_account_id", type: "INTEGER", constraints: "FOREIGN KEY (Accounts.account_id)", description: "Destination account" },
        { name: "amount", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Amount transferred" },
        { name: "transfer_date", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP", description: "When the transfer occurred" },
        { name: "status", type: "VARCHAR(20)", constraints: "DEFAULT 'completed'", description: "Transfer status" },
        { name: "notes", type: "VARCHAR(255)", constraints: "NULL", description: "Any notes about the transfer" }
      ]
    }
  ];

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await UserDataService.checkHealth();
        setConnectionStatus("connected");
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setConnectionStatus("connected");
      }
    };
    
    checkConnection();
  }, []);

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: UserDataService.getAllUsers,
    enabled: connectionStatus === "connected",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: formData.name,
      email: formData.email,
      balance: parseFloat(formData.balance),
    };
    createUserMutation.mutate(userData);
  };

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

  const openEditDialog = (user: User) => {
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      balance: user.balance.toString(),
    });
    setIsEditDialogOpen(true);
  };

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
            <h2 className="mt-4 text-xl font-medium">Loading user data...</h2>
            <p className="mt-2 text-gray-500">Connecting to database service</p>
          </div>
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
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowSchemaInfo(!showSchemaInfo)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {showSchemaInfo ? "Hide Schema" : "Show Schema"}
            </Button>
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
        </div>
        
        {showSchemaInfo && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                Complete relational database structure for the banking application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tables">
                <TabsList className="mb-4">
                  <TabsTrigger value="tables">Table Structure</TabsTrigger>
                  <TabsTrigger value="erd">Entity Relationships</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tables">
                  <Accordion type="single" collapsible className="w-full">
                    {databaseSchema.map((table, index) => (
                      <AccordionItem key={index} value={`table-${index}`}>
                        <AccordionTrigger className="font-medium">
                          <span className="flex items-center">
                            <Database className="h-4 w-4 mr-2" /> {table.name}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-2 mb-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">{table.description}</p>
                          </div>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Column Name</TableHead>
                                  <TableHead>Data Type</TableHead>
                                  <TableHead>Constraints</TableHead>
                                  <TableHead>Description</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {table.columns.map((column, colIndex) => (
                                  <TableRow key={colIndex}>
                                    <TableCell className="font-mono text-sm">{column.name}</TableCell>
                                    <TableCell className="font-mono text-sm">{column.type}</TableCell>
                                    <TableCell className="font-mono text-sm">{column.constraints}</TableCell>
                                    <TableCell className="text-sm">{column.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="erd">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-4">Entity Relationship Diagram</h3>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <pre className="p-4 bg-white rounded-md border text-xs leading-relaxed">
{`Users (1) --< UserProfiles (1)
      |
      +---< Accounts (N)
                |
                +---< Transactions (N)
                |        |
                |        +--- TransactionTypes (1)
                |
                +---< Transfers (N) >---- Accounts (destination)
                         |
                         +---- Transactions (1)`}
                        </pre>
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Relationship Legend:</h4>
                          <ul className="text-sm list-disc ml-5 space-y-1">
                            <li><span className="font-semibold">Users to UserProfiles</span>: One-to-one (Each user has one profile)</li>
                            <li><span className="font-semibold">Users to Accounts</span>: One-to-many (A user can have multiple accounts)</li>
                            <li><span className="font-semibold">Accounts to Transactions</span>: One-to-many (An account can have many transactions)</li>
                            <li><span className="font-semibold">TransactionTypes to Transactions</span>: One-to-many (A transaction type can be used in many transactions)</li>
                            <li><span className="font-semibold">Accounts to Transfers</span>: One-to-many (An account can be involved in many transfers)</li>
                            <li><span className="font-semibold">Transactions to Transfers</span>: One-to-one (A transfer is associated with one transaction)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Records</CardTitle>
            <CardDescription>
              View and manage user data from the database
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
