
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUpRight, ArrowDownLeft, Search, 
  Filter, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBank, Transaction, Account } from '@/context/BankContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format account number
const formatAccountNumber = (accountNumber: string) => {
  return `**** ${accountNumber.slice(-4)}`;
};

const Transactions = () => {
  const navigate = useNavigate();
  const { accounts, transactions } = useBank();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by account
      if (selectedAccountId !== 'all' && transaction.accountId !== selectedAccountId) {
        return false;
      }
      
      // Filter by type
      if (selectedType !== 'all' && transaction.type !== selectedType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Get account object by id
  const getAccountByIdName = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    return account 
      ? `${account.accountType} (${formatAccountNumber(account.accountNumber)})` 
      : 'Unknown Account';
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Transaction History</h1>
              <p className="text-gray-600">View and search through all your transactions</p>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  <Select
                    value={selectedAccountId}
                    onValueChange={setSelectedAccountId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountType} ({formatAccountNumber(account.accountNumber)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Deposit">Deposits</SelectItem>
                      <SelectItem value="Withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="Transfer">Transfers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Description
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      className="pl-9"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {filteredTransactions.length} 
                  {filteredTransactions.length === 1 ? ' Transaction' : ' Transactions'}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedTransactions.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Account
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedTransactions.map((transaction) => {
                          const isCredit = transaction.type === 'Deposit' || 
                            (transaction.type === 'Transfer' && transaction.description.includes('from'));
                          
                          return (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(transaction.timestamp).toLocaleDateString()}
                                <div className="text-xs text-gray-400">
                                  {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getAccountByIdName(transaction.accountId)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.type === 'Deposit' 
                                    ? 'bg-green-100 text-green-800' 
                                    : transaction.type === 'Withdrawal'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {transaction.type === 'Deposit' && <ArrowDownLeft className="h-3 w-3 mr-1" />}
                                  {transaction.type === 'Withdrawal' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                  {transaction.type === 'Transfer' && <RefreshCw className="h-3 w-3 mr-1" />}
                                  {transaction.type}
                                </span>
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                isCredit ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {isCredit ? '+' : '-'} {formatCurrency(transaction.amount)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                        {filteredTransactions.length} transactions
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedAccountId('all');
                      setSelectedType('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Transactions;
