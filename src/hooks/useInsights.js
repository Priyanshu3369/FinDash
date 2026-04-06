import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useInsights() {
  const { state } = useApp();
  const { transactions } = state;

  return useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    // Category breakdown (expenses only)
    const categoryMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);

    const highestCategory = categoryBreakdown[0] || { name: 'N/A', value: 0 };

    // Monthly comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthExpenses = transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'expense' && d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyChange = prevMonthExpenses > 0
      ? ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
      : 0;

    const currentMonthIncome = transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'income' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthIncome = transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'income' && d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0
      ? ((totalIncome - totalExpenses) / totalIncome) * 100
      : 0;

    // Average daily expense
    const uniqueDays = new Set(
      transactions.filter(t => t.type === 'expense').map(t => t.date)
    ).size;
    const avgDailyExpense = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;

    // Transaction count
    const transactionCount = transactions.length;
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      categoryBreakdown,
      highestCategory,
      currentMonthExpenses,
      prevMonthExpenses,
      monthlyChange,
      currentMonthIncome,
      prevMonthIncome,
      savingsRate,
      avgDailyExpense,
      transactionCount,
      incomeCount,
      expenseCount,
    };
  }, [transactions]);
}
