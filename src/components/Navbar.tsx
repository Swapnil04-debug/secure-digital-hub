
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-bank-secondary text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user?.name || 'User'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem as={Link} to="/dashboard" className="cursor-pointer">
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem as={Link} to="/profile" className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={logout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="ghost" className="text-bank-primary">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-bank-primary hover:bg-bank-primary/90">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
