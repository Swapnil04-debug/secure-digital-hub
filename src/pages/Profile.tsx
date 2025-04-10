
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, Lock, Bell, Shield, CreditCard, 
  Mail, Phone, MapPin, Check, X, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [address, setAddress] = useState('123 Banking Street, Financial District');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading states
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  
  const handleProfileSave = () => {
    setIsProfileSaving(true);
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsProfileSaving(false);
    }, 1500);
  };
  
  const handlePasswordSave = () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordSaving(true);
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setIsPasswordSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
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
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="text-xl bg-bank-secondary text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  
                  <nav className="space-y-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" /> My Accounts
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => navigate('/transactions')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" /> Transactions
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" /> Profile Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <Lock className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal">
                    <TabsList className="mb-6">
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    </TabsList>
                    
                    {/* Personal Information Tab */}
                    <TabsContent value="personal">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address" 
                              value={address} 
                              onChange={(e) => setAddress(e.target.value)} 
                            />
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              className="bg-bank-primary hover:bg-bank-primary/90"
                              disabled={isProfileSaving}
                              onClick={handleProfileSave}
                            >
                              {isProfileSaving ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>Save Changes</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Security Tab */}
                    <TabsContent value="security">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input 
                                id="currentPassword" 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input 
                                id="newPassword" 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input 
                                id="confirmPassword" 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                            </div>
                            <div className="pt-2">
                              <Button 
                                className="bg-bank-primary hover:bg-bank-primary/90"
                                disabled={isPasswordSaving}
                                onClick={handlePasswordSave}
                              >
                                {isPasswordSaving ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>Change Password</>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Secure your account with 2FA</p>
                              <p className="text-sm text-gray-500">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Button>Enable</Button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Sessions</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Current Session</p>
                                <p className="text-sm text-gray-500">
                                  Web Browser • 192.168.1.1 • Active now
                                </p>
                              </div>
                              <span className="text-sm text-green-600 flex items-center">
                                <Check className="h-4 w-4 mr-1" /> Active
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Mobile App</p>
                                <p className="text-sm text-gray-500">
                                  iPhone • 10.0.0.15 • Last active 2 hours ago
                                </p>
                              </div>
                              <Button variant="outline" size="sm">Revoke</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Transaction Alerts</p>
                                <p className="text-sm text-gray-500">
                                  Receive emails for deposits, withdrawals, and transfers
                                </p>
                              </div>
                              <Switch defaultChecked id="transaction-alerts" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Security Alerts</p>
                                <p className="text-sm text-gray-500">
                                  Get notified about password changes and suspicious activities
                                </p>
                              </div>
                              <Switch defaultChecked id="security-alerts" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Promotional Emails</p>
                                <p className="text-sm text-gray-500">
                                  Receive offers, updates, and news about our products
                                </p>
                              </div>
                              <Switch id="promotional-emails" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Mobile App Notifications</p>
                                <p className="text-sm text-gray-500">
                                  Enable push notifications on your mobile device
                                </p>
                              </div>
                              <Switch defaultChecked id="mobile-notifications" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Account Balance Alerts</p>
                                <p className="text-sm text-gray-500">
                                  Get notified when your balance falls below a set threshold
                                </p>
                              </div>
                              <Switch id="balance-alerts" />
                            </div>
                          </div>
                          <div className="mt-6">
                            <Button 
                              className="bg-bank-primary hover:bg-bank-primary/90"
                            >
                              Save Notification Preferences
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Privacy Tab */}
                    <TabsContent value="privacy">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Data Sharing</p>
                                <p className="text-sm text-gray-500">
                                  Allow us to share your data with trusted partners
                                </p>
                              </div>
                              <Switch id="data-sharing" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Enhanced Analytics</p>
                                <p className="text-sm text-gray-500">
                                  Track your spending patterns to provide personalized insights
                                </p>
                              </div>
                              <Switch defaultChecked id="analytics" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Cookie Preferences</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Essential Cookies</p>
                                <p className="text-sm text-gray-500">
                                  Required for basic site functionality
                                </p>
                              </div>
                              <Switch defaultChecked disabled id="essential-cookies" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Analytical Cookies</p>
                                <p className="text-sm text-gray-500">
                                  Help us improve our website by collecting anonymous data
                                </p>
                              </div>
                              <Switch defaultChecked id="analytical-cookies" />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Marketing Cookies</p>
                                <p className="text-sm text-gray-500">
                                  Used to personalize ads and content
                                </p>
                              </div>
                              <Switch id="marketing-cookies" />
                            </div>
                          </div>
                          <div className="mt-6">
                            <Button 
                              className="bg-bank-primary hover:bg-bank-primary/90"
                            >
                              Save Privacy Settings
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium mb-4">Data Management</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            You can request a full export of your data or delete your account permanently.
                          </p>
                          <div className="flex gap-4">
                            <Button variant="outline">
                              Download My Data
                            </Button>
                            <Button variant="destructive">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
