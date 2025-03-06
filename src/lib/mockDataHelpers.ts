
import { members, documents, folders, tasks, transactions } from '@/data/mockData';
import { Member, Document, Folder, Task, Transaction } from '@/types';

// Helper functions to convert arrays to maps for faster lookups
export const getMemberById = (id: string): Member | undefined => {
  return members.find(member => member.id === id);
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};

export const getDocumentById = (id: string): Document | undefined => {
  return documents.find(doc => doc.id === id);
};

export const getFolderById = (id: string): Folder | undefined => {
  return folders.find(folder => folder.id === id);
};

export const getTransactionById = (id: string): Transaction | undefined => {
  return transactions.find(transaction => transaction.id === id);
};

// Convert categorical ID to human-readable name
export const getCategoryName = (categoryId: string): string => {
  // This is a placeholder - in a real app, you'd lookup the category by ID
  return categoryId.replace('fin-cat-', 'Category ');
};

// Helper to format member names
export const formatMemberName = (member: Member): string => {
  return `${member.firstName} ${member.lastName}`;
};
