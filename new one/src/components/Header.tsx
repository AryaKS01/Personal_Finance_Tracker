import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import {
  Wallet2,
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Budget', href: '/budget', icon: PiggyBank },
  { name: 'Savings', href: '/savings', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <Wallet2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FinanceFlow</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Button variant="destructive">Logout</Button>
            </nav>
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Link href="/dashboard" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Wallet2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FinanceFlow</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                          }`}
                      >
                        <item.icon className={`h-5 w-5 ${
                          isActive ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                        {item.name}
                      </button>
                    </Link>
                  );
                })}
                <Button variant="destructive" className="mt-4 w-full">
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}