
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Transaction, Member, Document, Folder, User, Notification, TaskCategory, FinanceCategory, TaskComment } from '../types';
import { 
  transactions as initialTransactions,
  members as initialMembers,
  documents as initialDocuments,
  folders as initialFolders,
  currentUser as initialCurrentUser,
  notifications as initialNotifications,
  taskCategories as initialTaskCategories,
  financeCategories as initialFinanceCategories
} from '../data/mockData';
import { toast } from '@/lib/toast';
import { useTaskActions } from './actions/useTaskActions';
import { useTransactionActions } from './actions/useTransactionActions';
import { useMemberActions } from './actions/useMemberActions';
import { useDocumentActions } from './actions/useDocumentActions';
import { useNotificationActions } from './actions/useNotificationActions';

const initialTasks: Task[] = [];

interface AppContextType {
  currentUser: User;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  
  tasks: Task[];
  taskCategories: TaskCategory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'comments'>) => void;
  updateTask: (id: string, task: Partial<Task>, editorId?: string) => void;
  deleteTask: (id: string, deleterId?: string) => void;
  addTaskComment: (taskId: string, content: string) => void;
  
  transactions: Transaction[];
  financeCategories: FinanceCategory[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  documents: Document[];
  folders: Folder[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'versions'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>(initialTaskCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>(initialFinanceCategories);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const taskActions = useTaskActions({
    tasks,
    setTasks,
    currentUser,
    members,
    addNotification: (notification) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }
  });

  const transactionActions = useTransactionActions({
    transactions,
    setTransactions,
    currentUser
  });

  const memberActions = useMemberActions({
    members,
    setMembers
  });

  const documentActions = useDocumentActions({
    documents,
    setDocuments,
    folders,
    setFolders,
    currentUser
  });

  const notificationActions = useNotificationActions({
    notifications,
    setNotifications
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        notifications,
        markNotificationAsRead: notificationActions.markNotificationAsRead,
        addNotification: notificationActions.addNotification,
        tasks,
        taskCategories,
        addTask: taskActions.addTask,
        updateTask: taskActions.updateTask,
        deleteTask: taskActions.deleteTask,
        addTaskComment: taskActions.addTaskComment,
        transactions,
        financeCategories,
        addTransaction: transactionActions.addTransaction,
        updateTransaction: transactionActions.updateTransaction,
        deleteTransaction: transactionActions.deleteTransaction,
        members,
        addMember: memberActions.addMember,
        updateMember: memberActions.updateMember,
        deleteMember: memberActions.deleteMember,
        documents,
        folders,
        addDocument: documentActions.addDocument,
        updateDocument: documentActions.updateDocument,
        deleteDocument: documentActions.deleteDocument,
        addFolder: documentActions.addFolder,
        updateFolder: documentActions.updateFolder,
        deleteFolder: documentActions.deleteFolder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
