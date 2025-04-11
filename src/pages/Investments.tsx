
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BarChart3, TrendingUp, CheckCircle, LineChart, PieChart, Percent } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Investments = () => {
  const { toast } = useToast();
  const [riskProfile, setRiskProfile] = useState("moderate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Investment Request Submitted",
      description: "Our investment advisor will contact you soon to discuss your investment goals.",
    });
  };

  const getRecommendedPlan = () => {
    switch (riskProfile) {
      case "conservative":
        return {
          title: "Capital Preservation Plan",
          allocation: [
            { type: "Fixed Deposit", percent: 45 },
            { type: "Govt. Securities", percent: 30 },
            { type: "Corporate Bonds", percent: 15 },
            { type: "Large Cap Stocks", percent: 10 }
          ]
        };
      case "moderate":
        return {
          title: "Balanced Growth Plan",
          allocation: [
            { type: "Fixed Deposit", percent: 25 },
            { type: "Corporate Bonds", percent: 25 },
            { type: "Large Cap Stocks", percent: 25 },
            { type: "Mid Cap Stocks", percent: 15 },
            { type: "International Funds", percent: 10 }
          ]
        };
      case "aggressive":
        return {
          title: "High Growth Plan",
          allocation: [
            { type: "Corporate Bonds", percent: 15 },
            { type: "Large Cap Stocks", percent: 25 },
            { type: "Mid Cap Stocks", percent: 30 },
            { type: "Small Cap Stocks", percent: 15 },
            { type: "International Funds", percent: 15 }
          ]
        };
      default:
        return {
          title: "Custom Plan",
          allocation: [
            { type: "Please speak with our advisor", percent: 100 }
          ]
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Investments</h1>
            <p className="text-xl">
              Grow your wealth with our diverse range of investment options tailored to your financial goals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid gap-8">
          <Tabs defaultValue="start" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="start">Start Investing</TabsTrigger>
              <TabsTrigger value="plans">Investment Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="start">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6 text-bank-primary" />
                    Begin Your Investment Journey
                  </CardTitle>
                  <CardDescription>
                    Tell us about your investment goals so we can recommend the most suitable options for you.
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
                        <Label htmlFor="investment-goal">Investment Goal</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retirement">Retirement</SelectItem>
                            <SelectItem value="education">Children's Education</SelectItem>
                            <SelectItem value="property">Property Purchase</SelectItem>
                            <SelectItem value="wealth">Wealth Creation</SelectItem>
                            <SelectItem value="tax-saving">Tax Saving</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="investment-amount">Initial Investment Amount (₹)</Label>
                        <Input id="investment-amount" type="number" placeholder="Enter amount" required />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="risk-profile">Risk Tolerance</Label>
                        <Select value={riskProfile} onValueChange={setRiskProfile}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select risk tolerance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-bank-primary hover:bg-bank-primary/90">
                      Get Investment Plan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="plans">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-6 w-6 text-bank-primary" />
                    Recommended Portfolio: {getRecommendedPlan().title}
                  </CardTitle>
                  <CardDescription>
                    Based on your risk profile, we recommend the following investment allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-6 flex-wrap">
                      <div className="flex-1 min-w-[250px]">
                        <div className="text-sm font-medium mb-4">Suggested Asset Allocation</div>
                        {getRecommendedPlan().allocation.map((item, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.type}</span>
                              <span className="font-medium">{item.percent}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-bank-primary h-2 rounded-full" 
                                style={{ width: `${item.percent}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex-1 min-w-[250px]">
                        <div className="text-sm font-medium mb-4">Expected Performance</div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center mb-1">
                              <LineChart className="h-4 w-4 mr-2 text-bank-primary" />
                              <span className="text-sm">Potential Annual Returns</span>
                            </div>
                            <div className="font-medium">
                              {riskProfile === "conservative" ? "7-9%" : 
                               riskProfile === "moderate" ? "10-14%" : "14-18%"}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-1">
                              <PieChart className="h-4 w-4 mr-2 text-bank-primary" />
                              <span className="text-sm">Risk Level</span>
                            </div>
                            <div className="font-medium">
                              {riskProfile === "conservative" ? "Low" : 
                               riskProfile === "moderate" ? "Medium" : "High"}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-1">
                              <Percent className="h-4 w-4 mr-2 text-bank-primary" />
                              <span className="text-sm">Recommended Time Horizon</span>
                            </div>
                            <div className="font-medium">
                              {riskProfile === "conservative" ? "3-5 years" : 
                               riskProfile === "moderate" ? "5-7 years" : "7+ years"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-bank-primary hover:bg-bank-primary/90">
                      Schedule Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Mutual Funds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Diversified investment options</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Professionally managed</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">SIP options available</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fixed Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Guaranteed returns</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Flexible tenure options</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Senior citizen benefits</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Equity Trading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Direct stock market access</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Research insights</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">Low brokerage fees</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Investments;
