
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  PlusCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, 
  Wallet, ChevronRight, Filter, CreditCard, Clock
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useBank, Account, Transaction, AccountType } from '@/context/BankContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

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

// Transaction item component
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isCredit = transaction.type === 'Deposit' || 
    (transaction.type === 'Transfer' && transaction.description.includes('from'));
  
  return (
    <div className="transaction-item">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${isCredit ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
          {isCredit ? (
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div>
        <p className={`font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
          {isCredit ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};

// Account card component
const AccountCard = ({ account }: { account: Account }) => {
  return (
    <Link to={`/accounts/${account.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{account.accountType} Account</CardTitle>
              <CardDescription>{formatAccountNumber(account.accountNumber)}</CardDescription>
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
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500">Available balance</p>
              <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Main dashboard component
const Dashboard = () => {
  const { user } = useAuth();
  const { accounts, transactions, deposit, withdraw, transfer, createAccount } = useBank();
  const { toast } = useToast();
  
  // State for dialogs
  const [isNewAccountDialogOpen, setIsNewAccountDialogOpen] = useState(false);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  
  // Form states
  const [newAccountType, setNewAccountType] = useState<AccountType>('Checking');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [depositAccountId, setDepositAccountId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [withdrawAccountId, setWithdrawAccountId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [transferFromAccountId, setTransferFromAccountId] = useState('');
  const [transferToAccountId, setTransferToAccountId] = useState('');
  
  // Loading states
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Handle creating a new account
  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    try {
      const success = await createAccount(newAccountType);
      if (success) {
        setIsNewAccountDialogOpen(false);
      }
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    if (!depositAccountId || !depositAmount) {
      toast({
        title: "Error",
        description: "Please select an account and enter an amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsDepositing(true);
    try {
      const success = await deposit(
        depositAccountId, 
        amount, 
        depositDescription || 'Deposit'
      );
      if (success) {
        setIsDepositDialogOpen(false);
        setDepositAmount('');
        setDepositDescription('');
      }
    } finally {
      setIsDepositing(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!withdrawAccountId || !withdrawAmount) {
      toast({
        title: "Error",
        description: "Please select an account and enter an amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const success = await withdraw(
        withdrawAccountId, 
        amount, 
        withdrawDescription || 'Withdrawal'
      );
      if (success) {
        setIsWithdrawDialogOpen(false);
        setWithdrawAmount('');
        setWithdrawDescription('');
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle transfer
  const handleTransfer = async () => {
    if (!transferFromAccountId || !transferToAccountId || !transferAmount) {
      toast({
        title: "Error",
        description: "Please select accounts and enter an amount",
        variant: "destructive",
      });
      return;
    }

    if (transferFromAccountId === transferToAccountId) {
      toast({
        title: "Error",
        description: "Cannot transfer to the same account",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      const success = await transfer(
        transferFromAccountId,
        transferToAccountId,
        amount,
        transferDescription || 'Transfer'
      );
      if (success) {
        setIsTransferDialogOpen(false);
        setTransferAmount('');
        setTransferDescription('');
      }
    } finally {
      setIsTransferring(false);
    }
  };

  // Get recent transactions sorted by date
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
            <p className="text-gray-600">Here's a summary of your accounts and recent activity</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 border-dashed hover:border-bank-primary hover:text-bank-primary"
              onClick={() => setIsNewAccountDialogOpen(true)}
            >
              <PlusCircle className="h-6 w-6 mb-2" />
              <span>New Account</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 hover:border-green-600 hover:text-green-600"
              onClick={() => setIsDepositDialogOpen(true)}
            >
              <ArrowDownLeft className="h-6 w-6 mb-2" />
              <span>Deposit</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 hover:border-red-600 hover:text-red-600"
              onClick={() => setIsWithdrawDialogOpen(true)}
            >
              <ArrowUpRight className="h-6 w-6 mb-2" />
              <span>Withdraw</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 hover:border-blue-600 hover:text-blue-600"
              onClick={() => setIsTransferDialogOpen(true)}
            >
              <RefreshCw className="h-6 w-6 mb-2" />
              <span>Transfer</span>
            </Button>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Accounts and Balances - Left Column */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Accounts</h2>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="text-bank-secondary"
                  onClick={() => setIsNewAccountDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> New Account
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
                    <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No accounts yet</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first account</p>
                    <Button 
                      className="bg-bank-primary hover:bg-bank-primary/90"
                      onClick={() => setIsNewAccountDialogOpen(true)}
                    >
                      Create Account
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity - Right Column */}
            <div className="col-span-1 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length > 0 ? (
                    <div>
                      {recentTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4 text-bank-secondary"
                        asChild
                      >
                        <Link to="/transactions">View All Transactions</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Balance</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(accounts.reduce((total, account) => total + account.balance, 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Number of Accounts</p>
                      <p className="text-xl font-bold">{accounts.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recent Transactions</p>
                      <p className="text-xl font-bold">{transactions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* New Account Dialog */}
      <Dialog open={isNewAccountDialogOpen} onOpenChange={setIsNewAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Choose the type of account you want to create
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <Select
                  value={newAccountType}
                  onValueChange={(value: AccountType) => setNewAccountType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Checking">Checking Account</SelectItem>
                      <SelectItem value="Savings">Savings Account</SelectItem>
                      <SelectItem value="Investment">Investment Account</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                <h4 className="font-medium mb-2">Account Features:</h4>
                {newAccountType === 'Checking' && (
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• No minimum balance required</li>
                    <li>• Free debit card</li>
                    <li>• Unlimited transactions</li>
                    <li>• Online & mobile banking</li>
                  </ul>
                )}
                {newAccountType === 'Savings' && (
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Competitive interest rates</li>
                    <li>• No monthly fees</li>
                    <li>• Goal setting tools</li>
                    <li>• Automatic savings options</li>
                  </ul>
                )}
                {newAccountType === 'Investment' && (
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Diversified portfolio options</li>
                    <li>• Retirement planning</li>
                    <li>• Professional financial advice</li>
                    <li>• Tax-efficient investing</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-bank-primary hover:bg-bank-primary/90"
              disabled={isCreatingAccount}
              onClick={handleCreateAccount}
            >
              {isCreatingAccount ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Deposit</DialogTitle>
            <DialogDescription>
              Select an account and enter the amount to deposit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Account
              </label>
              <Select
                value={depositAccountId}
                onValueChange={setDepositAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} ({formatAccountNumber(account.accountNumber)})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <Input
                placeholder="Salary, Gift, etc."
                value={depositDescription}
                onChange={(e) => setDepositDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDepositDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              disabled={isDepositing}
              onClick={handleDeposit}
            >
              {isDepositing ? 'Processing...' : 'Deposit Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Withdrawal</DialogTitle>
            <DialogDescription>
              Select an account and enter the amount to withdraw
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Account
              </label>
              <Select
                value={withdrawAccountId}
                onValueChange={setWithdrawAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} ({formatAccountNumber(account.accountNumber)}) - 
                        {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <Input
                placeholder="Rent, Bills, etc."
                value={withdrawDescription}
                onChange={(e) => setWithdrawDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsWithdrawDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              disabled={isWithdrawing}
              onClick={handleWithdraw}
            >
              {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Funds</DialogTitle>
            <DialogDescription>
              Move money between your accounts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account
              </label>
              <Select
                value={transferFromAccountId}
                onValueChange={setTransferFromAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} ({formatAccountNumber(account.accountNumber)}) - 
                        {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Account
              </label>
              <Select
                value={transferToAccountId}
                onValueChange={setTransferToAccountId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountType} ({formatAccountNumber(account.accountNumber)})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <Input
                placeholder="Monthly savings, Investment, etc."
                value={transferDescription}
                onChange={(e) => setTransferDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTransferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-bank-secondary hover:bg-bank-secondary/90"
              disabled={isTransferring}
              onClick={handleTransfer}
            >
              {isTransferring ? 'Processing...' : 'Transfer Funds'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
