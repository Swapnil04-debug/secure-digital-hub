
import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

type BankLayoutProps = {
  children: ReactNode;
};

const BankLayout = ({ children }: BankLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="bg-gray-100 py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-4 overflow-x-auto pb-2">
              <Link to="/" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Home
              </Link>
              <Link to="/branches" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Branches
              </Link>
              <Link to="/departments" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Departments
              </Link>
              <Link to="/employees" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Employees
              </Link>
              <Link to="/customers" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Customers
              </Link>
              <Link to="/accounts" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Accounts
              </Link>
              <Link to="/loans" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Loans
              </Link>
              <Link to="/transactions" className="text-gray-600 hover:text-bank-primary whitespace-nowrap">
                Transactions
              </Link>
            </nav>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default BankLayout;
