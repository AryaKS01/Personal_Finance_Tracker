import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, IndianRupee, TrendingUp, PiggyBank } from 'lucide-react';
import DashboardMetricCard from '@/components/DashboardMetricCard';
import TransactionList from '@/components/TransactionList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFinancialData } from '../hooks/useFinancialData';
import { useTransactions } from '../hooks/useTransactions';
import { auth } from '../firebaseConfig';

export default function Dashboard() {
  const { data: financialData, loading, error } = useFinancialData();

  // Calculate derived values
  const totalExpenses = financialData ? 
    Object.values({
      housing: financialData.housing,
      transportation: financialData.transportation,
      food: financialData.food,
      utilities: financialData.utilities,
      healthcare: financialData.healthcare,
      entertainment: financialData.entertainment
    }).reduce((a, b) => a + b, 0) : 0;

  const currentBalance = financialData ? 
    financialData.monthlyIncome - totalExpenses : 0;

  const savingsRate = financialData ? 
    (financialData.savingsGoal / financialData.monthlyIncome * 100) : 0;

  // Generate meaningful chart data
  const chartData = React.useMemo(() => {
    if (!financialData) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      balance: currentBalance * (0.9 + (index * 0.05)), // Simulate growth
      income: financialData.monthlyIncome,
      expenses: totalExpenses * (0.8 + (index * 0.1)) // Simulate expense changes
    }));
  }, [financialData, currentBalance, totalExpenses]);

  const stats = [
    {
      title: 'Current Balance',
      value: `₹${currentBalance.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: Wallet,
    },
    {
      title: 'Monthly Income',
      value: financialData ? `₹${financialData.monthlyIncome.toLocaleString()}` : '₹0',
      change: '+5.2%',
      trend: 'up' as const,
      icon: IndianRupee,
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString()}`,
      change: '-2.3%',
      trend: 'down' as const,
      icon: PiggyBank,
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: '+8.1%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-4 bg-red-100 text-red-700 rounded-lg m-8">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

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
                  <AreaChart data={chartData}>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#4F46E5"
                      fill="url(#colorBalance)"
                      strokeWidth={2}
                      name="Current Balance"
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      fill="url(#colorIncome)"
                      strokeWidth={2}
                      name="Monthly Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#EF4444"
                      fill="url(#colorExpenses)"
                      strokeWidth={2}
                      name="Total Expenses"
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