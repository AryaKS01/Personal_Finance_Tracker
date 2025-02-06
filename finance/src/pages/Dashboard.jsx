import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, PiggyBank, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '../config/charconfig';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem('onboardingDetails') || '{}');
      if (storedData && storedData.monthlyIncome) {
        const prevData = JSON.parse(localStorage.getItem('previousFinancialData') || 'null');
        
        if (prevData) {
          setPreviousData(prevData);
        } else {
          const totalExp = Object.values(storedData.mainExpenses).reduce(
            (sum, value) => sum + parseInt(value || '0', 10),
            0
          );
          const initialPrevData = {
            balance: storedData.currentBalance,
            income: storedData.monthlyIncome,
            expenses: totalExp,
            savings: storedData.monthlyIncome - totalExp
          };
          setPreviousData(initialPrevData);
          localStorage.setItem('previousFinancialData', JSON.stringify(initialPrevData));
        }
        
        setUserData(storedData);
      }
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userData || !userData.mainExpenses || !previousData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Please complete the onboarding process to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const totalExpenses = Object.values(userData.mainExpenses).reduce(
    (sum, value) => sum + parseInt(value || '0', 10),
    0
  );

  const actualSavings = userData.monthlyIncome - totalExpenses;
  const savingsRate = (actualSavings / userData.monthlyIncome) * 100;

  if (
    userData.currentBalance !== previousData.balance ||
    userData.monthlyIncome !== previousData.income ||
    totalExpenses !== previousData.expenses ||
    actualSavings !== previousData.savings
  ) {
    const newPreviousData = {
      balance: userData.currentBalance,
      income: userData.monthlyIncome,
      expenses: totalExpenses,
      savings: actualSavings
    };
    localStorage.setItem('previousFinancialData', JSON.stringify(newPreviousData));
  }

  const stats = [
    {
      name: 'Current Balance',
      value: formatINR(userData.currentBalance),
      change: calculatePercentageChange(previousData.balance, userData.currentBalance),
      trend: userData.currentBalance >= previousData.balance ? 'up' : 'down',
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
      value: formatINR(totalExpenses),
      change: calculatePercentageChange(previousData.expenses, totalExpenses),
      trend: totalExpenses <= previousData.expenses ? 'up' : 'down',
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

  const expenseCategories = Object.keys(userData.mainExpenses);
  const expenseValues = Object.values(userData.mainExpenses).map(value => parseInt(value || '0', 10));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                {expenseCategories.map((category, index) => (
                  <div key={category} className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold inline-block text-gray-700 capitalize">
                          {category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold inline-block text-indigo-600">
                          {formatINR(expenseValues[index])}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                      <div
                        style={{ width: `${(expenseValues[index] / totalExpenses) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Progress</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold inline-block text-gray-700">
                      Monthly Goal
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold inline-block text-indigo-600">
                      {formatINR(userData.savingsGoal)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                  <div
                    style={{ width: `${Math.min((actualSavings / userData.savingsGoal) * 100, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      actualSavings >= userData.savingsGoal ? 'bg-green-500' : 'bg-indigo-600'
                    }`}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Current savings: {formatINR(actualSavings)} / {formatINR(userData.savingsGoal)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;