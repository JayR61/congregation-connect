
import { Transaction, FinanceCategory } from '@/types';

// TRANSACTIONS
export const mockTransactions: Transaction[] = [
  {
    id: "transaction-1",
    description: "Sunday offering",
    amount: 1250.00,
    type: "income",
    category: ["Offerings"],  // Using string array instead of string
    categoryId: "category-1",
    date: new Date(2023, 4, 7),
    attachments: [],
    isRecurring: false,
    createdById: "member-1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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
