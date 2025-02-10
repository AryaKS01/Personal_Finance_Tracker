import { Plus, Target, Rocket, Car, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const goals = [
  {
    id: 1,
    name: 'Emergency Fund',
    icon: Rocket,
    target: 10000,
    current: 6500,
    deadline: '2024-12-31',
    color: '#4F46E5',
  },
  {
    id: 2,
    name: 'New Car',
    icon: Car,
    target: 25000,
    current: 8750,
    deadline: '2025-06-30',
    color: '#7C3AED',
  },
  {
    id: 3,
    name: 'House Down Payment',
    icon: Home,
    target: 50000,
    current: 15000,
    deadline: '2026-01-01',
    color: '#EC4899',
  },
];

export default function SavingsGoals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Savings Goals</h1>
              <p className="mt-2 text-sm text-gray-700">
                Track your progress towards your financial goals.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Add Goal
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <div
                  key={goal.id}
                  className="relative overflow-hidden rounded-lg bg-white shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md" style={{ backgroundColor: `${goal.color}20` }}>
                          <goal.icon className="h-6 w-6" style={{ color: goal.color }} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {goal.name}
                        </h3>
                        <p className="text-sm text-gray-500">Due {goal.deadline}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="mt-2">
                        <div className="relative">
                          <div className="h-2 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: goal.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <dl className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Current</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            ₹{goal.current.toLocaleString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Target</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            ₹{goal.target.toLocaleString()}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Add Funds
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
