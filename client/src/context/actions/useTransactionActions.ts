
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
    let transactionToDelete: Transaction | null = null;
    
    setTransactions(prev => {
      const filtered = prev.filter(t => {
        if (t.id === id) {
          deleted = true;
          transactionToDelete = t;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    if (deleted && transactionToDelete) {
      const deletionInfo = {
        deletedAt: new Date(),
        deletedById: currentUser.id,
        deletedByName: `${currentUser.firstName} ${currentUser.lastName}`,
        amount: transactionToDelete.amount,
        description: transactionToDelete.description,
        type: transactionToDelete.type
      };
      
      // Log deletion for audit trail
      console.log(`Transaction deleted by ${deletionInfo.deletedByName} at ${deletionInfo.deletedAt}:`, {
        id,
        amount: deletionInfo.amount,
        description: deletionInfo.description,
        type: deletionInfo.type
      });
      
      toast.success(`Transaction deleted successfully by ${deletionInfo.deletedByName}`);
    }
    return deleted;
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
