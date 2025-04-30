import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  Member, Task, Transaction, FinanceCategory, Document, Folder, 
  DocumentVersion, Notification, User, Programme, TaskComment,
  TaskCategory
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
  taskCategories: TaskCategory[]; // Added taskCategories
  
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
  setTaskCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>; // Added setter for taskCategories
  
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
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);

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
    setTaskCategories(initialData.taskCategories || []);
  }, []);

  // Mock addNotification function for useTaskActions
  const mockAddNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      createdAt: new Date(),
      read: false,
      ...notification,
      userId: notification.userId || 'user-1', // Ensure userId exists
    };
    setNotifications(prev => [...prev, newNotification]);
    return newNotification;
  };

  // Task actions
  const taskActionsResult = useTaskActions({ 
    tasks, 
    setTasks, 
    currentUser: currentUser || { id: 'user-1', firstName: 'John', lastName: 'Doe', email: '', role: '', lastActive: new Date(), createdAt: new Date() }, 
    members,
    addNotification: mockAddNotification
  });

  // Wrapping functions to match expected return types
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const id = `task-${Date.now()}`;
    const newTask = {
      ...task,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    taskActionsResult.addTask(task);
    return newTask;
  };

  const updateTask = (id: string, updatedFields: Partial<Task>): boolean => {
    taskActionsResult.updateTask(id, updatedFields);
    return true;
  };

  const deleteTask = (id: string): boolean => {
    taskActionsResult.deleteTask(id);
    return true;
  };

  const addTaskComment = (taskId: string, comment: Omit<TaskComment, 'id' | 'taskId' | 'createdAt'>): boolean => {
    taskActionsResult.addTaskComment(taskId, comment.content);
    return true;
  };

  // Member actions
  const memberActionsResult = useMemberActions({ members, setMembers });
  
  // Wrapping functions to match expected return types
  const addMember = (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Member => {
    const id = `member-${Date.now()}`;
    const newMember = {
      ...member,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memberActionsResult.addMember(member);
    return newMember;
  };
  
  const updateMember = (id: string, updatedFields: Partial<Member>): boolean => {
    memberActionsResult.updateMember(id, updatedFields);
    return true;
  };
  
  const deleteMember = (id: string): boolean => {
    memberActionsResult.deleteMember(id);
    return true;
  };

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
  const notificationActions = useNotificationActions({ notifications, setNotifications });
  
  // Add clearAllNotifications manually since it might be missing from the hook
  const clearAllNotifications = (): boolean => {
    setNotifications([]);
    return true;
  };

  // Programme actions with mock attendance
  const mockAttendance = {
    records: [],
    setAttendance: () => {}
  };

  // Programme actions
  const programmeActions = useProgrammeActions({ 
    programmes, 
    setProgrammes,
    attendance: mockAttendance.records,
    setAttendance: mockAttendance.setAttendance,
    currentUser: currentUser || { id: 'user-1', firstName: 'John', lastName: 'Doe', email: '', role: '', lastActive: new Date(), createdAt: new Date() }
  });

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
        taskCategories,
        setMembers,
        setTasks,
        setTransactions,
        setFinanceCategories,
        setDocuments,
        setFolders,
        setNotifications,
        setCurrentUser,
        setProgrammes,
        setTaskCategories,
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
        addNotification: notificationActions.addNotification,
        markNotificationAsRead: notificationActions.markNotificationAsRead,
        clearAllNotifications,
        addProgramme: programmeActions.addProgramme,
        updateProgramme: programmeActions.updateProgramme,
        deleteProgramme: programmeActions.deleteProgramme,
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
