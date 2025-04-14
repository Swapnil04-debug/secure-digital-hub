
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

interface Employee {
  id: string;
  name: string;
  address: string;
  designation: string;
  contactNo: string;
  salary: number;
  departmentId: string;
}

const Employees = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      address: '123 Main St',
      designation: 'Manager',
      contactNo: '345-678-9012',
      salary: 5000.00,
      departmentId: '1',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      address: '456 Oak Ave',
      designation: 'Teller',
      contactNo: '567-890-1234',
      salary: 3200.00,
      departmentId: '2',
    },
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    designation: '',
    contactNo: '',
    salary: '',
    departmentId: '',
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
    if (!formData.id || !formData.name || !formData.departmentId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new employee
    const newEmployee: Employee = {
      id: formData.id,
      name: formData.name,
      address: formData.address,
      designation: formData.designation,
      contactNo: formData.contactNo,
      salary: parseFloat(formData.salary) || 0,
      departmentId: formData.departmentId,
    };

    setEmployees([...employees, newEmployee]);
    
    // Reset form
    setFormData({
      id: '',
      name: '',
      address: '',
      designation: '',
      contactNo: '',
      salary: '',
      departmentId: '',
    });

    toast({
      title: "Employee added",
      description: `Employee ${formData.name} has been successfully added`,
    });
  };

  return (
    <BankLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Employee Management</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium mb-1">Employee ID</label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="Employee ID"
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
                <label htmlFor="designation" className="block text-sm font-medium mb-1">Designation</label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
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
              <div>
                <label htmlFor="salary" className="block text-sm font-medium mb-1">Salary</label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary"
                />
              </div>
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium mb-1">Department ID</label>
                <Input
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  placeholder="Department ID"
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
            <CardTitle>Employees List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Contact No</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Department ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{employee.contactNo}</TableCell>
                      <TableCell>${employee.salary.toFixed(2)}</TableCell>
                      <TableCell>{employee.departmentId}</TableCell>
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

export default Employees;
