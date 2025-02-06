import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/Dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Budget', href: '/budget', icon: PiggyBank },
  { name: 'Savings', href: '/savings', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-semibold text-gray-900">Finance Tracker</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          if (location.pathname === item.href) {
                            e.preventDefault(); // Prevents unnecessary re-render
                            window.scrollTo(0, 0);
                          }
                        }}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${
                          isActive
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
