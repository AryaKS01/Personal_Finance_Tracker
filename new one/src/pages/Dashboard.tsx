import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, IndianRupee, TrendingUp, PiggyBank } from 'lucide-react';
import DashboardMetricCard from '@/components/DashboardMetricCard';
import TransactionList from '@/components/TransactionList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockUserData, mockChartData } from '@/lib/mockData';

const enhancedChartData = mockChartData.map(item => ({
  ...item,
  income: mockUserData.monthlyIncome,
  expenses: mockUserData.totalExpenses
}));

export default function Dashboard() {
  const stats = [
    {
      title: 'Current Balance',
      value: `₹${mockUserData.currentBalance.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: Wallet,
    },
    {
      title: 'Monthly Income',
      value: `₹${mockUserData.monthlyIncome.toLocaleString()}`,
      change: '+5.2%',
      trend: 'up' as const,
      icon: IndianRupee,
    },
    {
      title: 'Total Expenses',
      value: `₹${mockUserData.totalExpenses.toLocaleString()}`,
      change: '-2.3%',
      trend: 'down' as const,
      icon: PiggyBank,
    },
    {
      title: 'Savings Rate',
      value: '40%',
      change: '+8.1%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Financial Dashboard</h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <DashboardMetricCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enhancedChartData}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#EF4444"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <TransactionList limit={10} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}