
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

interface Department {
  id: string;
  name: string;
  contactNo: string;
  branchId: string;
}

const Departments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Finance',
      contactNo: '234-567-8901',
      branchId: '1',
    },
    {
      id: '2',
      name: 'Customer Service',
      contactNo: '345-678-9012',
      branchId: '1',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contactNo: '',
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
    if (!formData.id || !formData.name || !formData.branchId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new department
    const newDepartment: Department = {
      id: formData.id,
      name: formData.name,
      contactNo: formData.contactNo,
      branchId: formData.branchId,
    };

    setDepartments([...departments, newDepartment]);
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      contactNo: '',
      branchId: '',
    });

    toast({
      title: "Department added",
      description: `Department ${formData.name} has been successfully added`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Department Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Department ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Department ID"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Department Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Department Name"
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
            <CardTitle>Departments List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department ID</TableHead>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Contact No</TableHead>
                    <TableHead>Branch ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>{department.id}</TableCell>
                      <TableCell>{department.name}</TableCell>
                      <TableCell>{department.contactNo}</TableCell>
                      <TableCell>{department.branchId}</TableCell>
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

export default Departments;
