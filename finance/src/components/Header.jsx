import React, { useState, useEffect } from 'react';
import { LogOut, Bell, Search, Wallet2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const savedUser = JSON.parse(localStorage.getItem('finance'))?.[0]; // Assuming the first user in localStorage
    if (savedUser) {
      setUser(savedUser); // Set user if found
    }
  }, []);

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('finance');
    setUser(null); // Reset user state
    navigate('/login'); // Redirect to login page after sign-out
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Wallet2 className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">FinanceFlow</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <button
                type="button"
                className="relative rounded-full bg-white p-2 hover:bg-gray-50"
              >
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
                <Bell className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex md:flex-col md:items-end">
                  <div className="text-sm font-medium text-gray-900">
                    {user.username} {/* Show the username instead of email */}
                  </div>
                  <div className="text-xs text-gray-500">Premium Account</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
