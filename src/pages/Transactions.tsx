
import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import BankLayout from '@/components/BankLayout';
import { useBank, Transaction as BankTransaction } from '@/context/BankContext';

const Transactions = () => {
  const { toast } = useToast();
  const { accounts, transactions: bankTransactions } = useBank();
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    accountId: '',
    type: '',
    amount: '',
    description: '',
    timestamp: new Date().toISOString().split('T')[0]
  });
  
  // Load transactions from BankContext
  useEffect(() => {
    if (bankTransactions.length > 0) {
      setTransactions(bankTransactions);
    }
  }, [bankTransactions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.id || !formData.type || !formData.amount || !formData.accountId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate ID
    if (transactions.some(t => t.id === formData.id)) {
      toast({
        title: "Duplicate ID",
        description: "A transaction with this ID already exists",
        variant: "destructive",
      });
      return;
    }

    // Add new transaction (for demo purposes only, real apps would use BankContext methods)
    const newTransaction: BankTransaction = {
      id: formData.id,
      accountId: formData.accountId,
      type: formData.type as BankTransaction['type'],
      amount: parseFloat(formData.amount),
      description: formData.description || 'Transaction',
      timestamp: formData.timestamp || new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);
    
    // Reset form
    setFormData({
      id: '',
      accountId: '',
      type: '',
      amount: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Transaction added",
      description: `Transaction ${formData.id} has been successfully recorded`,
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Transaction ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Transaction ID"
                />
              </div>
              <div>
                <label htmlFor="accountId" className="block text-sm font-medium mb-1">Account</label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) => handleSelectChange('accountId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} - {account.accountNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">Transaction Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deposit">Deposit</SelectItem>
                    <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <Input
                  id="timestamp"
                  name="timestamp"
                  type="date"
                  value={formData.timestamp}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
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
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.accountId}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
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
