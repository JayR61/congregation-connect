
import { Transaction, FinanceCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface UseFinanceActionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  financeCategories: FinanceCategory[];
  setFinanceCategories: React.Dispatch<React.SetStateAction<FinanceCategory[]>>;
}

export const useFinanceActions = ({
  transactions,
  setTransactions,
  financeCategories,
  setFinanceCategories
}: UseFinanceActionsProps) => {
  // Transaction CRUD operations
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction | null => {
    try {
      const now = new Date();
      const newTransaction = {
        ...transaction,
        id: uuidv4(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>): boolean => {
    try {
      let found = false;
      setTransactions(prev => {
        return prev.map(transaction => {
          if (transaction.id === id) {
            found = true;
            return {
              ...transaction,
              ...updatedFields,
              updatedAt: new Date().toISOString()
            };
          }
          return transaction;
        });
      });
      return found;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  };

  const deleteTransaction = (id: string): boolean => {
    try {
      let found = false;
      setTransactions(prev => {
        const filtered = prev.filter(transaction => {
          if (transaction.id === id) {
            found = true;
            return false;
          }
          return true;
        });
        return filtered;
      });
      return found;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
  };

  // Finance Category CRUD operations
  const addFinanceCategory = (category: Omit<FinanceCategory, 'id'>): FinanceCategory | null => {
    try {
      const newCategory: FinanceCategory = {
        ...category,
        id: uuidv4()
      };
      
      setFinanceCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding finance category:', error);
      return null;
    }
  };

  const updateFinanceCategory = (id: string, updatedFields: Partial<FinanceCategory>): boolean => {
    try {
      let found = false;
      setFinanceCategories(prev => {
        return prev.map(category => {
          if (category.id === id) {
            found = true;
            return {
              ...category,
              ...updatedFields
            };
          }
          return category;
        });
      });
      return found;
    } catch (error) {
      console.error('Error updating finance category:', error);
      return false;
    }
  };

  const deleteFinanceCategory = (id: string): boolean => {
    try {
      let found = false;
      setFinanceCategories(prev => {
        const filtered = prev.filter(category => {
          if (category.id === id) {
            found = true;
            return false;
          }
          return true;
        });
        return filtered;
      });
      return found;
    } catch (error) {
      console.error('Error deleting finance category:', error);
      return false;
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addFinanceCategory,
    updateFinanceCategory,
    deleteFinanceCategory
  };
};

export default useFinanceActions;
