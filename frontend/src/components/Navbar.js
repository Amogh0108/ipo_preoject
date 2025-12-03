import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              IPO Platform
            </Link>
            {isAuthenticated && (
              <div className="ml-10 flex space-x-4">
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/ipos" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                  IPOs
                </Link>
                <Link to="/applications" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                  My Applications
                </Link>
                <Link to="/market-data" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                  Market Data
                </Link>
                <Link to="/indian-market" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                  🇮🇳 Indian Market
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2">
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 dark:text-gray-300">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
