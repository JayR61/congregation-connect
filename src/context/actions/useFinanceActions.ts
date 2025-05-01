
import { Transaction, FinanceCategory } from '@/types';
import { toast } from '@/lib/toast';

interface UseFinanceActionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: FinanceCategory[];
  setCategories: React.Dispatch<React.SetStateAction<FinanceCategory[]>>;
}

export const useFinanceActions = ({
  transactions,
  setTransactions,
  categories,
  setCategories
}: UseFinanceActionsProps) => {
  
  // Transaction actions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added successfully");
    return newTransaction;
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    let updated = false;
    
    setTransactions(prev => 
      prev.map(t => {
        if (t.id === id) {
          updated = true;
          return { ...t, ...transaction };
        }
        return t;
      })
    );
    
    if (updated) {
      toast.success("Transaction updated successfully");
    }
    
    return updated;
  };

  const deleteTransaction = (id: string) => {
    let deleted = false;
    
    setTransactions(prev => {
      const filtered = prev.filter(t => {
        if (t.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    if (deleted) {
      toast.success("Transaction deleted successfully");
    }
    
    return deleted;
  };

  // Category actions
  const addCategory = (category: Omit<FinanceCategory, 'id'>) => {
    const newCategory: FinanceCategory = {
      ...category,
      id: `category-${Date.now()}`
    };
    
    setCategories(prev => [...prev, newCategory]);
    toast.success("Category added successfully");
    return newCategory;
  };

  const updateCategory = (id: string, category: Partial<FinanceCategory>) => {
    let updated = false;
    
    setCategories(prev => 
      prev.map(c => {
        if (c.id === id) {
          updated = true;
          return { ...c, ...category };
        }
        return c;
      })
    );
    
    if (updated) {
      toast.success("Category updated successfully");
    }
    
    return updated;
  };

  const deleteCategory = (id: string) => {
    let deleted = false;
    
    // Check if category is being used in transactions
    const categoryInUse = transactions.some(t => t.categoryId === id);
    
    if (categoryInUse) {
      toast.error("Cannot delete category that is in use");
      return false;
    }
    
    setCategories(prev => {
      const filtered = prev.filter(c => {
        if (c.id === id) {
          deleted = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    if (deleted) {
      toast.success("Category deleted successfully");
    }
    
    return deleted;
  };
  
  // Financial reporting
  const calculateIncomeExpenseSummary = () => {
    return transactions.reduce(
      (summary, transaction) => {
        if (transaction.type === 'income') {
          summary.income += transaction.amount;
        } else {
          summary.expense += transaction.amount;
        }
        return summary;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    calculateIncomeExpenseSummary
  };
};
