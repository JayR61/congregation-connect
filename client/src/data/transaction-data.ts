
import { Transaction, FinanceCategory } from '@/types';

// TRANSACTIONS - All values start at 0, users must add data
export const mockTransactions: Transaction[] = [];

// FINANCE CATEGORIES
export const mockFinanceCategories: FinanceCategory[] = [
  {
    id: "category-1",
    name: "Offerings",
    type: "income",
    color: "#4caf50"
  },
  {
    id: "category-2",
    name: "Utilities",
    type: "expense",
    color: "#f44336"
  }
];

// Getter function
export const getTransactions = () => mockTransactions;

// Export directly for compatibility
export const transactions = mockTransactions;
