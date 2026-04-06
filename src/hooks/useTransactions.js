import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useTransactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters } = state;

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (filters.sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [transactions, filters]);

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
    resetFilters,
  };
}
