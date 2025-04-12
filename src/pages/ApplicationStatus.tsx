
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ApplicationStatus = () => {
  const { toast } = useToast();
  const [applicationType, setApplicationType] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationType || !applicationId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate random status for demonstration
      const statuses = ["Approved", "In Progress", "Under Review", "Pending Documentation", "Completed"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(randomStatus);
      
      toast({
        title: "Status Retrieved",
        description: `Your ${applicationType} application status has been fetched.`
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Application Status Tracker</h1>
          
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Track Your Application</CardTitle>
                <CardDescription>
                  Enter your application details to check its current status
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="application-type">Application Type</Label>
                    <Select 
                      value={applicationType} 
                      onValueChange={setApplicationType}
                    >
                      <SelectTrigger id="application-type">
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal-banking">Personal Banking</SelectItem>
                        <SelectItem value="business-banking">Business Banking</SelectItem>
                        <SelectItem value="loan">Loan Request</SelectItem>
                        <SelectItem value="investment">Investment Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="application-id">Application ID</Label>
                    <Input 
                      id="application-id" 
                      placeholder="Enter your application ID" 
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-bank-primary hover:bg-bank-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Checking..." : "Track Status"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {status && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {status === "Approved" || status === "Completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    )}
                    <div>
                      <div className="font-medium">Status: {status}</div>
                      <div className="text-sm text-gray-500">
                        Application ID: {applicationId}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationStatus;
