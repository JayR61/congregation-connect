import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Transaction, Member, Document, Folder, User, Notification, TaskCategory,
  FinanceCategory, TaskComment, Programme, ProgrammeAttendance, ProgrammeResource,
  ProgrammeFeedback, ProgrammeReminder, ProgrammeKPI, ProgrammeTemplate, ProgrammeCategory,
  ProgrammeTag, BulkAttendanceRecord } from '../types';
import { useDocumentActions } from './actions/useDocumentActions';
import { useFinanceActions } from './actions/useFinanceActions';
import { useMemberActions } from './actions/useMemberActions';
import { useNotificationActions } from './actions/useNotificationActions';
import { useProgrammeActions } from './actions/useProgrammeActions';
import { useTaskActions } from './actions/useTaskActions';
import { getUserFromLocalStorage, saveUserToLocalStorage } from '@/lib/auth';

interface AppContextProps {
  // Tasks related
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task | null;
  updateTask: (id: string, task: Partial<Task>) => boolean;
  deleteTask: (id: string) => boolean;
  taskCategories: TaskCategory[];
  setTaskCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>;
  addTaskCategory: (category: Omit<TaskCategory, 'id'>) => TaskCategory | null;
  updateTaskCategory: (id: string, category: Partial<TaskCategory>) => boolean;
  deleteTaskCategory: (id: string) => boolean;
  taskComments: TaskComment[];
  setTaskComments: React.Dispatch<React.SetStateAction<TaskComment[]>>;
  addTaskComment: (comment: Omit<TaskComment, 'id' | 'createdAt'>) => TaskComment | null;
  updateTaskComment: (id: string, comment: Partial<TaskComment>) => boolean;
  deleteTaskComment: (id: string) => boolean;

  // Finance related
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction | null;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => boolean;
  deleteTransaction: (id: string) => boolean;
  financeCategories: FinanceCategory[];
  setFinanceCategories: React.Dispatch<React.SetStateAction<FinanceCategory[]>>;
  addFinanceCategory: (category: Omit<FinanceCategory, 'id'>) => FinanceCategory | null;
  updateFinanceCategory: (id: string, category: Partial<FinanceCategory>) => boolean;
  deleteFinanceCategory: (id: string) => boolean;

  // Member related
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  addMember: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => Member | null;
  updateMember: (id: string, member: Partial<Member>) => boolean;
  deleteMember: (id: string) => boolean;

  // Document related
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => Document | null;
  updateDocument: (id: string, document: Partial<Document>) => boolean;
  deleteDocument: (id: string) => boolean;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  addFolder: (folder: Omit<Folder, 'id'>) => Folder | null;
  updateFolder: (id: string, folder: Partial<Folder>) => boolean;
  deleteFolder: (id: string) => boolean;

  // User and notification related
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification | null;
  updateNotification: (id: string, notification: Partial<Notification>) => boolean;
  deleteNotification: (id: string) => boolean;

  // Programme related
  programmes: Programme[];
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  addProgramme: (programme: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => Programme | null;
  updateProgramme: (id: string, programme: Partial<Programme>) => boolean;
  deleteProgramme: (id: string) => boolean;
  recordAttendance: (programmeId: string, memberId: string, date: Date, isPresent: boolean, notes?: string) => ProgrammeAttendance | null;
  exportProgrammesToCSV: () => boolean;
  exportAttendanceToCSV: (programmeId: string) => boolean;
  resources: ProgrammeResource[];
  feedback: ProgrammeFeedback[];
  reminders: ProgrammeReminder[];
  kpis: ProgrammeKPI[];
  templates: ProgrammeTemplate[];
  categories: ProgrammeCategory[];
  tags: ProgrammeTag[];
  programmeTags: { programmeId: string; tagId: string; }[];
  createProgrammeReminder: (reminder: Omit<ProgrammeReminder, 'id' | 'sentAt' | 'status'>) => ProgrammeReminder | null;
  checkAndSendReminders: () => ProgrammeReminder[];
  addProgrammeCategory: (category: Omit<ProgrammeCategory, 'id'>) => ProgrammeCategory | null;
  addProgrammeTag: (tag: Omit<ProgrammeTag, 'id'>) => ProgrammeTag | null;
  assignTagToProgramme: (programmeId: string, tagId: string) => boolean;
  removeTagFromProgramme: (programmeId: string, tagId: string) => boolean;
  allocateResource: (resource: Omit<ProgrammeResource, 'id'>) => ProgrammeResource | null;
  updateResourceStatus: (resourceId: string, status: ProgrammeResource['status']) => boolean;
  exportProgrammeToPDF: (programmeId: string, members: any[]) => string | null;
  createProgrammeTemplate: (templateData: Omit<ProgrammeTemplate, 'id' | 'createdById' | 'createdAt'>) => ProgrammeTemplate | null;
  createProgrammeFromTemplate: (templateId: string, overrideData?: Partial<Programme>) => Programme | null;
  exportProgrammeToCalendar: (programmeId: string) => string | null;
  addProgrammeFeedback: (feedback: Omit<ProgrammeFeedback, 'id' | 'submittedAt'>) => ProgrammeFeedback | null;
  addProgrammeKPI: (kpi: Omit<ProgrammeKPI, 'id' | 'createdAt' | 'updatedAt'>) => ProgrammeKPI | null;
  updateKPIProgress: (kpiId: string, current: number) => boolean;
  recordBulkAttendance: (bulkRecord: BulkAttendanceRecord) => ProgrammeAttendance[] | null;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(getUserFromLocalStorage());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>([]);
  const [taskComments, setTaskComments] = useState<TaskComment[]>([]);

  const {
    addTask,
    updateTask,
    deleteTask,
    addTaskCategory,
    updateTaskCategory,
    deleteTaskCategory,
    addTaskComment,
    updateTaskComment,
    deleteTaskComment
  } = useTaskActions({
    tasks,
    setTasks,
    taskCategories,
    setTaskCategories,
    taskComments,
    setTaskComments
  });

  const {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addFinanceCategory,
    updateFinanceCategory,
    deleteFinanceCategory
  } = useFinanceActions({
    transactions,
    setTransactions,
    financeCategories,
    setFinanceCategories
  });

  const {
    addMember,
    updateMember,
    deleteMember
  } = useMemberActions({
    members,
    setMembers
  });

  const {
    addDocument,
    updateDocument,
    deleteDocument,
    addFolder,
    updateFolder,
    deleteFolder
  } = useDocumentActions({
    documents,
    setDocuments,
    folders,
    setFolders
  });

  const {
    addNotification,
    updateNotification,
    deleteNotification
  } = useNotificationActions({
    notifications,
    setNotifications
  });

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [attendance, setAttendance] = useState<ProgrammeAttendance[]>([]);
  
  const {
    resources,
    feedback,
    reminders,
    kpis,
    templates,
    categories,
    tags,
    programmeTags,
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance,
    exportProgrammesToCSV,
    exportAttendanceToCSV,
    createProgrammeReminder,
    checkAndSendReminders,
    addProgrammeCategory,
    addProgrammeTag,
    assignTagToProgramme,
    removeTagFromProgramme,
    allocateResource,
    updateResourceStatus,
    exportProgrammeToPDF,
    createProgrammeTemplate,
    createProgrammeFromTemplate,
    exportProgrammeToCalendar,
    addProgrammeFeedback,
    addProgrammeKPI,
    updateKPIProgress,
    recordBulkAttendance
  } = useProgrammeActions({
    programmes,
    setProgrammes,
    attendance,
    setAttendance,
    currentUser
  });

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }

    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    }

    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }

    const storedFolders = localStorage.getItem('folders');
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }

    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    const storedTaskCategories = localStorage.getItem('taskCategories');
    if (storedTaskCategories) {
      setTaskCategories(JSON.parse(storedTaskCategories));
    }

    const storedFinanceCategories = localStorage.getItem('financeCategories');
    if (storedFinanceCategories) {
      setFinanceCategories(JSON.parse(storedFinanceCategories));
    }

    const storedTaskComments = localStorage.getItem('taskComments');
    if (storedTaskComments) {
      setTaskComments(JSON.parse(storedTaskComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('taskCategories', JSON.stringify(taskCategories));
  }, [taskCategories]);

  useEffect(() => {
    localStorage.setItem('financeCategories', JSON.stringify(financeCategories));
  }, [financeCategories]);

  useEffect(() => {
    localStorage.setItem('taskComments', JSON.stringify(taskComments));
  }, [taskComments]);

  useEffect(() => {
    if (currentUser) {
      saveUserToLocalStorage(currentUser);
    }
  }, [currentUser]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        taskCategories,
        setTaskCategories,
        addTaskCategory,
        updateTaskCategory,
        deleteTaskCategory,
        taskComments,
        setTaskComments,
        addTaskComment,
        updateTaskComment,
        deleteTaskComment,
        
        transactions,
        setTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        financeCategories,
        setFinanceCategories,
        addFinanceCategory,
        updateFinanceCategory,
        deleteFinanceCategory,
        
        members,
        setMembers,
        addMember,
        updateMember,
        deleteMember,
        
        documents,
        setDocuments,
        addDocument,
        updateDocument,
        deleteDocument,
        folders,
        setFolders,
        addFolder,
        updateFolder,
        deleteFolder,
        
        currentUser,
        setCurrentUser,
        notifications,
        setNotifications,
        addNotification,
        updateNotification,
        deleteNotification,
        
        programmes,
        setProgrammes,
        attendance,
        setAttendance,
        addProgramme,
        updateProgramme,
        deleteProgramme,
        recordAttendance,
        exportProgrammesToCSV,
        exportAttendanceToCSV,
        resources,
        feedback,
        reminders,
        kpis,
        templates,
        categories,
        tags,
        programmeTags,
        createProgrammeReminder,
        checkAndSendReminders,
        addProgrammeCategory,
        addProgrammeTag,
        assignTagToProgramme,
        removeTagFromProgramme,
        allocateResource,
        updateResourceStatus,
        exportProgrammeToPDF,
        createProgrammeTemplate,
        createProgrammeFromTemplate,
        exportProgrammeToCalendar,
        addProgrammeFeedback,
        addProgrammeKPI,
        updateKPIProgress,
        recordBulkAttendance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
