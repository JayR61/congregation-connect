
import { Transaction, Task, Document, Folder, Member } from '@/types';
import { members, documents, folders, tasks, transactions } from '@/data/mockData';

// Helper function to format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
};

// Helper function to format dates
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get transaction totals
export const getTransactionTotals = () => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );
};

// Helper function to get member counts
export const getMemberCounts = () => {
  const active = members.filter(member => member.isActive).length;
  const inactive = members.filter(member => !member.isActive).length;
  const total = members.length;
  
  return { active, inactive, total };
};

// Helper function to get documents by folder
export const getDocumentsByFolder = (folderId: string | null) => {
  return documents.filter(doc => doc.folderId === folderId);
};

// Helper function to get folder path
export const getFolderPath = (folderId: string | null): string => {
  if (!folderId) return 'Root';
  
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return 'Unknown';
  
  if (!folder.parentId) return folder.name;
  
  return `${getFolderPath(folder.parentId)} > ${folder.name}`;
};

// Helper function to get task statistics
export const getTaskStatistics = () => {
  const pending = tasks.filter(task => task.status === 'pending').length;
  const inProgress = tasks.filter(task => task.status === 'in-progress').length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const total = tasks.length;
  
  return { pending, inProgress, completed, total };
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};
