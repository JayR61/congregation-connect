
import { Transaction, Task, Document, Folder, Member } from '@/types';
import { 
  getInitialData, 
  formatCurrency, 
  formatDate, 
  getTransactionTotals,
  getMemberCounts,
  getDocumentsByFolder,
  getFolderPath,
  getTaskStatistics,
  formatFileSize
} from '@/data/mockData';

// Re-export all helper functions for backward compatibility
export {
  formatCurrency,
  formatDate,
  getTransactionTotals,
  getMemberCounts,
  getDocumentsByFolder,
  getFolderPath,
  getTaskStatistics,
  formatFileSize
};

// Get data from the mockData.ts exports
const { members, documents, folders, tasks, transactions } = getInitialData();
