import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Smartphone, Users, Building, Headset, CreditCard, Briefcase, Wallet, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Banking Designed for the Modern World
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                Secure, simple, and smart banking solutions to help you manage your finances effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-bank-primary hover:bg-gray-100">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md h-64 md:h-96 bg-white/10 backdrop-blur-sm rounded-lg shadow-xl flex items-center justify-center">
                <div className="bg-white/90 w-4/5 h-4/5 rounded-lg shadow-inner p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="h-6 w-12 bg-bank-secondary rounded-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <div className="h-10 w-20 bg-bank-accent rounded-md"></div>
                    <div className="h-10 w-10 bg-bank-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Banking Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our range of AI-powered banking solutions designed to meet your financial needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Personal Banking */}
            <div className="bg-blue-50 rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Banking</h3>
              <p className="text-gray-600 mb-4">Smart AI-powered solutions for your everyday banking needs.</p>
              <Button asChild variant="outline" className="w-full border-bank-primary text-bank-primary hover:bg-bank-primary/10 hover:text-bank-primary">
                <Link to="/services" className="flex items-center justify-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Business Banking */}
            <div className="bg-indigo-50 rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Banking</h3>
              <p className="text-gray-600 mb-4">Advanced tools to help your business grow and thrive.</p>
              <Button asChild variant="outline" className="w-full border-bank-primary text-bank-primary hover:bg-bank-primary/10 hover:text-bank-primary">
                <Link to="/services" className="flex items-center justify-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Loans */}
            <div className="bg-green-50 rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loans</h3>
              <p className="text-gray-600 mb-4">Fast approvals with AI-based eligibility assessment.</p>
              <Button asChild variant="outline" className="w-full border-bank-primary text-bank-primary hover:bg-bank-primary/10 hover:text-bank-primary">
                <Link to="/services" className="flex items-center justify-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Investments */}
            <div className="bg-amber-50 rounded-lg p-6 text-center hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Investments</h3>
              <p className="text-gray-600 mb-4">AI-guided investment solutions for better returns.</p>
              <Button asChild variant="outline" className="w-full border-bank-primary text-bank-primary hover:bg-bank-primary/10 hover:text-bank-primary">
                <Link to="/services" className="flex items-center justify-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-bank-primary hover:bg-bank-primary/90">
              <Link to="/services" className="flex items-center">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SecureBank?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our digital banking platform offers the perfect blend of security, convenience, and innovative features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
              <p className="text-gray-600">
                Bank with confidence knowing your money and data are protected by state-of-the-art security protocols.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Banking</h3>
              <p className="text-gray-600">
                Manage your accounts, make transfers, and deposit checks from anywhere using our secure mobile app.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Accounts</h3>
              <p className="text-gray-600">
                Choose from a variety of account types designed to help you save, spend, and grow your money wisely.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Service</h3>
              <p className="text-gray-600">
                Get personalized assistance from our team of financial experts who care about your success.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Solutions</h3>
              <p className="text-gray-600">
                Tailored financial products and services designed to help your business thrive and grow.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md card-gradient">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Headset className="h-6 w-6 text-bank-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available around the clock to assist you with any banking needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bank-primary py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready to experience better banking?</h2>
              <p className="text-gray-600">
                Join thousands of satisfied customers who have made the switch to SecureBank. 
                Open an account in minutes and start banking smarter today.
              </p>
            </div>
            <div>
              <Button asChild size="lg" className="bg-bank-accent hover:bg-bank-accent/90 flex items-center gap-2">
                <Link to="/register">
                  Open an Account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
