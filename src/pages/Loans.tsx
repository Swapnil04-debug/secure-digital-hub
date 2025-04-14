
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

interface Loan {
  id: string;
  loanType: string;
  date: string;
  amount: number;
  duration: number;
  installment: number;
  customerId: string;
  branchId: string;
}

const Loans = () => {
  const { toast } = useToast();
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '2001',
      loanType: 'Home',
      date: '2025-04-01',
      amount: 250000.00,
      duration: 360,
      installment: 1388.89,
      customerId: '101',
      branchId: '1',
    },
    {
      id: '2002',
      loanType: 'Auto',
      date: '2025-03-15',
      amount: 35000.00,
      duration: 60,
      installment: 645.00,
      customerId: '102',
      branchId: '2',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    loanType: '',
    date: '',
    amount: '',
    duration: '',
    installment: '',
    customerId: '',
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
    if (!formData.id || !formData.loanType || !formData.date || !formData.amount || !formData.customerId || !formData.branchId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new loan
    const newLoan: Loan = {
      id: formData.id,
      loanType: formData.loanType,
      date: formData.date,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration) || 0,
      installment: parseFloat(formData.installment) || 0,
      customerId: formData.customerId,
      branchId: formData.branchId,
    };

    setLoans([...loans, newLoan]);
    
    // Reset form
    setFormData({
      id: '',
      loanType: '',
      date: '',
      amount: '',
      duration: '',
      installment: '',
      customerId: '',
      branchId: '',
    });

    toast({
      title: "Loan added",
      description: `Loan ${formData.id} has been successfully added`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Loan Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Loan ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Loan ID"
                />
              </div>
              <div>
                <label htmlFor="loanType" className="block text-sm font-medium mb-1">Loan Type</label>
                <Input
                  id="loanType"
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  placeholder="Loan Type"
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
                <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (months)</label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration"
                />
              </div>
              <div>
                <label htmlFor="installment" className="block text-sm font-medium mb-1">Installment</label>
                <Input
                  id="installment"
                  name="installment"
                  type="number"
                  step="0.01"
                  value={formData.installment}
                  onChange={handleChange}
                  placeholder="Installment"
                />
              </div>
              <div>
                <label htmlFor="customerId" className="block text-sm font-medium mb-1">Customer ID</label>
                <Input
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  placeholder="Customer ID"
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
              <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
                <Button type="submit" className="w-full md:w-auto">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loans List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Installment</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Branch ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>{loan.id}</TableCell>
                      <TableCell>{loan.loanType}</TableCell>
                      <TableCell>{loan.date}</TableCell>
                      <TableCell>${loan.amount.toFixed(2)}</TableCell>
                      <TableCell>{loan.duration}</TableCell>
                      <TableCell>${loan.installment.toFixed(2)}</TableCell>
                      <TableCell>{loan.customerId}</TableCell>
                      <TableCell>{loan.branchId}</TableCell>
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

export default Loans;
