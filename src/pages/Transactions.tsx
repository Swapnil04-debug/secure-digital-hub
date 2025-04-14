
import React, { useState } from 'react';
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

interface Transaction {
  id: string;
  transactionType: string;
  amount: number;
  date: string;
  accountId: string;
}

const Transactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      transactionType: 'Deposit',
      amount: 500.00,
      date: '2025-01-15',
      accountId: '1',
    },
    {
      id: '2',
      transactionType: 'Withdrawal',
      amount: 200.00,
      date: '2025-01-20',
      accountId: '1',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    transactionType: '',
    amount: '',
    date: '',
    accountId: '',
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
    if (!formData.id || !formData.transactionType || !formData.amount || !formData.date || !formData.accountId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new transaction
    const newTransaction: Transaction = {
      id: formData.id,
      transactionType: formData.transactionType,
      amount: parseFloat(formData.amount),
      date: formData.date,
      accountId: formData.accountId,
    };

    setTransactions([...transactions, newTransaction]);
    
    // Reset form
    setFormData({
      id: '',
      transactionType: '',
      amount: '',
      date: '',
      accountId: '',
    });

    toast({
      title: "Transaction added",
      description: `Transaction ${formData.id} has been successfully recorded`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Transaction ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Transaction ID"
                />
              </div>
              <div>
                <label htmlFor="transactionType" className="block text-sm font-medium mb-1">Transaction Type</label>
                <Input
                  id="transactionType"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  placeholder="Transaction Type"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="accountId" className="block text-sm font-medium mb-1">Account ID</label>
                <Input
                  id="accountId"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleChange}
                  placeholder="Account ID"
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
            <CardTitle>Transactions List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Account ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.transactionType}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.accountId}</TableCell>
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

export default Transactions;
