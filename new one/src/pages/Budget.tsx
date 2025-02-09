import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

ChartJS.register(ArcElement, Tooltip, Legend);

const categories = [
  { name: 'Housing', budgeted: 1500, spent: 1450, color: '#EF4444' },
  { name: 'Food', budgeted: 600, spent: 580, color: '#F59E0B' },
  { name: 'Transportation', budgeted: 400, spent: 385, color: '#10B981' },
  { name: 'Utilities', budgeted: 300, spent: 290, color: '#6366F1' },
  { name: 'Entertainment', budgeted: 200, spent: 220, color: '#8B5CF6' },
  { name: 'Healthcare', budgeted: 300, spent: 150, color: '#EC4899' },
];

const chartData = {
  labels: categories.map(cat => cat.name),
  datasets: [
    {
      data: categories.map(cat => cat.spent),
      backgroundColor: categories.map(cat => cat.color),
      borderColor: categories.map(cat => cat.color),
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: '70%',
};

export default function Budget() {
  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalBudgeted - totalSpent;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Budget Overview</h1>
              <p className="mt-2 text-sm text-gray-700">
                Track your spending against your budget across different categories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Budget Categories</h3>
                </div>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const percentage = (category.spent / category.budgeted) * 100;
                    const isOverBudget = category.spent > category.budgeted;
                    return (
                      <div key={category.name}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹{category.spent} / ₹{category.budgeted}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="relative">
                            <div className="h-2 rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${Math.min(percentage, 100)}%`,
                                  backgroundColor: category.color,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-end">
                          <span
                            className={`text-xs font-medium ${
                              isOverBudget ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Budget Summary</h3>
                <div className="mt-6 relative">
                  <div className="relative h-[200px] w-[200px] mx-auto">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-sm font-medium text-gray-500">Remaining</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹{remainingBudget.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <dl className="grid grid-cols-1 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Total Budget</dt>
                      <dd className="mt-1 flex items-baseline justify-between">
                        <div className="flex items-baseline text-xl font-semibold text-gray-900">
                          ₹{totalBudgeted.toFixed(2)}
                        </div>
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                      <dd className="mt-1 flex items-baseline justify-between">
                        <div className="flex items-baseline text-xl font-semibold text-gray-900">
                          ₹{totalSpent.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {((totalSpent / totalBudgeted) * 100).toFixed(1)}%
                        </div>
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
