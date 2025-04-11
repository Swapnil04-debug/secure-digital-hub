
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Briefcase, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <CreditCard className="h-8 w-8 text-bank-primary" />,
      title: "Smart Personal Banking, Simplified",
      description: "Manage your everyday banking with ease using our enhanced personal banking solutions. Enjoy secure transactions, real-time insights, and personalized financial guidance—all in one place.",
      features: [
        "Expense tracking and budget insights",
        "Instant savings & current account setup",
        "UPI, card, and net banking support",
        "Personalized offers and rewards"
      ],
      cta: "Get Started with Personal Banking",
      ctaLink: "/personal-banking",
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-bank-primary" />,
      title: "Business Banking, Reimagined",
      description: "Grow your business with smart financial tools tailored for modern enterprises. From smart invoicing to automated cash flow analysis, we help businesses thrive with technology.",
      features: [
        "Multi-user business accounts with role management",
        "Cash flow forecasting",
        "Smart invoicing and transaction categorization",
        "Business credit card & overdraft facility",
        "GST-ready statements & compliance tracking"
      ],
      cta: "Explore Business Solutions",
      ctaLink: "/business-banking",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100"
    },
    {
      icon: <Wallet className="h-8 w-8 text-bank-primary" />,
      title: "Easy Loans, Smart Approvals",
      description: "Get instant access to loans with our eligibility engine. We make borrowing easy, fast, and transparent—tailored to your needs and financial history.",
      features: [
        "Loan approval within minutes",
        "Flexible EMI plans with real-time calculators",
        "Personal, business, and home loan options",
        "Paperless documentation & digital KYC",
        "Zero hidden charges, full transparency"
      ],
      cta: "Check Your Loan Eligibility",
      ctaLink: "/loans",
      color: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-bank-primary" />,
      title: "Smarter Investments, Better Returns",
      description: "Let us guide your investment journey—from mutual funds to stocks and savings. Get personalized portfolio suggestions based on your goals and risk appetite.",
      features: [
        "Data-driven portfolio recommendations",
        "Mutual Funds, SIPs, Stocks, and Bonds",
        "Real-time market tracking & alerts",
        "Risk assessment & goal-based planning",
        "Tax-saving investment options"
      ],
      cta: "Start Investing Today",
      ctaLink: "/investments",
      color: "bg-gradient-to-br from-amber-50 to-amber-100"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Banking Services</h1>
            <p className="text-xl">
              Discover our comprehensive range of financial services designed to meet your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`hover:shadow-lg transition-all duration-300 overflow-hidden ${service.color}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-2">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-bank-primary">{service.title}</CardTitle>
                  <CardDescription className="text-gray-700">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="list-none pl-0 space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="rounded-full h-5 w-5 bg-bank-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                          <div className="rounded-full h-2.5 w-2.5 bg-bank-secondary"></div>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full border-bank-primary text-bank-primary hover:bg-bank-primary hover:text-white transition-colors duration-300">
                    <Link to={service.ctaLink} className="flex items-center justify-center gap-2">
                      {service.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing the Right Service?</h2>
            <p className="text-gray-600 mb-8">
              Our financial advisor can help you find the perfect banking solution based on your needs.
              Try our recommendation tool or speak to one of our experts today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-bank-primary hover:bg-bank-primary/90">
                <Link to="/contact-us">Use Advisor</Link>
              </Button>
              <Button variant="outline" className="border-bank-primary text-bank-primary hover:bg-bank-primary hover:text-white">
                <Link to="/contact-us">Speak to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
