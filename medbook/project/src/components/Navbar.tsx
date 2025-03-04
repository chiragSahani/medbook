import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Stethoscope, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Stethoscope className="h-8 w-8 text-green-700" />
              <span className="ml-2 text-xl font-bold text-gray-900">MedBook</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
            >
              Home
            </Link>
            <Link 
              to="/doctors" 
              className={`${isActive('/doctors') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
            >
              Find Doctors
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
            >
              About Us
            </Link>
            
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-green-700 border border-green-700 rounded-md hover:bg-green-50"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
                >
                  Sign-up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 ${isActive('/') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`block px-3 py-2 ${isActive('/doctors') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
              onClick={() => setIsOpen(false)}
            >
              Find Doctors
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 ${isActive('/about') ? 'text-green-700' : 'text-gray-700'} hover:text-green-700`}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            
            {user ? (
              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-green-700" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.full_name || 'User'}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  My Appointments
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full mt-2 px-4 py-2 text-green-700 border border-green-700 rounded-md hover:bg-green-50 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full mt-2 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}