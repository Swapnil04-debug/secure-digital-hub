
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

interface Customer {
  id: string;
  name: string;
  address: string;
  contactNo: string;
}

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Jane Smith',
      address: '456 Elm St.',
      contactNo: '456-789-0123',
    },
    {
      id: '2',
      name: 'John Doe',
      address: '789 Oak Ave.',
      contactNo: '789-012-3456',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    contactNo: '',
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
    if (!formData.id || !formData.name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new customer
    const newCustomer: Customer = {
      id: formData.id,
      name: formData.name,
      address: formData.address,
      contactNo: formData.contactNo,
    };

    setCustomers([...customers, newCustomer]);
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      address: '',
      contactNo: '',
    });

    toast({
      title: "Customer added",
      description: `Customer ${formData.name} has been successfully added`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Customer ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Customer ID"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium mb-1">Contact No</label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="Contact No"
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
            <CardTitle>Customers List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact No</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.contactNo}</TableCell>
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

export default Customers;
