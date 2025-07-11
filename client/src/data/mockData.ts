
// Import all mock data from domain-specific files
import { formatCurrency, formatDate, fixMemberData } from './mock-helpers';
import { mockMembers, members, getMembers } from './member-data';
import { mockTasks, tasks, getTasks, mockTaskCategories } from './task-data';
import { mockTransactions, transactions, getTransactions, mockFinanceCategories } from './transaction-data';
import { mockDocuments, documents, mockFolders, folders, getDocumentsByFolder, getFolderPath, formatFileSize } from './document-data';
import { mockProgrammes, programmes, mockProgrammeTags, mockKpis, mockReminders, mockTemplates } from './programme-data';
import { mockCurrentUser, mockNotifications } from './user-data';
import { mockResources, resources, mockAttendance, attendance, mockResourceBookings, resourceBookings } from './resource-attendance-data';

// Additional mock data needed for AppProvider that wasn't explicitly defined elsewhere
export const mockCategories = [];
export const mockTags = [];
export const mockFeedback = [];

// Re-export everything for backward compatibility
export {
  mockMembers,
  members,
  getMembers,
  mockTasks,
  tasks,
  getTasks,
  mockTaskCategories,
  mockTransactions,
  transactions,
  getTransactions,
  mockFinanceCategories,
  mockDocuments,
  documents,
  mockFolders,
  folders,
  getDocumentsByFolder,
  getFolderPath,
  formatFileSize,
  mockProgrammes,
  programmes,
  mockProgrammeTags,
  mockKpis,
  mockReminders,
  mockTemplates,
  mockCurrentUser,
  mockNotifications,
  mockResources,
  resources,
  mockAttendance,
  attendance,
  mockResourceBookings,
  resourceBookings,
  fixMemberData,
  formatCurrency,
  formatDate
};

// Helper function to get transaction totals
export const getTransactionTotals = () => {
  return mockTransactions.reduce(
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
  const active = mockMembers.filter(member => member.isActive).length;
  const inactive = mockMembers.filter(member => !member.isActive).length;
  const total = mockMembers.length;
  
  return { active, inactive, total };
};

// Helper function to get task statistics
export const getTaskStatistics = () => {
  const pending = mockTasks.filter(task => task.status === 'pending').length;
  const inProgress = mockTasks.filter(task => task.status === 'in-progress').length;
  const completed = mockTasks.filter(task => task.status === 'completed').length;
  const total = mockTasks.length;
  
  return { pending, inProgress, completed, total };
};

// Helper function to get initial data for the app context
export const getInitialData = () => {
  return {
    members: mockMembers,
    tasks: mockTasks,
    transactions: mockTransactions,
    financeCategories: mockFinanceCategories,
    documents: mockDocuments,
    folders: mockFolders,
    notifications: mockNotifications,
    currentUser: mockCurrentUser,
    programmes: mockProgrammes,
    taskCategories: mockTaskCategories
  };
};
