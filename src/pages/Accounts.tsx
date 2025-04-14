
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import BankLayout from '@/components/BankLayout';
import { useToast } from '@/components/ui/use-toast';

interface Account {
  id: string;
  accountType: string;
  balance: number;
  openingDate: string;
  branchId: string;
}

const Accounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1001',
      accountType: 'Checking',
      balance: 1500.00,
      openingDate: '2025-04-10',
      branchId: '1',
    },
    {
      id: '1002',
      accountType: 'Savings',
      balance: 5200.00,
      openingDate: '2025-03-15',
      branchId: '2',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    accountType: '',
    balance: '',
    openingDate: '',
    branchId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.id || !formData.accountType || !formData.balance || !formData.openingDate || !formData.branchId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new account
    const newAccount: Account = {
      id: formData.id,
      accountType: formData.accountType,
      balance: parseFloat(formData.balance),
      openingDate: formData.openingDate,
      branchId: formData.branchId,
    };

    setAccounts([...accounts, newAccount]);
    
    // Reset form
    setFormData({
      id: '',
      accountType: '',
      balance: '',
      openingDate: '',
      branchId: '',
    });

    toast({
      title: "Account created",
      description: `Account ${formData.id} has been successfully created`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Account Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Account ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Account ID"
                />
              </div>
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium mb-1">Account Type</label>
                <Input
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  placeholder="Account Type"
                />
              </div>
              <div>
                <label htmlFor="balance" className="block text-sm font-medium mb-1">Balance</label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="Balance"
                />
              </div>
              <div>
                <label htmlFor="openingDate" className="block text-sm font-medium mb-1">Opening Date</label>
                <Input
                  id="openingDate"
                  name="openingDate"
                  type="date"
                  value={formData.openingDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="branchId" className="block text-sm font-medium mb-1">Branch ID</label>
                <Input
                  id="branchId"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  placeholder="Branch ID"
                />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-5 mt-4">
                <Button type="submit" className="w-full md:w-auto">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Opening Date</TableHead>
                    <TableHead>Branch ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.accountType}</TableCell>
                      <TableCell>${account.balance.toFixed(2)}</TableCell>
                      <TableCell>{account.openingDate}</TableCell>
                      <TableCell>{account.branchId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </BankLayout>
  );
};

export default Accounts;
