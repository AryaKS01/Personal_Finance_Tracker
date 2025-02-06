import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Search, Filter, Edit2, Trash2, Plus,
  Check, X, ChevronDown, ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ showAll = true, limit = null }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    'food', 'transportation', 'utilities', 'entertainment',
    'shopping', 'housing', 'healthcare', 'other'
  ]);

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
    status: 'completed'
  });

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedCategories = localStorage.getItem('categories');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    let result = [...transactions];

    // Search filter
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
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

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
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    // Apply limit if specified
    if (limit && !showAll) {
      result = result.slice(0, limit);
    }

    setFilteredTransactions(result);
  }, [transactions, searchTerm, filters, sortConfig, limit, showAll]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transaction = {
      ...newTransaction,
      id: Date.now(),
      amount: parseFloat(newTransaction.amount)
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Dispatch storage event to update dashboard
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'transactions',
      newValue: JSON.stringify(updatedTransactions)
    }));

    setNewTransaction({
      description: '',
      amount: '',
      category: 'food',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      status: 'completed'
    });

    toast.success('Transaction added successfully!');
  };

  const handleEdit = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingId(id);
      setNewTransaction(transaction);
    }
  };

  const handleUpdate = () => {
    const updatedTransactions = transactions.map(t =>
      t.id === editingId ? { ...newTransaction, id: editingId } : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Dispatch storage event to update dashboard
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'transactions',
      newValue: JSON.stringify(updatedTransactions)
    }));

    setEditingId(null);
    setNewTransaction({
      description: '',
      amount: '',
      category: 'food',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'expense',
      status: 'completed'
    });
    toast.success('Transaction updated successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      toast.success('Transaction deleted successfully!');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory.toLowerCase())) {
      const updatedCategories = [...categories, newCategory.toLowerCase()];
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setNewCategory('');
      toast.success('Category added successfully!');
    } else {
      toast.error('Category already exists or is invalid!');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!showAll) {
    return (
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {filteredTransactions.map((transaction, idx) => (
            <li key={transaction.id}>
              <div className="relative pb-8">
                {idx !== filteredTransactions.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {transaction.type === 'expense' ? '−' : '+'}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {transaction.description} 
                        <span className={`ml-2 font-medium ${
                          transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={transaction.date}>
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={newTransaction.status}
                onChange={(e) => setNewTransaction({ ...newTransaction, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewTransaction({
                    description: '',
                    amount: '',
                    category: 'food',
                    date: format(new Date(), 'yyyy-MM-dd'),
                    type: 'expense',
                    status: 'completed'
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <Filter size={20} />
            Filters
            <ChevronDown size={20} className={`transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })} className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Transactions</h3>
          <p className="text-sm text-gray-500">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(transaction.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;