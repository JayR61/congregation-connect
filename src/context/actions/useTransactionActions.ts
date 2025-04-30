
import { Transaction, User } from '@/types';
import { toast } from '@/lib/toast';

interface UseTransactionActionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentUser: User;
}

export const useTransactionActions = ({
  transactions,
  setTransactions,
  currentUser
}: UseTransactionActionsProps) => {
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
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
          return { 
            ...t, 
            ...transaction, 
            updatedAt: new Date() 
          };
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

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
