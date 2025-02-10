import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { 
  Search, Filter, Edit2, Trash2, Plus,
  Check, X, ChevronDown, ArrowUpDown
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTransactions } from '@/hooks/useTransactions';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
  status: 'completed' | 'pending' | 'cancelled';
}

interface Filters {
  category: string;
  status: string;
  type: string;
  dateRange: string;
}

export default function Transactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    'food', 'transportation', 'utilities', 'entertainment',
    'shopping', 'housing', 'healthcare', 'other'
  ]);

  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: 0,
    description: '',
    amount: 0,
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
    status: 'completed'
  });

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedCategories = localStorage.getItem('categories');

    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (searchTerm) {
      result = result.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(transaction => transaction.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(transaction => transaction.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(transaction => transaction.type === filters.type);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      result = result.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        if (filters.dateRange === 'last7days') {
          return transactionDate >= sevenDaysAgo;
        } else if (filters.dateRange === 'last30days') {
          return transactionDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filters, sortConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now(),
      amount: Number(newTransaction.amount) // Ensure it's a number
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    setNewTransaction({
      id: 0,
      description: '',
      amount: 0,
      category: 'food',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      status: 'completed'
    });

    toast({
      title: "Success",
      description: "Transaction added successfully!"
    });
  };

  const handleEdit = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingId(id);
      setNewTransaction(transaction);
    }
  };

  const handleUpdate = () => {
    const updatedTransactions = transactions.map(t =>
      t.id === editingId ? { ...newTransaction, id: editingId, amount: Number(newTransaction.amount) } : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    setEditingId(null);
    setNewTransaction({
      id: 0,
      description: '',
      amount: 0,
      category: 'food',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      status: 'completed'
    });
    toast({
      title: "Success",
      description: "Transaction updated successfully!"
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      toast({
        title: "Success",
        description: "Transaction deleted successfully!"
      });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory.toLowerCase())) {
      const updatedCategories = [...categories, newCategory.toLowerCase()];
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setNewCategory('');
      toast({
        title: "Success",
        description: "Category added successfully!"
      });
    } else {
      toast({
        title: "Error",
        description: "Category already exists or is invalid!",
        variant: "destructive"
      });
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Add New Category Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="flex gap-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter new category"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Add/Edit Transaction Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
  value={newTransaction.type}
  onChange={(e) => 
    setNewTransaction({ 
      ...newTransaction, 
      type: e.target.value as "expense" | "income" // Casting the value here
    })
  }
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
>
  <option value="expense">Expense</option>
  <option value="income">Income</option>
</select>

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
  value={newTransaction.status}
  onChange={(e) => 
    setNewTransaction({ 
      ...newTransaction, 
      status: e.target.value as "completed" | "pending" | "cancelled" // Casting the value here
    })
  }
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
>
  <option value="completed">Completed</option>
  <option value="pending">Pending</option>
  <option value="cancelled">Cancelled</option> {/* Added cancelled option */}
</select>

                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Transaction List and Other UI Elements */}
          {/* Include filtering, sorting, and displaying transactions here */}
        </div>
      </main>
    </div>
  );
}
