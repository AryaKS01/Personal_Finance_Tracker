import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const incomeData = [4500, 4800, 5200, 4900, 5500, 5800];
const expenseData = [3200, 3400, 3100, 3600, 3300, 3500];
const savingsData = incomeData.map((income, i) => income - expenseData[i]);

const categoryData = {
  labels: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare'],
  data: [1450, 580, 385, 290, 220, 150],
};

export default function Reports() {
  const [timeframe, setTimeframe] = useState('6m');

  const cashflowData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        tension: 0.4,
      },
      {
        label: 'Savings',
        data: savingsData,
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        tension: 0.4,
      },
    ],
  };

  const spendingData = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Spending by Category',
        data: categoryData.data,
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#6366F1',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  const averageIncome = (incomeData.reduce((a, b) => a + b, 0) / incomeData.length).toFixed(2);
  const averageExpenses = (expenseData.reduce((a, b) => a + b, 0) / expenseData.length).toFixed(2);
  const savingsRate = ((savingsData.reduce((a, b) => a + b, 0) / incomeData.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
  const largestExpenseCategory = categoryData.labels[categoryData.data.indexOf(Math.max(...categoryData.data))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Financial Reports</h1>
              <p className="mt-2 text-sm text-gray-700">
                Detailed analysis of your income, expenses, and savings over time.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Cash Flow Analysis
                </h3>
                <div className="mt-6 h-[400px]">
                  <Line
                    data={cashflowData}
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                            color: '#E5E7EB',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Spending by Category
                  </h3>
                  <div className="mt-6 h-[300px]">
                    <Bar
                      data={spendingData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              display: true,
                              color: '#E5E7EB',
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Key Statistics
                  </h3>
                  <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Average Monthly Income</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        ₹{averageIncome}
                      </dd>
                      <dd className="mt-2 text-sm text-green-600">
                        +12.3% from last period
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Average Monthly Expenses</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        ₹{averageExpenses}
                      </dd>
                      <dd className="mt-2 text-sm text-red-600">
                        +5.2% from last period
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Savings Rate</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {savingsRate}%
                      </dd>
                      <dd className="mt-2 text-sm text-green-600">
                        +2.1% from last period
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Largest Expense Category</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        {largestExpenseCategory}
                      </dd>
                      <dd className="mt-2 text-sm text-gray-600">
                        {((Math.max(...categoryData.data) / expenseData.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}% of total expenses
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
