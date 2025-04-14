
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <header className="bg-bank-primary text-white text-center py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to SecureBank</h1>
          <p className="text-xl mb-8">Your trusted partner for secure and simple banking solutions.</p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/accounts">Learn More</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white">
              <Link to="/accounts">Open Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-bank-primary mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2">Online Banking</h3>
              <p className="text-gray-600">Access your accounts anytime, anywhere with our secure platform.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-bank-primary mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Mobile App</h3>
              <p className="text-gray-600">Bank on the go with our user-friendly mobile application.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl text-bank-primary mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Competitive Loans</h3>
              <p className="text-gray-600">Explore flexible loan options tailored to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-600 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers today!</p>
          <Button asChild size="lg">
            <Link to="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
