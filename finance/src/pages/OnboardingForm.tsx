import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { 
  IndianRupee, 
  PiggyBank, 
  Home, 
  Car, 
  Coffee, 
  Lightbulb, 
  Heart, 
  Film,
  ArrowRight,
  Wallet
} from 'lucide-react';

const expenseIcons = {
  housing: Home,
  transportation: Car,
  food: Coffee,
  utilities: Lightbulb,
  healthcare: Heart,
  entertainment: Film,
};

const expenseDescriptions = {
  housing: 'Rent, mortgage, or property maintenance',
  transportation: 'Vehicle expenses, fuel, or public transport',
  food: 'Groceries and dining out',
  utilities: 'Electricity, water, and internet bills',
  healthcare: 'Medical expenses and insurance',
  entertainment: 'Movies, hobbies, and leisure activities',
};

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const totalExpenses = Object.values(formData.mainExpenses)
        .reduce((sum, value) => sum + (parseFloat(value) || 0), 0);

      const userData = {
        monthlyIncome: parseFloat(formData.monthlyIncome),
        savingsGoal: parseFloat(formData.savingsGoal),
        mainExpenses: formData.mainExpenses,
        currentBalance: parseFloat(formData.monthlyIncome) - totalExpenses,
        totalExpenses: totalExpenses,
        currency: 'INR',
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      };

      if (!auth.currentUser?.uid) {
        throw new Error('No authenticated user found');
      }

      await setDoc(doc(db, 'users', auth.currentUser.uid), userData);
      toast.success('Your financial profile has been created! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save preferences');
      console.error('Error saving preferences:', error);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.monthlyIncome || !formData.savingsGoal)) {
      toast.error('Please fill in all fields before proceeding');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const calculateProgress = () => {
    const filledExpenses = Object.values(formData.mainExpenses).filter(value => value !== '').length;
    const totalFields = Object.keys(formData.mainExpenses).length + 2; // +2 for income and savings
    const filledFields = filledExpenses + (formData.monthlyIncome ? 1 : 0) + (formData.savingsGoal ? 1 : 0);
    return (filledFields / totalFields) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
            <PiggyBank className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Financial Journey Starts Here
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Let's create your personalized financial plan together
          </p>
        </div>

        <div className="relative mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-right">
            {Math.round(calculateProgress())}% completed
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center space-x-2 mb-6">
                    <Wallet className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Income & Savings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="group">
                      <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                        Monthly Income
                      </label>
                      <div className="mt-2 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="number"
                          id="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                          className="block w-full pl-12 pr-12 py-3 text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="0.00"
                          required
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">INR</span>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="savingsGoal" className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                        Monthly Savings Goal
                      </label>
                      <div className="mt-2 relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          type="number"
                          id="savingsGoal"
                          value={formData.savingsGoal}
                          onChange={(e) => setFormData({ ...formData, savingsGoal: e.target.value })}
                          className="block w-full pl-12 pr-12 py-3 text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="0.00"
                          required
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">INR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Continue to Expenses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center space-x-2 mb-6">
                    <PiggyBank className="h-6 w-6 text-indigo-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Monthly Expenses</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {Object.entries(formData.mainExpenses).map(([key, value]) => {
                      const Icon = expenseIcons[key as keyof typeof expenseIcons];
                      return (
                        <div key={key} className="group">
                          <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize group-hover:text-indigo-600 transition-colors">
                            {key}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {expenseDescriptions[key as keyof typeof expenseDescriptions]}
                          </p>
                          <div className="mt-2 relative rounded-lg shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
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
                              className="block w-full pl-12 pr-12 py-3 text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              placeholder="0.00"
                              required
                              min="0"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">INR</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-4">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Create Financial Profile
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full inline-flex items-center justify-center py-3 px-6 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Back to Income & Savings
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}