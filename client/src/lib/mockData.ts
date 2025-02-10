export const mockUserData = {
  monthlyIncome: 75000,
  currentBalance: 125000,
  savingsGoal: 25000,
  totalExpenses: 45000,
  mainExpenses: {
    housing: 20000,
    transportation: 8000,
    food: 10000,
    utilities: 3000,
    healthcare: 2000,
    entertainment: 2000,
  }
};

export const mockTransactions = [
  {
    id: 1,
    date: '2024-03-20',
    description: 'Salary Deposit',
    amount: 75000,
    type: 'income',
    category: 'salary'
  },
  {
    id: 2,
    date: '2024-03-19',
    description: 'Rent Payment',
    amount: 20000,
    type: 'expense',
    category: 'housing'
  },
  {
    id: 3,
    date: '2024-03-18',
    description: 'Grocery Shopping',
    amount: 2500,
    type: 'expense',
    category: 'food'
  },
  {
    id: 4,
    date: '2024-03-17',
    description: 'Electricity Bill',
    amount: 1500,
    type: 'expense',
    category: 'utilities'
  },
  {
    id: 5,
    date: '2024-03-16',
    description: 'Freelance Payment',
    amount: 15000,
    type: 'income',
    category: 'freelance'
  }
];

export const mockChartData = [
  { date: 'Mar 1', balance: 100000 },
  { date: 'Mar 5', balance: 115000 },
  { date: 'Mar 10', balance: 108000 },
  { date: 'Mar 15', balance: 122000 },
  { date: 'Mar 20', balance: 125000 }
];
