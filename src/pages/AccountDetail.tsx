
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUpRight, ArrowDownLeft, RefreshCw, 
  ChevronLeft, AlertCircle, Calendar, FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBank } from '@/context/BankContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAccountById, getAccountTransactions, deposit, withdraw, transfer } = useBank();
  const [transactionPeriod, setTransactionPeriod] = useState('all');
  
  // Form states for dialogs
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipientAccount, setRecipientAccount] = useState<string>('');
  const [transferDescription, setTransferDescription] = useState<string>('');
  
  // Dialog states
  const [depositDialogOpen, setDepositDialogOpen] = useState<boolean>(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState<boolean>(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState<boolean>(false);

  // Get account and transactions data
  const account = id ? getAccountById(id) : undefined;
  const allTransactions = id ? getAccountTransactions(id) : [];
  
  // Filter transactions based on selected period
  const filteredTransactions = allTransactions.filter(transaction => {
    if (transactionPeriod === 'all') return true;
    
    const transactionDate = new Date(transaction.timestamp);
    const now = new Date();
    
    if (transactionPeriod === 'last7days') {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      return transactionDate >= oneWeekAgo;
    }
    
    if (transactionPeriod === 'last30days') {
      const oneMonthAgo = new Date(now.setDate(now.getDate() - 30));
      return transactionDate >= oneMonthAgo;
    }
    
    if (transactionPeriod === 'last90days') {
      const threeMonthsAgo = new Date(now.setDate(now.getDate() - 90));
      return transactionDate >= threeMonthsAgo;
    }
    
    return true;
  });
  
  // Calculate statistics
  const totalDeposits = filteredTransactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = filteredTransactions
    .filter(t => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netChange = totalDeposits - totalWithdrawals;
  
  // Handle deposit submission
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (id) {
      const success = await deposit(id, amount, "Manual deposit");
      if (success) {
        setDepositAmount('');
        setDepositDialogOpen(false);
      }
    }
  };
  
  // Handle withdraw submission
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (account && amount > account.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive"
      });
      return;
    }
    
    if (id) {
      const success = await withdraw(id, amount, "Manual withdrawal");
      if (success) {
        setWithdrawAmount('');
        setWithdrawDialogOpen(false);
      }
    }
  };
  
  // Handle transfer submission
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientAccount.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a recipient account number.",
        variant: "destructive"
      });
      return;
    }
    
    if (account && amount > account.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer.",
        variant: "destructive"
      });
      return;
    }
    
    if (id) {
      // For demo purposes we're using the same account as recipient
      // In a real app, you'd validate the recipient account exists
      const transferDesc = transferDescription.trim() || "Funds transfer";
      const success = await transfer(id, id, amount, transferDesc);
      if (success) {
        toast({
          title: "Transfer successful",
          description: `$${amount} transferred to Account No. ${recipientAccount.substring(0, 4)}****${recipientAccount.substring(recipientAccount.length - 4)}`
        });
        setTransferAmount('');
        setRecipientAccount('');
        setTransferDescription('');
        setTransferDialogOpen(false);
      }
    }
  };

  // Handle account not found
  if (!account) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
              <p className="text-gray-600 mb-6">
                The account you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button 
                className="bg-bank-primary hover:bg-bank-primary/90"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
          </div>

          {/* Account Overview Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{account.accountType} Account</CardTitle>
                    <CardDescription>Account #{account.accountNumber}</CardDescription>
                  </div>
                  <Badge 
                    variant={account.status === 'Active' ? 'default' : 
                           account.status === 'Inactive' ? 'secondary' : 'outline'}
                  >
                    {account.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{formatCurrency(account.balance)}</div>
                <div className="text-sm text-gray-500">
                  Account created {formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <ArrowDownLeft className="h-4 w-4 mr-2" /> Deposit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Deposit Funds</DialogTitle>
                        <DialogDescription>
                          Enter the amount you want to deposit to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleDepositSubmit}>
                        <div className="py-4">
                          <Label htmlFor="deposit-amount">Amount</Label>
                          <Input
                            id="deposit-amount"
                            placeholder="Enter amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="mt-2"
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Deposit
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <ArrowUpRight className="h-4 w-4 mr-2" /> Withdraw
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Withdraw Funds</DialogTitle>
                        <DialogDescription>
                          Enter the amount you want to withdraw from your account.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleWithdrawSubmit}>
                        <div className="py-4">
                          <Label htmlFor="withdraw-amount">Amount</Label>
                          <Input
                            id="withdraw-amount"
                            placeholder="Enter amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={account.balance}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="mt-2"
                            required
                          />
                          <div className="text-sm text-gray-500 mt-2">
                            Available balance: {formatCurrency(account.balance)}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-red-600 hover:bg-red-700">
                            Withdraw
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        <RefreshCw className="h-4 w-4 mr-2" /> Transfer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Transfer Funds</DialogTitle>
                        <DialogDescription>
                          Enter the details for your fund transfer.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleTransferSubmit}>
                        <div className="grid gap-4 py-4">
                          <div>
                            <Label htmlFor="recipient">Recipient Account Number</Label>
                            <Input
                              id="recipient"
                              placeholder="Enter account number"
                              value={recipientAccount}
                              onChange={(e) => setRecipientAccount(e.target.value)}
                              className="mt-2"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="transfer-amount">Amount</Label>
                            <Input
                              id="transfer-amount"
                              placeholder="Enter amount"
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={account.balance}
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              className="mt-2"
                              required
                            />
                            <div className="text-sm text-gray-500 mt-2">
                              Available balance: {formatCurrency(account.balance)}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                              id="description"
                              placeholder="Add a note"
                              value={transferDescription}
                              onChange={(e) => setTransferDescription(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Transfer
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>

            {/* Account Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Transaction summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Period
                  </label>
                  <Select
                    value={transactionPeriod}
                    onValueChange={setTransactionPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="last90days">Last 90 Days</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Total Deposits</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalDeposits)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Total Withdrawals</span>
                    <span className="font-medium text-red-600">{formatCurrency(totalWithdrawals)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Net Change</span>
                    <span className={`font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Transaction Count</span>
                    <span className="font-medium">{filteredTransactions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Tab Section */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
              <TabsTrigger value="details">Account Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle>Transaction History</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTransactions.length > 0 ? (
                    <div className="overflow-hidden">
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
                              Type
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTransactions.map((transaction, index) => {
                            const isCredit = transaction.type === 'Deposit' || 
                              (transaction.type === 'Transfer' && transaction.description.includes('from'));
                            
                            return (
                              <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(transaction.timestamp).toLocaleDateString()}
                                  <div className="text-xs text-gray-400">
                                    {new Date(transaction.timestamp).toLocaleTimeString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {transaction.description}
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
                  ) : (
                    <div className="text-center py-12">
                      <RefreshCw className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No transactions</h3>
                      <p className="text-gray-500">
                        This account has no transactions for the selected period.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="statements">
              <Card>
                <CardHeader>
                  <CardTitle>Account Statements</CardTitle>
                  <CardDescription>View your monthly statements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const month = date.toLocaleString('default', { month: 'long' });
                      const year = date.getFullYear();
                      
                      // Generate random transaction stats for demo
                      const txnCount = Math.floor(Math.random() * 20) + 5;
                      const spent = (Math.random() * 10000 + 5000).toFixed(2);
                      const credited = (Math.random() * 8000 + 3000).toFixed(2);
                      
                      return (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-gray-100 mr-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{month} {year} Statement</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {txnCount} transactions, ${spent} spent, ${credited} credited
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Information about your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Information</h3>
                        <dl className="space-y-3">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                            <dd className="text-sm text-gray-900">{account.accountNumber}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                            <dd className="text-sm text-gray-900">{account.accountType}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
                            <dd className="text-sm font-medium">{formatCurrency(account.balance)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900">
                              <Badge 
                                variant={account.status === 'Active' ? 'default' : 
                                       account.status === 'Inactive' ? 'secondary' : 'outline'}
                              >
                                {account.status}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500">Opening Date</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(account.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Features</h3>
                        <ul className="space-y-2">
                          {account.accountType === 'Checking' && (
                            <>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                No minimum balance requirement
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Free debit card included
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Unlimited transactions per month
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Online & mobile banking access
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Bill pay service included
                              </li>
                            </>
                          )}
                          {account.accountType === 'Savings' && (
                            <>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Competitive interest rate (1.25% APY)
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                No monthly maintenance fee
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Goal setting and tracking tools
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Limited to 6 withdrawals per month
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Automatic savings plans available
                              </li>
                            </>
                          )}
                          {account.accountType === 'Investment' && (
                            <>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Access to diverse investment options
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Professional portfolio management
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Retirement planning tools
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Tax-advantaged investing options
                              </li>
                              <li className="flex items-center text-sm text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                                Regular investment reports
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Paper Statements</p>
                            <p className="text-sm text-gray-500">Receive monthly statements by mail</p>
                          </div>
                          <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Overdraft Protection</p>
                            <p className="text-sm text-gray-500">Link another account for overdraft coverage</p>
                          </div>
                          <Button variant="outline" size="sm">Set Up</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Alerts & Notifications</p>
                            <p className="text-sm text-gray-500">Manage your alert preferences</p>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDetail;
