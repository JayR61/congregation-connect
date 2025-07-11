
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
    name: "Donations",
    type: "income",
    color: "#2196f3"
  },
  {
    id: "category-3",
    name: "Tithes",
    type: "income",
    color: "#9c27b0"
  },
  {
    id: "category-4",
    name: "Fundraising",
    type: "income",
    color: "#ff9800"
  },
  {
    id: "category-5",
    name: "Utilities",
    type: "expense",
    color: "#f44336"
  },
  {
    id: "category-6",
    name: "Maintenance",
    type: "expense",
    color: "#795548"
  },
  {
    id: "category-7",
    name: "Ministry",
    type: "expense",
    color: "#607d8b"
  },
  {
    id: "category-8",
    name: "Equipment",
    type: "expense",
    color: "#e91e63"
  }
];

// Getter function
export const getTransactions = () => mockTransactions;

// Export directly for compatibility
export const transactions = mockTransactions;
