import React from 'react';
import { Wallet2 } from 'lucide-react';
import Footer from '../components/Footer';
import { Outlet, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Wallet2 className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            FinanceFlow
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {location.pathname === '/login'
              ? 'Welcome back! Please sign in to your account.'
              : 'Create an account to start managing your finances.'}
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
