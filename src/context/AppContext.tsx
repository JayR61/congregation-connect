
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
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
  ProgrammeAttendance,
  ProgrammeResource,
  ProgrammeFeedback,
  ProgrammeReminder,
  ProgrammeKPI,
  ProgrammeTemplate,
  ProgrammeCategory,
  ProgrammeTag,
  TaskComment
} from "@/types";
import { getInitialData } from "@/data/mockData";
import { useMemberActions } from "./actions/useMemberActions";
import { useTaskActions } from "./actions/useTaskActions";
import { useTransactionActions } from "./actions/useTransactionActions";
import { useFinanceCategoryActions } from "./actions/useFinanceCategoryActions";
import { useDocumentActions } from "./actions/useDocumentActions";
import { useFolderActions } from "./actions/useFolderActions";
import { useNotificationActions } from "./actions/useNotificationActions";
import { useProgrammeActions } from "./actions/useProgrammeActions";
import {
  getProgrammes,
  saveProgrammes,
  getAttendance,
  saveAttendance,
  getResources,
  saveResources,
  getFeedback,
  saveFeedback,
  getReminders,
  saveReminders,
  getKPIs,
  saveKPIs,
  getTemplates,
  saveTemplates,
  getCategories,
  saveCategories,
  getTags,
  saveTags,
  getProgrammeTags,
  saveProgrammeTags,
} from "@/services/programmeService";

interface AppContextType {
  members: Member[];
  tasks: Task[];
  transactions: Transaction[];
  financeCategories: FinanceCategory[];
  documents: Document[];
  folders: Folder[];
  notifications: Notification[];
  currentUser: User;
  programmes: Programme[];
  taskCategories: TaskCategory[];
  attendance: ProgrammeAttendance[];
  resources: ProgrammeResource[];
  categories: ProgrammeCategory[];
  tags: ProgrammeTag[];
  programmeTags: { programmeId: string; tagId: string }[];
  feedback: ProgrammeFeedback[];
  kpis: ProgrammeKPI[];
  reminders: ProgrammeReminder[];
  templates: ProgrammeTemplate[];
  addMember: (member: Omit<Member, "id" | "createdAt" | "updatedAt">) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task;
  updateTask: (id: string, task: Partial<Task>) => boolean;
  deleteTask: (id: string) => boolean;
  addTaskComment: (
    taskId: string,
    comment: Omit<TaskComment, "id" | "createdAt" | "taskId">
  ) => boolean;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addFinanceCategory: (
    category: Omit<FinanceCategory, "id">
  ) => FinanceCategory;
  updateFinanceCategory: (
    id: string,
    category: Partial<FinanceCategory>
  ) => void;
  deleteFinanceCategory: (id: string) => void;
  addDocument: (
    document: Omit<Document, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  addDocumentVersion: (documentId: string, fileUrl: string, notes?: string) => void;
  addFolder: (folder: Omit<Folder, "id" | "createdAt" | "updatedAt">) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => void;
  updateNotification: (id: string, notification: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;
  addProgramme: (
    programmeData: Omit<Programme, "id" | "currentAttendees" | "attendees">
  ) => Programme;
  updateProgramme: (id: string, updatedFields: Partial<Programme>) => boolean;
  deleteProgramme: (id: string) => boolean;
  recordAttendance: (
    programmeId: string,
    memberId: string,
    date: Date,
    isPresent: boolean,
    notes?: string
  ) => boolean;
  addProgrammeResource: (
    resource: Omit<ProgrammeResource, "id">
  ) => ProgrammeResource;
  updateProgrammeResource: (
    id: string,
    resource: Partial<ProgrammeResource>
  ) => void;
  deleteProgrammeResource: (id: string) => void;
  addProgrammeFeedback: (
    feedback: Omit<ProgrammeFeedback, "id">
  ) => ProgrammeFeedback;
  updateProgrammeFeedback: (
    id: string,
    feedback: Partial<ProgrammeFeedback>
  ) => void;
  deleteProgrammeFeedback: (id: string) => void;
  createProgrammeReminder: (
    reminder: Omit<ProgrammeReminder, "id" | "sentAt" | "status">
  ) => ProgrammeReminder;
  updateProgrammeReminder: (
    id: string,
    reminder: Partial<ProgrammeReminder>
  ) => void;
  deleteProgrammeReminder: (id: string) => void;
  addProgrammeKPI: (kpi: Omit<ProgrammeKPI, "id">) => ProgrammeKPI;
  updateKPIProgress: (id: string, progress: number) => void;
  deleteProgrammeKPI: (id: string) => void;
  createProgrammeTemplate: (
    template: Omit<ProgrammeTemplate, "id">
  ) => ProgrammeTemplate;
  updateProgrammeTemplate: (
    id: string,
    template: Partial<ProgrammeTemplate>
  ) => void;
  deleteProgrammeTemplate: (id: string) => void;
  recordBulkAttendance: (
    programmeId: string,
    attendanceData: { memberId: string; isPresent: boolean }[]
  ) => void;
  createProgrammeFromTemplate: (
    templateId: string,
    newProgrammeData: Omit<Programme, "id">
  ) => Programme;
  exportProgrammeToPDF: (programmeId: string) => void;
  exportProgrammeToCalendar: (programmeId: string) => void;
  addTaskCategory: (
    category: Omit<TaskCategory, "id">
  ) => void;
  updateTaskCategory: (
    id: string,
    category: Partial<TaskCategory>
  ) => void;
  deleteTaskCategory: (id: string) => void;
  addProgrammeCategory: (category: Omit<ProgrammeCategory, 'id'>) => ProgrammeCategory;
  addProgrammeTag: (tag: Omit<ProgrammeTag, 'id'>) => ProgrammeTag;
  assignTagToProgramme: (programmeId: string, tagId: string) => boolean;
  removeTagFromProgramme: (programmeId: string, tagId: string) => boolean;
}

const defaultContext: AppContextType = {
  members: [],
  tasks: [],
  transactions: [],
  financeCategories: [],
  documents: [],
  folders: [],
  notifications: [],
  currentUser: mockCurrentUser,
  programmes: [],
  taskCategories: [],
  attendance: [],
  resources: [],
  categories: [],
  tags: [],
  programmeTags: [],
  feedback: [],
  kpis: [],
  reminders: [],
  templates: [],
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  addTask: () => ({} as Task),
  updateTask: () => false,
  deleteTask: () => false,
  addTaskComment: () => false,
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  addFinanceCategory: () => ({} as FinanceCategory),
  updateFinanceCategory: () => {},
  deleteFinanceCategory: () => {},
  addDocument: () => {},
  updateDocument: () => {},
  deleteDocument: () => {},
  addDocumentVersion: () => {},
  addFolder: () => {},
  updateFolder: () => {},
  deleteFolder: () => {},
  addNotification: () => {},
  updateNotification: () => {},
  deleteNotification: () => {},
  addProgramme: () => ({} as Programme),
  updateProgramme: () => false,
  deleteProgramme: () => false,
  recordAttendance: () => false,
  addProgrammeResource: () => ({} as ProgrammeResource),
  updateProgrammeResource: () => {},
  deleteProgrammeResource: () => {},
  addProgrammeFeedback: () => ({} as ProgrammeFeedback),
  updateProgrammeFeedback: () => {},
  deleteProgrammeFeedback: () => {},
  createProgrammeReminder: () => ({} as ProgrammeReminder),
  updateProgrammeReminder: () => {},
  deleteProgrammeReminder: () => {},
  addProgrammeKPI: () => ({} as ProgrammeKPI),
  updateKPIProgress: () => {},
  deleteProgrammeKPI: () => {},
  createProgrammeTemplate: () => ({} as ProgrammeTemplate),
  updateProgrammeTemplate: () => {},
  deleteProgrammeTemplate: () => {},
  recordBulkAttendance: () => {},
  createProgrammeFromTemplate: () => ({} as Programme),
  exportProgrammeToPDF: () => {},
  exportProgrammeToCalendar: () => {},
  addTaskCategory: () => {},
  updateTaskCategory: () => {},
  deleteTaskCategory: () => {},
  addProgrammeCategory: () => ({} as ProgrammeCategory),
  addProgrammeTag: () => ({} as ProgrammeTag),
  assignTagToProgramme: () => false,
  removeTagFromProgramme: () => false,
};

const AppContext = createContext<AppContextType>(defaultContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const initialData = getInitialData();
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financeCategories, setFinanceCategories] = useState<
    FinanceCategory[]
  >([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(initialData.currentUser);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [attendance, setAttendance] = useState<ProgrammeAttendance[]>([]);
  const [resources, setResources] = useState<ProgrammeResource[]>([]);
  const [categories, setCategories] = useState<ProgrammeCategory[]>([]);
  const [tags, setTags] = useState<ProgrammeTag[]>([]);
  const [programmeTags, setProgrammeTags] = useState<
    { programmeId: string; tagId: string }[]
  >([]);
  const [feedback, setFeedback] = useState<ProgrammeFeedback[]>([]);
  const [kpis, setKpis] = useState<ProgrammeKPI[]>([]);
  const [reminders, setReminders] = useState<ProgrammeReminder[]>([]);
  const [templates, setTemplates] = useState<ProgrammeTemplate[]>([]);

  useEffect(() => {
    setMembers(initialData.members);
    setTasks(initialData.tasks);
    setTransactions(initialData.transactions);
    setFinanceCategories(initialData.financeCategories);
    setDocuments(initialData.documents);
    setFolders(initialData.folders);
    setNotifications(initialData.notifications);
    setTaskCategories(initialData.taskCategories);
  }, []);

  useEffect(() => {
    // Load programmes from local storage on component mount
    const storedProgrammes = getProgrammes();
    setProgrammes(storedProgrammes);

    const storedAttendance = getAttendance();
    setAttendance(storedAttendance);

    const storedResources = getResources();
    setResources(storedResources);

    const storedFeedback = getFeedback();
    setFeedback(storedFeedback);

    const storedReminders = getReminders();
    setReminders(storedReminders);

    const storedKPIs = getKPIs();
    setKpis(storedKPIs);

    const storedTemplates = getTemplates();
    setTemplates(storedTemplates);

    const storedCategories = getCategories();
    setCategories(storedCategories);

    const storedTags = getTags();
    setTags(storedTags);

    const storedProgrammeTags = getProgrammeTags();
    setProgrammeTags(storedProgrammeTags);
  }, []);

  useEffect(() => {
    // Save programmes to local storage whenever the programmes state changes
    saveProgrammes(programmes);
    saveAttendance(attendance);
    saveResources(resources);
    saveFeedback(feedback);
    saveReminders(reminders);
    saveKPIs(kpis);
    saveTemplates(templates);
    saveCategories(categories);
    saveTags(tags);
    saveProgrammeTags(programmeTags);
  }, [
    programmes,
    attendance,
    resources,
    feedback,
    reminders,
    kpis,
    templates,
    categories,
    tags,
    programmeTags,
  ]);

  // Define notification actions first to avoid reference errors
  const { addNotification, updateNotification, deleteNotification } =
    useNotificationActions({
      notifications,
      setNotifications,
    });

  const { addMember, updateMember, deleteMember } = useMemberActions({
    members,
    setMembers,
  });
  const { addTask, updateTask, deleteTask, addTaskComment } = useTaskActions({
    tasks,
    setTasks,
    currentUser,
    members,
    addNotification,
  });
  const { addTransaction, updateTransaction, deleteTransaction } =
    useTransactionActions({
      transactions,
      setTransactions,
      currentUser,
    });
  const { addFinanceCategory, updateFinanceCategory, deleteFinanceCategory } =
    useFinanceCategoryActions({
      financeCategories,
      setFinanceCategories,
    });
  const { addDocument, updateDocument, deleteDocument, addDocumentVersion } =
    useDocumentActions({
      documents,
      setDocuments,
      currentUser,
    });
  const { addFolder, updateFolder, deleteFolder } = useFolderActions({
    folders,
    setFolders,
    currentUser,
  });
  
  const {
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance,
  } = useProgrammeActions({
    programmes,
    setProgrammes,
    currentUser,
  });

  const moveDocument = (documentId: string, folderId: string | null) => {
    updateDocument(documentId, { folderId });
    return true;
  };

  const addProgrammeResource = (
    resource: Omit<ProgrammeResource, "id">
  ): ProgrammeResource => {
    const newResource: ProgrammeResource = {
      ...resource,
      id: `resource-${Date.now()}`,
    };
    setResources((prev) => [...prev, newResource]);
    return newResource;
  };

  const updateProgrammeResource = (
    id: string,
    resource: Partial<ProgrammeResource>
  ) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...resource } : r))
    );
  };

  const deleteProgrammeResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const addProgrammeFeedback = (
    feedbackItem: Omit<ProgrammeFeedback, "id">
  ): ProgrammeFeedback => {
    const newFeedback: ProgrammeFeedback = {
      ...feedbackItem,
      id: `feedback-${Date.now()}`,
    };
    setFeedback((prev) => [...prev, newFeedback]);
    return newFeedback;
  };

  const updateProgrammeFeedback = (
    id: string,
    feedbackItem: Partial<ProgrammeFeedback>
  ) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...feedbackItem } : f))
    );
  };

  const deleteProgrammeFeedback = (id: string) => {
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  const createProgrammeReminder = (
    reminder: Omit<ProgrammeReminder, "id" | "sent" | "status">
  ): ProgrammeReminder => {
    const newReminder: ProgrammeReminder = {
      ...reminder,
      id: `reminder-${Date.now()}`,
      sent: false,
      status: "scheduled",
    };
    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  };

  const updateProgrammeReminder = (
    id: string,
    reminder: Partial<ProgrammeReminder>
  ) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...reminder } : r))
    );
  };

  const deleteProgrammeReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addProgrammeKPI = (kpi: Omit<ProgrammeKPI, "id">): ProgrammeKPI => {
    const newKPI: ProgrammeKPI = {
      ...kpi,
      id: `kpi-${Date.now()}`,
    };
    setKpis((prev) => [...prev, newKPI]);
    return newKPI;
  };

  const updateKPIProgress = (id: string, progress: number) => {
    setKpis((prev) =>
      prev.map((kpi) => (kpi.id === id ? { ...kpi, actual: progress } : kpi))
    );
    return true;
  };

  const deleteProgrammeKPI = (id: string) => {
    setKpis((prev) => prev.filter((kpi) => kpi.id !== id));
  };

  const createProgrammeTemplate = (
    template: Omit<ProgrammeTemplate, "id">
  ): ProgrammeTemplate => {
    const newTemplate: ProgrammeTemplate = {
      ...template,
      id: `template-${Date.now()}`,
    };
    setTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateProgrammeTemplate = (
    id: string,
    template: Partial<ProgrammeTemplate>
  ) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...template } : t))
    );
  };

  const deleteProgrammeTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const recordBulkAttendance = (
    programmeId: string,
    attendanceData: { memberId: string; isPresent: boolean }[]
  ) => {
    const newAttendanceRecords = attendanceData.map((data) => ({
      id: `attendance-${Date.now()}-${data.memberId}`,
      programmeId: programmeId,
      memberId: data.memberId,
      date: new Date().toISOString(),
      isPresent: data.isPresent,
      status: data.isPresent ? 'present' : 'absent'
    } as ProgrammeAttendance));

    setAttendance((prev) => [...prev, ...newAttendanceRecords]);
    return true;
  };

  const createProgrammeFromTemplate = (
    templateId: string,
    newProgrammeData: Omit<Programme, "id">
  ): Programme => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    const newProgramme: Programme = {
      ...newProgrammeData,
      id: `programme-${Date.now()}`,
      currentAttendees: 0,
      attendees: [],
      category: template.category,
      tags: template.tags,
    };

    setProgrammes((prev) => [...prev, newProgramme]);
    return newProgramme;
  };

  const exportProgrammeToPDF = (programmeId: string) => {
    console.log(`Exporting programme with id ${programmeId} to PDF`);
    return true;
  };

  const exportProgrammeToCalendar = (programmeId: string) => {
    console.log(`Exporting programme with id ${programmeId} to Calendar`);
    return true;
  };

  const addTaskCategory = (category: Omit<TaskCategory, "id">) => {
    const newTaskCategory: TaskCategory = {
      ...category,
      id: `task-category-${Date.now()}`,
    };
    setTaskCategories((prev) => [...prev, newTaskCategory]);
    return newTaskCategory;
  };

  const updateTaskCategory = (id: string, category: Partial<TaskCategory>) => {
    setTaskCategories((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, ...category } : tc))
    );
    return true;
  };

  const deleteTaskCategory = (id: string) => {
    setTaskCategories((prev) => prev.filter((tc) => tc.id !== id));
    return true;
  };

  const addProgrammeCategory = (category: Omit<ProgrammeCategory, 'id'>) => {
    const newCategory = {
      id: `category-${Date.now()}`,
      ...category,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const addProgrammeTag = (tag: Omit<ProgrammeTag, 'id'>) => {
    const newTag = {
      id: `tag-${Date.now()}`,
      ...tag,
    };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  const assignTagToProgramme = (programmeId: string, tagId: string) => {
    setProgrammeTags((prev) => [...prev, { programmeId, tagId }]);
    return true;
  };

  const removeTagFromProgramme = (programmeId: string, tagId: string) => {
    setProgrammeTags((prev) => 
      prev.filter(pt => !(pt.programmeId === programmeId && pt.tagId === tagId))
    );
    return true;
  };

  let contextValue: AppContextType = {
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
    attendance,
    resources,
    categories,
    tags,
    programmeTags,
    feedback,
    kpis,
    reminders,
    templates,
    addMember,
    updateMember,
    deleteMember,
    addTask,
    updateTask,
    deleteTask,
    addTaskComment,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addFinanceCategory,
    updateFinanceCategory,
    deleteFinanceCategory,
    addDocument,
    updateDocument,
    deleteDocument,
    addDocumentVersion,
    addFolder,
    updateFolder,
    deleteFolder,
    addNotification,
    updateNotification,
    deleteNotification,
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance,
    addProgrammeResource,
    updateProgrammeResource,
    deleteProgrammeResource,
    addProgrammeFeedback,
    updateProgrammeFeedback,
    deleteProgrammeFeedback,
    createProgrammeReminder,
    updateProgrammeReminder,
    deleteProgrammeReminder,
    addProgrammeKPI,
    updateKPIProgress,
    deleteProgrammeKPI,
    createProgrammeTemplate,
    updateProgrammeTemplate,
    deleteProgrammeTemplate,
    recordBulkAttendance,
    createProgrammeFromTemplate,
    exportProgrammeToPDF,
    exportProgrammeToCalendar,
    addTaskCategory,
    updateTaskCategory,
    deleteTaskCategory,
    addProgrammeCategory,
    addProgrammeTag,
    assignTagToProgramme,
    removeTagFromProgramme,
    moveDocument,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => useContext(AppContext);
