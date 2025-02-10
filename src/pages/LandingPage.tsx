import React from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PieChart, TrendingUp, DollarSign, Wallet2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Wallet2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinanceFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-gray-900">Take Control of Your</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Financial Future
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Track expenses, set budgets, and achieve your financial goals with our comprehensive personal finance management tool.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="mb-4 sm:mb-0 sm:mr-4">
                <Link href="/register">
                  <Button size="lg" className="w-full">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full">
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to manage your finances
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, powerful tools to help you make better financial decisions
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Budget Management</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create and track budgets across different categories to keep your spending in check.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Expense Tracking</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Monitor your spending patterns and categorize transactions automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Savings Goals</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Set and track savings goals with visual progress indicators.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to start your financial journey?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Join thousands of users who have already taken control of their finances
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Create Your Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
