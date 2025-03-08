
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
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added successfully");
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, ...transaction, updatedAt: new Date() } 
          : t
      )
    );
    toast.success("Transaction updated successfully");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transaction deleted successfully");
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
