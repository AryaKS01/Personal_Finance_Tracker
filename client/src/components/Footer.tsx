import { Link } from 'wouter';
import { Wallet2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Wallet2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceFlow</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Take control of your financial future with our comprehensive personal finance management tool.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/dashboard" className="text-base text-gray-500 hover:text-gray-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-base text-gray-500 hover:text-gray-900">
                  Transactions
                </Link>
              </li>
              <li>
                <Link href="/budgets" className="text-base text-gray-500 hover:text-gray-900">
                  Budgets
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/help" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} FinanceFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
