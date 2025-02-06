import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, PiggyBank, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('onboardingDetails');
      if (!storedData) {
        navigate('/onboarding');
        return;
      }

      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);

      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }

      const prevData = localStorage.getItem('previousFinancialData');
      if (prevData) {
        setPreviousData(JSON.parse(prevData));
      } else {
        const initialPrevData = {
          balance: parsedData.currentBalance,
          income: parsedData.monthlyIncome,
          expenses: parsedData.totalExpenses,
          savings: parsedData.monthlyIncome - parsedData.totalExpenses
        };
        setPreviousData(initialPrevData);
        localStorage.setItem('previousFinancialData', JSON.stringify(initialPrevData));
      }

      setTotalBalance(parsedData.currentBalance);

    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/onboarding');
    }
    setLoading(false);
  }, [navigate]);

  // Listen for storage events to update the dashboard in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'transactions') {
        const updatedTransactions = JSON.parse(e.newValue);
        setTransactions(updatedTransactions);
        
        // Recalculate total balance
        const newBalance = updatedTransactions.reduce((acc, transaction) => {
          return transaction.type === 'expense' 
            ? acc - transaction.amount 
            : acc + transaction.amount;
        }, userData?.currentBalance || 0);
        
        setTotalBalance(newBalance);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userData]);

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculatePercentageChange = (previous, current) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / Math.abs(previous)) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const handleEditData = () => {
    navigate('/onboarding');
  };

  const getChartData = () => {
    if (!userData) return [];

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return date;
    }).reverse();

    const sortedTransactions = [...transactions].sort((a, b) =>
      parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );

    let runningBalance = userData.currentBalance;
    return last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTransactions = sortedTransactions.filter(t => 
        format(parseISO(t.date), 'yyyy-MM-dd') === dateStr
      );

      dayTransactions.forEach(t => {
        runningBalance = t.type === 'expense' 
          ? runningBalance - t.amount 
          : runningBalance + t.amount;
      });

      return {
        date: format(date, 'MMM d'),
        balance: runningBalance
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userData || !previousData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please complete the onboarding process to view your dashboard.</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualSavings = userData.monthlyIncome - monthlyExpenses;
  const savingsRate = (actualSavings / userData.monthlyIncome) * 100;

  const stats = [
    {
      name: 'Current Balance',
      value: formatINR(totalBalance),
      change: calculatePercentageChange(previousData.balance, totalBalance),
      trend: totalBalance >= previousData.balance ? 'up' : 'down',
      icon: Wallet,
    },
    {
      name: 'Monthly Income',
      value: formatINR(userData.monthlyIncome),
      change: calculatePercentageChange(previousData.income, userData.monthlyIncome),
      trend: userData.monthlyIncome >= previousData.income ? 'up' : 'down',
      icon: DollarSign,
    },
    {
      name: 'Monthly Expenses',
      value: formatINR(monthlyExpenses),
      change: calculatePercentageChange(previousData.expenses, monthlyExpenses),
      trend: monthlyExpenses <= previousData.expenses ? 'up' : 'down',
      icon: PiggyBank,
    },
    {
      name: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: calculatePercentageChange(previousData.savings, actualSavings),
      trend: actualSavings >= previousData.savings ? 'up' : 'down',
      icon: TrendingUp,
    },
  ];

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <button
            onClick={handleEditData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Edit Financial Data
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-50 p-3">
                  <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <TransactionList showAll={false} limit={5} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Balance Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
