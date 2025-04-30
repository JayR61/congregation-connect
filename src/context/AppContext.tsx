import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  Member, Task, Transaction, FinanceCategory, Document, Folder, 
  DocumentVersion, Notification, User, Programme, TaskComment
} from '@/types';
import { getInitialData } from '@/data/mockData';
import { useTaskActions } from './actions/useTaskActions';
import { useMemberActions } from './actions/useMemberActions';
import { useFinanceActions } from './actions/useFinanceActions';
import { useDocumentActions } from './actions/useDocumentActions';
import { useNotificationActions } from './actions/useNotificationActions';
import { useProgrammeActions } from './actions/useProgrammeActions';

// Example of how to extend the AppContext with the missing functions
export interface AppContextProps {
  // Data states
  members: Member[];
  tasks: Task[];
  transactions: Transaction[];
  financeCategories: FinanceCategory[];
  documents: Document[];
  folders: Folder[];
  notifications: Notification[];
  currentUser: User | null;
  programmes: Programme[];
  
  // Setters
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setFinanceCategories: React.Dispatch<React.SetStateAction<FinanceCategory[]>>;
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updatedFields: Partial<Task>) => boolean;
  deleteTask: (id: string) => boolean;
  addTaskComment: (taskId: string, comment: Omit<TaskComment, 'id' | 'taskId' | 'createdAt'>) => boolean;
  
  // Member actions
  addMember: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => Member;
  updateMember: (id: string, updatedFields: Partial<Member>) => boolean;
  deleteMember: (id: string) => boolean;
  
  // Finance actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction | null;
  updateTransaction: (id: string, updatedFields: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => boolean;
  addFinanceCategory: (category: Omit<FinanceCategory, 'id'>) => FinanceCategory | null;
  updateFinanceCategory: (id: string, updatedFields: Partial<FinanceCategory>) => boolean;
  deleteFinanceCategory: (id: string) => boolean;
  
  // Document actions
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => Document;
  updateDocument: (id: string, updatedFields: Partial<Document>) => boolean;
  deleteDocument: (id: string) => boolean;
  addFolder: (folder: Omit<Folder, 'id'>) => Folder;
  updateFolder: (id: string, updatedFields: Partial<Folder>) => boolean;
  deleteFolder: (id: string) => boolean;
  addDocumentVersion: (documentId: string, fileUrl: string, notes?: string) => boolean;
  moveDocument: (documentId: string, folderId: string | null) => boolean;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  markNotificationAsRead: (id: string) => boolean;
  clearAllNotifications: () => boolean;
  
  // Programme actions
  addProgramme: (programme: Omit<Programme, 'id' | 'createdAt' | 'updatedAt'>) => Programme;
  updateProgramme: (id: string, updatedFields: Partial<Programme>) => boolean;
  deleteProgramme: (id: string) => boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [programmes, setProgrammes] = useState<Programme[]>([]);

  useEffect(() => {
    const initialData = getInitialData();
    setMembers(initialData.members);
    setTasks(initialData.tasks);
    setTransactions(initialData.transactions);
    setFinanceCategories(initialData.financeCategories);
    setDocuments(initialData.documents);
    setFolders(initialData.folders);
    setNotifications(initialData.notifications);
    setCurrentUser(initialData.currentUser);
    setProgrammes(initialData.programmes);
  }, []);

  // Task actions
  const {
    addTask,
    updateTask,
    deleteTask,
    addTaskComment
  } = useTaskActions({ tasks, setTasks, currentUser });

  // Member actions
  const {
    addMember,
    updateMember,
    deleteMember
  } = useMemberActions({ members, setMembers });

  // Finance actions
  const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addFinanceCategory,
    updateFinanceCategory,
    deleteFinanceCategory
  } = useFinanceActions({ transactions, setTransactions, financeCategories, setFinanceCategories });

  // Document actions
  const {
    addDocument,
    updateDocument,
    deleteDocument,
    addFolder,
    updateFolder,
    deleteFolder,
    addDocumentVersion,
    moveDocument
  } = useDocumentActions({ documents, setDocuments, folders, setFolders, currentUser });

  // Notification actions
  const {
    addNotification,
    markNotificationAsRead,
    clearAllNotifications
  } = useNotificationActions({ notifications, setNotifications });

  // Programme actions
  const {
    addProgramme,
    updateProgramme,
    deleteProgramme
  } = useProgrammeActions({ programmes, setProgrammes });

  return (
    <AppContext.Provider
      value={{
        members,
        tasks,
        transactions,
        financeCategories,
        documents,
        folders,
        notifications,
        currentUser,
        programmes,
        setMembers,
        setTasks,
        setTransactions,
        setFinanceCategories,
        setDocuments,
        setFolders,
        setNotifications,
        setCurrentUser,
        setProgrammes,
        addTask,
        updateTask,
        deleteTask,
        addTaskComment,
        addMember,
        updateMember,
        deleteMember,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addFinanceCategory,
        updateFinanceCategory,
        deleteFinanceCategory,
        addDocument,
        updateDocument,
        deleteDocument,
        addFolder,
        updateFolder,
        deleteFolder,
        addDocumentVersion,
        moveDocument,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        addProgramme,
        updateProgramme,
        deleteProgramme,
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
