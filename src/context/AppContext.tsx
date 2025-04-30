
import React, { useState, createContext, useContext } from 'react';
import {
  Member,
  Task,
  Transaction,
  FinanceCategory,
  Document,
  Folder,
  Notification,
  User,
  Programme,
  TaskCategory,
  TaskComment,
  ProgrammeFeedback
} from '@/types';
import { useTransactionActions } from './actions/useTransactionActions';
import { useNotificationActions } from './actions/useNotificationActions';
import { useDocumentActions } from './actions/useDocumentActions';
import { useFolderActions } from './actions/useFolderActions';
import { useFinanceActions } from './actions/useFinanceActions';
import { useProgrammeActions } from './actions/useProgrammeActions';
import { useTaskActions } from './actions/useTaskActions';
import { useMemberActions } from './actions/useMemberActions';

interface AppContextProps {
  members: Member[];
  tasks: Task[];
  programmes: Programme[];
  transactions: Transaction[];
  financeCategories: FinanceCategory[];
  documents: Document[];
  folders: Folder[];
  notifications: Notification[];
  currentUser: User;
  taskCategories: TaskCategory[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, updatedFields: Partial<Task>) => boolean;
  deleteTask: (id: string) => boolean;
  addTaskComment: (taskId: string, comment: Omit<TaskComment, "id" | "createdAt" | "taskId">) => boolean;
  addMember: (member: Omit<Member, "id" | "createdAt" | "updatedAt">) => Member;
  updateMember: (id: string, updatedFields: Partial<Member>) => boolean;
  deleteMember: (id: string) => boolean;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Transaction;
  updateTransaction: (id: string, updatedFields: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => boolean;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => Notification;
  updateNotification: (id: string, update: Partial<Notification>) => boolean;
  deleteNotification: (id: string) => boolean;
  markNotificationAsRead: (id: string) => boolean;
  clearAllNotifications: () => boolean;
  addDocument: (document: Omit<Document, "id" | "createdAt" | "updatedAt" | "versions">) => Document;
  updateDocument: (id: string, updatedFields: Partial<Document>) => boolean;
  deleteDocument: (id: string) => boolean;
  addFolder: (folder: Omit<Folder, "id" | "createdAt" | "updatedAt">) => Folder;
  updateFolder: (id: string, updatedFields: Partial<Folder>) => boolean;
  deleteFolder: (id: string) => boolean;
  addFinanceCategory: (category: Omit<FinanceCategory, "id" | "createdAt" | "updatedAt">) => FinanceCategory;
  updateFinanceCategory: (id: string, updatedFields: Partial<FinanceCategory>) => boolean;
  deleteFinanceCategory: (id: string) => boolean;
  addProgramme: (programme: Omit<Programme, "id" | "currentAttendees" | "attendees">) => Programme;
  updateProgramme: (id: string, updatedFields: Partial<Programme>) => boolean;
  deleteProgramme: (id: string) => boolean;
  shareDocument: (documentId: string, memberIds: string[]) => boolean;
  moveDocument: (documentId: string, folderId: string | null) => boolean;
  addDocumentVersion: (documentId: string, fileUrl: string, notes: string) => boolean;
  attendance: any[];
  recordAttendance: any;
  recordBulkAttendance?: (record: any) => void;
  exportProgrammesToCSV: any;
  exportAttendanceToCSV: any;
  resources: any[];
  categories: any[];
  tags: any[];
  programmeTags: any[];
  feedback: any[];
  kpis: any[];
  reminders: any[];
  templates: any[];
  addProgrammeCategory: any;
  addProgrammeTag: any;
  assignTagToProgramme: any;
  removeTagFromProgramme: any;
  // Add these missing functions for programmes
  allocateResource?: any;
  updateResourceStatus?: any;
  exportProgrammeToPDF?: any;
  createProgrammeTemplate?: any;
  createProgrammeFromTemplate?: any;
  exportProgrammeToCalendar?: any;
  addProgrammeFeedback?: (feedback: Omit<ProgrammeFeedback, 'id'>) => ProgrammeFeedback | null;
  addProgrammeKPI?: any;
  updateKPIProgress?: any;
  createProgrammeReminder?: any;
  checkAndSendReminders?: any;
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "user-1",
    email: "admin@churchapp.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    lastActive: new Date(),
    createdAt: new Date()
  });

  // Use the hooks to get actions
  const transactionActions = useTransactionActions({ transactions, setTransactions, currentUser });
  const notificationActions = useNotificationActions({ notifications, setNotifications });
  const documentActions = useDocumentActions({ documents, setDocuments, currentUser });
  const folderActions = useFolderActions({ folders, setFolders, currentUser });
  const financeActions = useFinanceActions({ transactions, setTransactions, financeCategories, setFinanceCategories, currentUser });

  const {
    addProgramme,
    updateProgramme,
    deleteProgramme
  } = useProgrammeActions({ programmes, setProgrammes, currentUser });

  // Add notification function for taskActions
  const dummyAddNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    return notificationActions.addNotification(notification);
  };

  const {
    addTask: baseAddTask,
    updateTask: baseUpdateTask,
    deleteTask: baseDeleteTask,
    addTaskComment: baseAddTaskComment
  } = useTaskActions({ 
    tasks, 
    setTasks, 
    currentUser,
    members,
    addNotification: dummyAddNotification
  });

  const {
    addMember: baseAddMember,
    updateMember: baseUpdateMember,
    deleteMember: baseDeleteMember
  } = useMemberActions({ members, setMembers });

  // Placeholder implementations
  const attendance: any[] = [];
  const recordAttendance = () => {};
  const recordBulkAttendance = () => {};
  const exportProgrammesToCSV = () => {};
  const exportAttendanceToCSV = () => {};
  const resources: any[] = [];
  const categories: any[] = [];
  const tags: any[] = [];
  const programmeTags: any[] = [];
  const feedback: any[] = [];
  const kpis: any[] = [];
  const reminders: any[] = [];
  const templates: any[] = [];
  const addProgrammeCategory = () => {};
  const addProgrammeTag = () => {};
  const assignTagToProgramme = () => {};
  const removeTagFromProgramme = () => {};
  const shareDocument = (documentId: string, memberIds: string[]) => true;
  const clearAllNotifications = () => true;
  const addDocumentVersion = (documentId: string, fileUrl: string, notes: string) => {
    return documentActions.addDocumentVersion(documentId, fileUrl, notes);
  };
  const moveDocument = (documentId: string, folderId: string | null) => {
    return true; // Simplified for now
  };

  // Programme specific functions
  const allocateResource = () => {};
  const updateResourceStatus = () => {};
  const exportProgrammeToPDF = () => {};
  const createProgrammeTemplate = () => {};
  const createProgrammeFromTemplate = () => {};
  const exportProgrammeToCalendar = () => {};
  const addProgrammeFeedback = () => null;
  const addProgrammeKPI = () => {};
  const updateKPIProgress = () => {};
  const createProgrammeReminder = () => {};
  const checkAndSendReminders = () => {};

  // Fixed task functions
  const fixedAddTaskComment = (taskId: string, comment: Omit<TaskComment, "id" | "createdAt" | "taskId">) => {
    return baseAddTaskComment(taskId, comment);
  };

  const value: AppContextProps = {
    members,
    tasks,
    taskCategories: [],
    programmes,
    transactions,
    financeCategories,
    documents,
    folders,
    notifications,
    currentUser,
    addTask: baseAddTask,
    updateTask: baseUpdateTask,
    deleteTask: baseDeleteTask,
    addTaskComment: fixedAddTaskComment,
    addMember: baseAddMember,
    updateMember: baseUpdateMember,
    deleteMember: baseDeleteMember,
    addTransaction: transactionActions.addTransaction,
    updateTransaction: transactionActions.updateTransaction,
    deleteTransaction: transactionActions.deleteTransaction,
    addNotification: notificationActions.addNotification,
    updateNotification: notificationActions.updateNotification,
    deleteNotification: notificationActions.deleteNotification,
    markNotificationAsRead: notificationActions.markNotificationAsRead,
    clearAllNotifications,
    addDocument: documentActions.addDocument,
    updateDocument: documentActions.updateDocument,
    deleteDocument: documentActions.deleteDocument,
    addFolder: folderActions.addFolder,
    updateFolder: folderActions.updateFolder,
    deleteFolder: folderActions.deleteFolder,
    moveDocument,
    addDocumentVersion,
    addFinanceCategory: financeActions.addFinanceCategory,
    updateFinanceCategory: financeActions.updateFinanceCategory,
    deleteFinanceCategory: financeActions.deleteFinanceCategory,
    addProgramme,
    updateProgramme,
    deleteProgramme,
    shareDocument,
    attendance,
    recordAttendance,
    recordBulkAttendance,
    exportProgrammesToCSV,
    exportAttendanceToCSV,
    resources,
    categories,
    tags,
    programmeTags,
    feedback,
    kpis,
    reminders,
    templates,
    addProgrammeCategory,
    addProgrammeTag,
    assignTagToProgramme,
    removeTagFromProgramme,
    // Add programme specific functions
    allocateResource,
    updateResourceStatus,
    exportProgrammeToPDF,
    createProgrammeTemplate,
    createProgrammeFromTemplate,
    exportProgrammeToCalendar,
    addProgrammeFeedback,
    addProgrammeKPI,
    updateKPIProgress,
    createProgrammeReminder,
    checkAndSendReminders
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
