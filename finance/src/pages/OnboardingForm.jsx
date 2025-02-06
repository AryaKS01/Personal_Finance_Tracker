import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    savingsGoal: '',
    mainExpenses: {
      housing: '',
      transportation: '',
      food: '',
      utilities: '',
      healthcare: '',
      entertainment: '',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalExpenses = Object.values(formData.mainExpenses)
        .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

      const userData = {
        monthlyIncome: parseFloat(formData.monthlyIncome),
        savingsGoal: parseFloat(formData.savingsGoal),
        mainExpenses: formData.mainExpenses,
        currentBalance: parseFloat(formData.monthlyIncome) - totalExpenses,
        currency: 'INR'
      };

      // Save the user data to localStorage with the key 'onboardingDetails'
      localStorage.setItem('onboardingDetails', JSON.stringify(userData));

      toast.success('Preferences saved successfully!');
      
      // Backend team: Replace this console.log with an API call to store data in MongoDB
      console.log('User Data:', userData);
      
      // Backend team: Ensure the dashboard route is accessible after successful data storage
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Let's Get Started
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about your finances to personalize your experience
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                Monthly Income (₹)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700">
                Monthly Savings Goal (₹)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Monthly Expenses (₹)</h3>
              <div className="mt-4 space-y-4">
                {Object.entries(formData.mainExpenses).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                      {key}
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id={key}
                        value={value}
                        onChange={(e) => setFormData({
                          ...formData,
                          mainExpenses: {
                            ...formData.mainExpenses,
                            [key]: e.target.value
                          }
                        })}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

