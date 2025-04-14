
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

interface Branch {
  id: string;
  name: string;
  city: string;
  contactNo: string;
  address: string;
}

const Branches = () => {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Main Branch',
      city: 'New York',
      contactNo: '123-456-7890',
      address: '123 Main St.',
    },
    {
      id: '2',
      name: 'Downtown Branch',
      city: 'Chicago',
      contactNo: '987-654-3210',
      address: '456 State St.',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    city: '',
    contactNo: '',
    address: '',
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
    if (!formData.id || !formData.name || !formData.city) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new branch
    const newBranch: Branch = {
      id: formData.id,
      name: formData.name,
      city: formData.city,
      contactNo: formData.contactNo,
      address: formData.address,
    };

    setBranches([...branches, newBranch]);
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      city: '',
      contactNo: '',
      address: '',
    });

    toast({
      title: "Branch added",
      description: `Branch ${formData.name} has been successfully added`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Branch Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Branch ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Branch ID"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Branch Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Branch Name"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
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
              <div className="col-span-1 md:col-span-2 lg:col-span-5 mt-4">
                <Button type="submit" className="w-full md:w-auto">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branches List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch ID</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Contact No</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>{branch.id}</TableCell>
                      <TableCell>{branch.name}</TableCell>
                      <TableCell>{branch.city}</TableCell>
                      <TableCell>{branch.contactNo}</TableCell>
                      <TableCell>{branch.address}</TableCell>
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

export default Branches;
