import { Link, useLocation } from "wouter";
import { Wallet } from "lucide-react";

const NavBar = () => {
  const [location] = useLocation();

  if (location === "/dashboard") return null;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Wallet className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FinanceFlow</span>
              </a>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/login">
              <a className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
