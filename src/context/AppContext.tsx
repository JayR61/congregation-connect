import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Transaction, Member, Document, Folder, User, Notification, TaskCategory, FinanceCategory, TaskComment, Programme, ProgrammeAttendance } from '../types';
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
import { useProgrammeActions } from './actions/useProgrammeActions';
import { getProgrammes, getAttendance } from '@/services/localStorage';

const initialTasks: Task[] = [];
const initialProgrammes: Programme[] = [];
const initialAttendance: ProgrammeAttendance[] = [];

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
  checkMemberStatusUpdates: () => boolean;
  
  documents: Document[];
  folders: Folder[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'versions'>, file?: File) => void;
  updateDocument: (id: string, document: Partial<Document>, file?: File) => void;
  deleteDocument: (id: string) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  shareDocument: (id: string, shared: boolean) => void;
  moveDocument: (id: string, folderId: string | null) => void;
  addDocumentVersion: (documentId: string, url: string, notes: string) => void;
  
  programmes: Programme[];
  attendance: ProgrammeAttendance[];
  addProgramme: (programme: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => void;
  updateProgramme: (id: string, programme: Partial<Programme>) => void;
  deleteProgramme: (id: string) => void;
  recordAttendance: (programmeId: string, memberId: string, date: Date, isPresent: boolean, notes?: string) => void;
  exportProgrammesToCSV: () => boolean;
  exportAttendanceToCSV: (programmeId: string) => boolean;
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
  const [programmes, setProgrammes] = useState<Programme[]>(initialProgrammes);
  const [attendance, setAttendance] = useState<ProgrammeAttendance[]>(initialAttendance);

  useEffect(() => {
    const savedProgrammes = getProgrammes();
    if (savedProgrammes && savedProgrammes.length > 0) {
      setProgrammes(savedProgrammes);
    }
    
    const savedAttendance = getAttendance();
    if (savedAttendance && savedAttendance.length > 0) {
      setAttendance(savedAttendance);
    }
  }, []);

  const notificationActions = useNotificationActions({
    notifications,
    setNotifications
  });

  const addNotification = notificationActions.addNotification;

  const taskActions = useTaskActions({
    tasks,
    setTasks,
    currentUser,
    members,
    addNotification
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
  
  const programmeActions = useProgrammeActions({
    programmes,
    setProgrammes,
    attendance,
    setAttendance,
    currentUser
  });

  useEffect(() => {
    try {
      memberActions.checkMemberStatusUpdates();
      
      const interval = setInterval(() => {
        memberActions.checkMemberStatusUpdates();
      }, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    } catch (e) {
      console.error("Error checking member status:", e);
    }
  }, []);

  const contextValue = {
    currentUser,
    notifications,
    markNotificationAsRead: notificationActions.markNotificationAsRead,
    addNotification,
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
    checkMemberStatusUpdates: memberActions.checkMemberStatusUpdates,
    documents,
    folders,
    addDocument: documentActions.addDocument,
    updateDocument: documentActions.updateDocument,
    deleteDocument: documentActions.deleteDocument,
    addFolder: documentActions.addFolder,
    updateFolder: documentActions.updateFolder,
    deleteFolder: documentActions.deleteFolder,
    shareDocument: documentActions.shareDocument,
    moveDocument: documentActions.moveDocument,
    addDocumentVersion: documentActions.addDocumentVersion,
    programmes,
    attendance,
    addProgramme: programmeActions.addProgramme,
    updateProgramme: programmeActions.updateProgramme,
    deleteProgramme: programmeActions.deleteProgramme,
    recordAttendance: programmeActions.recordAttendance,
    exportProgrammesToCSV: programmeActions.exportProgrammesToCSV,
    exportAttendanceToCSV: programmeActions.exportAttendanceToCSV
  };

  return (
    <AppContext.Provider value={contextValue}>
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
