import { createContext, useContext, useReducer, useEffect } from 'react';
import generateTransactions from '../data/transactions';

const AppContext = createContext(null);

/* ─── Persistence helpers ─── */
const loadState = () => {
  try {
    const saved = localStorage.getItem('finance-dashboard-state');
    return saved ? JSON.parse(saved) : null;
  } catch {
    console.warn('Failed to load state from localStorage');
    return null;
  }
};

const saved = loadState();

/* ─── System preference detection ─── */
const getInitialDarkMode = () => {
  // 1. Check saved preference first
  if (saved?.darkMode !== undefined) return saved.darkMode;
  // 2. Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/* ─── Initial State ─── */
const initialState = {
  transactions: saved?.transactions ?? generateTransactions(),
  role:         saved?.role        ?? 'admin',
  darkMode:     getInitialDarkMode(),
  nextId:       saved?.nextId      ?? 26,
  filters: {
    search:    '',
    type:      'all',
    category:  'all',
    sortBy:    'date',
    sortOrder: 'desc',
  },
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
};

/* ─── Reducer ─── */
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { search: '', type: 'all', category: 'all', sortBy: 'date', sortOrder: 'desc' },
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [{ ...action.payload, id: state.nextId }, ...state.transactions],
        nextId: state.nextId + 1,
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    default:
      return state;
  }
}

/* ─── Provider ─── */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist key slices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'finance-dashboard-state',
        JSON.stringify({
          transactions: state.transactions,
          role:         state.role,
          darkMode:     state.darkMode,
          nextId:       state.nextId,
        })
      );
    } catch {
      console.warn('Failed to save state to localStorage');
    }
  }, [state.transactions, state.role, state.darkMode, state.nextId]);

  // Sync dark-mode class on <html> with smooth transition
  useEffect(() => {
    const root = document.documentElement;
    // Add transition class briefly for smooth theme switch
    root.classList.add('theme-transitioning');
    root.classList.toggle('dark', state.darkMode);
    // Remove transition class after animation completes
    const timer = setTimeout(() => root.classList.remove('theme-transitioning'), 300);
    return () => clearTimeout(timer);
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/* ─── Hook ─── */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}

export default AppContext;