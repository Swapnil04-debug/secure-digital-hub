
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Coins, Calculator, CheckCircle, Home, Briefcase, GraduationCap, Car } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const Loans = () => {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(10.5);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numPayments = tenure;
    
    const emi = (principal * ratePerMonth * Math.pow((1 + ratePerMonth), numPayments)) / (Math.pow((1 + ratePerMonth), numPayments) - 1);
    
    return emi.toFixed(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Loan Application Submitted",
      description: "Your loan application has been received. Our team will contact you soon.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Loans</h1>
            <p className="text-xl">
              Get quick and hassle-free loans with competitive interest rates and flexible repayment options.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid gap-8">
          <Tabs defaultValue="apply" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
              <TabsTrigger value="calculator">EMI Calculator</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apply">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="mr-2 h-6 w-6 text-bank-primary" />
                    Loan Application
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below to apply for a loan. Our team will review your application and contact you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" placeholder="Enter your full name" required />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter your email address" required />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="loan-type">Loan Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="home">Home Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                            <SelectItem value="education">Education Loan</SelectItem>
                            <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                        <Input id="loan-amount" type="number" placeholder="Enter loan amount" required />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="tenure">Tenure (Months)</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 months</SelectItem>
                            <SelectItem value="24">24 months</SelectItem>
                            <SelectItem value="36">36 months</SelectItem>
                            <SelectItem value="48">48 months</SelectItem>
                            <SelectItem value="60">60 months</SelectItem>
                            <SelectItem value="72">72 months</SelectItem>
                            <SelectItem value="84">84 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-bank-primary hover:bg-bank-primary/90">
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calculator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-6 w-6 text-bank-primary" />
                    EMI Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate your Equated Monthly Installment (EMI) based on loan amount, interest rate and tenure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loan-amount-calc">Loan Amount</Label>
                          <span className="text-sm font-medium">₹{loanAmount.toLocaleString()}</span>
                        </div>
                        <Slider
                          id="loan-amount-calc"
                          min={100000}
                          max={10000000}
                          step={50000}
                          value={[loanAmount]}
                          onValueChange={(value) => setLoanAmount(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>₹1L</span>
                          <span>₹1Cr</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tenure-calc">Tenure (Months)</Label>
                          <span className="text-sm font-medium">{tenure} months</span>
                        </div>
                        <Slider
                          id="tenure-calc"
                          min={12}
                          max={84}
                          step={12}
                          value={[tenure]}
                          onValueChange={(value) => setTenure(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 year</span>
                          <span>7 years</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="interest-rate-calc">Interest Rate (%)</Label>
                          <span className="text-sm font-medium">{interestRate}%</span>
                        </div>
                        <Slider
                          id="interest-rate-calc"
                          min={7.5}
                          max={18}
                          step={0.5}
                          value={[interestRate]}
                          onValueChange={(value) => setInterestRate(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>7.5%</span>
                          <span>18%</span>
                        </div>
                      </div>
                    </div>
                    
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-1">Your Monthly EMI</div>
                          <div className="text-3xl font-bold text-bank-primary">₹{calculateEMI()}</div>
                          <div className="text-sm text-muted-foreground mt-2">
                            Total Amount: ₹{(parseInt(calculateEMI()) * tenure).toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button className="w-full bg-bank-primary hover:bg-bank-primary/90">
                      Apply for This Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="text-center py-4">
              <Home className="h-8 w-8 mx-auto text-bank-primary" />
              <p className="font-medium mt-2">Home Loan</p>
              <p className="text-xs text-muted-foreground mt-1">From 8.5% p.a.</p>
            </Card>
            <Card className="text-center py-4">
              <Briefcase className="h-8 w-8 mx-auto text-bank-primary" />
              <p className="font-medium mt-2">Business Loan</p>
              <p className="text-xs text-muted-foreground mt-1">From 11% p.a.</p>
            </Card>
            <Card className="text-center py-4">
              <GraduationCap className="h-8 w-8 mx-auto text-bank-primary" />
              <p className="font-medium mt-2">Education Loan</p>
              <p className="text-xs text-muted-foreground mt-1">From 9% p.a.</p>
            </Card>
            <Card className="text-center py-4">
              <Car className="h-8 w-8 mx-auto text-bank-primary" />
              <p className="font-medium mt-2">Car Loan</p>
              <p className="text-xs text-muted-foreground mt-1">From 9.5% p.a.</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Loans;
