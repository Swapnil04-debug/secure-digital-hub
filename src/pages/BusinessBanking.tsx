
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, FileText, CheckCircle, Briefcase } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const BusinessBanking = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Your business banking application has been received. Our team will contact you soon to proceed.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Business Banking</h1>
            <p className="text-xl">
              Powerful financial tools designed for businesses of all sizes. Manage your company's finances with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-6 w-6 text-bank-primary" />
                Business Account Application
              </CardTitle>
              <CardDescription>
                Complete the form below to apply for a business account tailored to your company's needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" placeholder="Enter your business name" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                        <SelectItem value="private-limited">Private Limited Company</SelectItem>
                        <SelectItem value="public-limited">Public Limited Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="gst-number">GST Number</Label>
                    <Input id="gst-number" placeholder="Enter your GST number" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact-name">Contact Person Name</Label>
                    <Input id="contact-name" placeholder="Enter contact person name" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" placeholder="Enter contact email" required />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input id="contact-phone" type="tel" placeholder="Enter contact phone number" required />
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-bank-primary hover:bg-bank-primary/90">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-bank-primary" />
                  Business Account Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Multi-user access with role-based permissions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Integrated payment solutions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Cash flow management tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Business credit cards with rewards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Dedicated relationship manager</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-bank-primary" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Business Registration Certificate</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>GST Registration (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>PAN Card of the business</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>ID proof of all directors/partners</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <span>Address proof of business premises</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessBanking;
