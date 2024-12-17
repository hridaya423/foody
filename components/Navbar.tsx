/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { User, LogIn, LogOut, BookOpen, Heart, ChefHat } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout }) => {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat size={32} className="text-blue-600" />
          <span className="text-2xl font-bold text-blue-800">
            Foody
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link 
                href="/favorites" 
                className="flex items-center space-x-2 text-blue-700 hover:text-blue-900"
              >
                <Heart size={20} />
                <span>Favorites</span>
              </Link>
              <Link 
                href="/cookbook" 
                className="flex items-center space-x-2 text-blue-700 hover:text-blue-900"
              >
                <BookOpen size={20} />
                <span>My Cookbook</span>
              </Link>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-2 text-blue-700">
                <User size={20} />
                <span>{user.email}</span>
              </div>
            </>
          ) : (
            <button 
              onClick={onLogin}
              className="
                flex items-center space-x-2 
                bg-blue-500 text-white 
                px-4 py-2 rounded-full 
                hover:bg-blue-600 
                transition-colors
              "
            >
              <LogIn size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;