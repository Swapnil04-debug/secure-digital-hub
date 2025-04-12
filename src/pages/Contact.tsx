
import React from 'react';
import { PhoneCall, Mail, MapPin, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="bg-bank-primary text-white rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <PhoneCall className="h-6 w-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="mt-1">9810369432</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="mt-1">swapnild102004@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Visit Us</p>
                      <p className="mt-1">
                        PSP-4, Dr. KN Katju Marg, Sector17, Rohini, New Delhi, Delhi 110089
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-3">Business Hours</h3>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-1">Monday - Friday:</td>
                        <td className="text-right">9:30 AM - 4:00 PM</td>
                      </tr>
                      <tr>
                        <td className="py-1">Saturday:</td>
                        <td className="text-right">9:30 AM - 4:00 PM</td>
                      </tr>
                      <tr>
                        <td className="py-1">Sunday:</td>
                        <td className="text-right">Closed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Social Media (Optional) */}
                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                      <div key={social} className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 cursor-pointer">
                        <span className="text-xs">{social.charAt(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below and our team will get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe" 
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john.doe@example.com" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567" 
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="message">How Can We Help?</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe how we can assist you..." 
                        rows={5} 
                        required 
                      />
                    </div>

                    <div className="mt-8">
                      <Button 
                        type="submit" 
                        className="bg-bank-primary hover:bg-bank-primary/90 flex items-center"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">How quickly will I receive a response?</h3>
                      <p className="text-gray-600">
                        We aim to respond to all inquiries within 24-48 business hours. For urgent matters, please call our customer service directly.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Is there a direct number for technical support?</h3>
                      <p className="text-gray-600">
                        Yes, for technical support, you can call 9810369432 during business hours, or email swapnild102004@gmail.com anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
