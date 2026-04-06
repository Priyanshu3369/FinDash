// Mock transaction data for the finance dashboard
const generateTransactions = () => {
  const categories = ['Food', 'Travel', 'Shopping', 'Salary', 'Bills', 'Entertainment', 'Healthcare', 'Education'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Refund'];
  
  const transactions = [
    { id: 1, date: '2026-04-01', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: 2, date: '2026-04-01', description: 'Grocery Store', amount: 85.50, category: 'Food', type: 'expense' },
    { id: 3, date: '2026-03-31', description: 'Electric Bill', amount: 142.00, category: 'Bills', type: 'expense' },
    { id: 4, date: '2026-03-30', description: 'Freelance Project Payment', amount: 1200, category: 'Freelance', type: 'income' },
    { id: 5, date: '2026-03-29', description: 'Flight to Mumbai', amount: 340.00, category: 'Travel', type: 'expense' },
    { id: 6, date: '2026-03-28', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense' },
    { id: 7, date: '2026-03-27', description: 'Amazon Purchase', amount: 210.50, category: 'Shopping', type: 'expense' },
    { id: 8, date: '2026-03-26', description: 'Restaurant Dinner', amount: 62.00, category: 'Food', type: 'expense' },
    { id: 9, date: '2026-03-25', description: 'Investment Return', amount: 450.00, category: 'Investment', type: 'income' },
    { id: 10, date: '2026-03-24', description: 'Uber Rides', amount: 28.50, category: 'Travel', type: 'expense' },
    { id: 11, date: '2026-03-23', description: 'Online Course', amount: 49.99, category: 'Education', type: 'expense' },
    { id: 12, date: '2026-03-22', description: 'Medical Checkup', amount: 175.00, category: 'Healthcare', type: 'expense' },
    { id: 13, date: '2026-03-20', description: 'Internet Bill', amount: 59.99, category: 'Bills', type: 'expense' },
    { id: 14, date: '2026-03-18', description: 'Coffee Shop', amount: 12.40, category: 'Food', type: 'expense' },
    { id: 15, date: '2026-03-15', description: 'Clothing Store', amount: 189.00, category: 'Shopping', type: 'expense' },
    { id: 16, date: '2026-03-14', description: 'Gas Station', amount: 45.00, category: 'Travel', type: 'expense' },
    { id: 17, date: '2026-03-12', description: 'Movie Tickets', amount: 24.00, category: 'Entertainment', type: 'expense' },
    { id: 18, date: '2026-03-10', description: 'Gym Membership', amount: 40.00, category: 'Healthcare', type: 'expense' },
    { id: 19, date: '2026-03-08', description: 'Refund - Returned Item', amount: 89.99, category: 'Refund', type: 'income' },
    { id: 20, date: '2026-03-05', description: 'Phone Bill', amount: 55.00, category: 'Bills', type: 'expense' },
    { id: 21, date: '2026-03-01', description: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income' },
    { id: 22, date: '2026-02-28', description: 'Book Purchase', amount: 32.00, category: 'Education', type: 'expense' },
    { id: 23, date: '2026-02-25', description: 'Dental Visit', amount: 250.00, category: 'Healthcare', type: 'expense' },
    { id: 24, date: '2026-02-20', description: 'Concert Tickets', amount: 120.00, category: 'Entertainment', type: 'expense' },
    { id: 25, date: '2026-02-15', description: 'Water Bill', amount: 35.00, category: 'Bills', type: 'expense' },
  ];

  return transactions;
};

// Monthly balance trend data
export const balanceTrendData = [
  { month: 'Oct', income: 5200, expenses: 1850, balance: 3350 },
  { month: 'Nov', income: 5650, expenses: 2200, balance: 3450 },
  { month: 'Dec', income: 6800, expenses: 3100, balance: 3700 },
  { month: 'Jan', income: 5200, expenses: 1950, balance: 3250 },
  { month: 'Feb', income: 5200, expenses: 2180, balance: 3020 },
  { month: 'Mar', income: 6939.99, expenses: 1534.87, balance: 5405.12 },
  { month: 'Apr', income: 5200, expenses: 85.50, balance: 5114.50 },
];

// Category colors for charts
export const categoryColors = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Shopping: '#8b5cf6',
  Salary: '#10b981',
  Bills: '#ef4444',
  Entertainment: '#ec4899',
  Healthcare: '#14b8a6',
  Education: '#f59e0b',
  Freelance: '#06b6d4',
  Investment: '#84cc16',
  Refund: '#6366f1',
};

export const allCategories = [
  'Food', 'Travel', 'Shopping', 'Salary', 'Bills',
  'Entertainment', 'Healthcare', 'Education', 'Freelance',
  'Investment', 'Refund'
];

export default generateTransactions;
