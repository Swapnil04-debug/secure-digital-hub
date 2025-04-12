import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
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
      subject: '',
      message: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl">
              Have questions or need assistance? We're here to help. Reach out to our team using any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-bank-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">
                PSP-4, Dr. KN Katju Marg,<br />
                Sector17, Rohini,<br />
                New Delhi, Delhi 110089
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-bank-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">
                Customer Service:<br />
                <a href="tel:+919551234567" className="text-bank-primary hover:underline">+91 (955) 123-4567</a>
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-bank-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">
                General Inquiries:<br />
                <a href="mailto:contact@securebank.com" className="text-bank-primary hover:underline">contact@securebank.com</a>
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-bank-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-600">
                Monday - Friday:<br />
                9:30 AM - 4:00 PM<br />
                Saturday:<br />
                9:30 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
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
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?" 
                    required 
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your inquiry..." 
                    rows={6} 
                    required 
                  />
                </div>

                <div className="mt-8">
                  <Button type="submit" className="w-full bg-bank-primary hover:bg-bank-primary/90">
                    <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* In a real app, you would replace this with an actual map component */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-bank-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">PSP-4, Dr. KN Katju Marg</p>
                  <p className="text-gray-600">Sector17, Rohini, New Delhi, Delhi 110089</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "What are your customer service hours?",
                  answer: "Our customer service team is available Monday through Friday from 9:30 AM to 4:00 PM, and Saturday from 9:30 AM to 4:00 PM. We are closed on Sundays."
                },
                {
                  question: "How long does it take to open a new account?",
                  answer: "Opening a new account typically takes less than 10 minutes online. Once submitted, your account will be active within 1-2 business days after verification."
                },
                {
                  question: "How can I report a lost or stolen card?",
                  answer: "If your card is lost or stolen, please call our customer service at 9810369432 immediately to report it and request a replacement."
                },
                {
                  question: "Do you have mobile banking?",
                  answer: "Yes, we offer a comprehensive mobile banking app available for both iOS and Android devices. You can download it from the App Store or Google Play Store."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
