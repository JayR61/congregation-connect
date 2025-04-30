import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Member,
  Task,
  Programme,
  Transaction,
  FinanceCategory,
  Document,
  Folder,
  Notification,
  User,
  TaskComment,
  TaskCategory,
  AppContextProps,
} from "@/types";
import { useTaskActions } from "./actions/useTaskActions";
import { useMemberActions } from "./actions/useMemberActions";
import { useTransactionActions } from "./actions/useTransactionActions";
import { useNotificationActions } from "./actions/useNotificationActions";
import { useDocumentActions } from "./actions/useDocumentActions";
import { useFolderActions } from "./actions/useFolderActions";
import { useFinanceActions } from "./actions/useFinanceActions";
import { useProgrammeActions } from "./actions/useProgrammeActions";

interface AppProviderProps {
  children: React.ReactNode;
  initialMembers: Member[];
  initialTasks: Task[];
  initialProgrammes: Programme[];
  initialTransactions: Transaction[];
  initialFinanceCategories: FinanceCategory[];
  initialDocuments: Document[];
  initialFolders: Folder[];
  initialNotifications: Notification[];
  initialCurrentUser: User;
  initialTaskCategories: TaskCategory[];
  initialAttendance: any[];
  initialResources: any[];
  initialCategories: any[];
  initialTags: any[];
  initialProgrammeTags: any[];
  initialFeedback: any[];
  initialKpis: any[];
  initialReminders: any[];
  initialTemplates: any[];
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  initialMembers,
  initialTasks,
  initialProgrammes,
  initialTransactions,
  initialFinanceCategories,
  initialDocuments,
  initialFolders,
  initialNotifications,
  initialCurrentUser,
  initialTaskCategories,
  initialAttendance,
  initialResources,
  initialCategories,
  initialTags,
  initialProgrammeTags,
  initialFeedback,
  initialKpis,
  initialReminders,
  initialTemplates,
}) => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [programmes, setProgrammes] = useState<Programme[]>(initialProgrammes);
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions
  );
  const [financeCategories, setFinanceCategories] = useState<FinanceCategory[]>(
    initialFinanceCategories
  );
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );
  const [currentUser] = useState<User>(initialCurrentUser);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>(
    initialTaskCategories
  );
  const [attendance, setAttendance] = useState<any[]>(initialAttendance);
  const [resources, setResources] = useState<any[]>(initialResources);
  const [categories, setCategories] = useState<any[]>(initialCategories);
	const [tags, setTags] = useState<any[]>(initialTags);
	const [programmeTags, setProgrammeTags] = useState<any[]>(initialProgrammeTags);
  const [feedback, setFeedback] = useState<any[]>(initialFeedback);
  const [kpis, setKpis] = useState<any[]>(initialKpis);
  const [reminders, setReminders] = useState<any[]>(initialReminders);
  const [templates, setTemplates] = useState<any[]>(initialTemplates);

  // Task Actions
  const { addTask, updateTask, deleteTask, addTaskComment: baseAddTaskComment } = useTaskActions({
    tasks,
    setTasks,
    currentUser
  });

  // Member Actions
  const { addMember, updateMember, deleteMember } = useMemberActions({
    members,
    setMembers,
    currentUser
  });

  // Transaction Actions
  const { addTransaction, updateTransaction, deleteTransaction } =
    useTransactionActions({
      transactions,
      setTransactions,
      currentUser
    });

  // Notification Actions
  const {
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    clearAllNotifications,
  } = useNotificationActions({ notifications, setNotifications });

  // Document Actions
  const {
    addDocument,
    updateDocument,
    deleteDocument,
    shareDocument,
  } = useDocumentActions({ documents, setDocuments });

  // Folder Actions
  const { addFolder, updateFolder, deleteFolder } = useFolderActions({
    folders,
    setFolders,
  });

  const fixedAddTaskComment = (taskId: string, comment: Omit<TaskComment, "id" | "createdAt" | "taskId">) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `comment-${Date.now()}`,
              content: comment.content,
              createdAt: new Date(),
              userId: comment.userId,
              taskId
            }
          ]
        };
      }
      return t;
    }));
    return true;
  };

  // Finance Actions
  const { addFinanceCategory: baseAddCategory, updateFinanceCategory: baseUpdateCategory, deleteFinanceCategory: baseDeleteCategory } = useFinanceActions({
    financeCategories,
    setFinanceCategories
  });

  // Programme Actions
  const { addProgramme, updateProgramme, deleteProgramme } = useProgrammeActions({
    programmes,
    setProgrammes,
    currentUser
  });

  const appContextValue: AppContextProps = useMemo(
    () => ({
      members,
      tasks,
      programmes,
      transactions,
      financeCategories,
      documents,
      folders,
      notifications,
      currentUser,
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
      addTask,
      updateTask,
      deleteTask,
      addTaskComment: fixedAddTaskComment,
      addMember,
      updateMember,
      deleteMember,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addNotification,
      updateNotification,
      deleteNotification,
      markNotificationAsRead,
      clearAllNotifications,
      addDocument,
      updateDocument,
      deleteDocument,
      addFolder,
      updateFolder,
      deleteFolder,
      addFinanceCategory: baseAddCategory,
      updateFinanceCategory: baseUpdateCategory,
      deleteFinanceCategory: baseDeleteCategory,
      addProgramme,
      updateProgramme,
      deleteProgramme,
      shareDocument,
      recordAttendance: () => {},
      exportProgrammesToCSV: () => {},
      exportAttendanceToCSV: () => {},
      addProgrammeCategory: () => {},
      addProgrammeTag: () => {},
      assignTagToProgramme: () => {},
      removeTagFromProgramme: () => {},
    }),
    [
      members,
      tasks,
      programmes,
      transactions,
      financeCategories,
      documents,
      folders,
      notifications,
      currentUser,
      taskCategories,
      addTask,
      updateTask,
      deleteTask,
      fixedAddTaskComment,
      addMember,
      updateMember,
      deleteMember,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addNotification,
      updateNotification,
      deleteNotification,
      markNotificationAsRead,
      clearAllNotifications,
      addDocument,
      updateDocument,
      deleteDocument,
      addFolder,
      updateFolder,
      deleteFolder,
      baseAddCategory,
      baseUpdateCategory,
      baseDeleteCategory,
      addProgramme,
      updateProgramme,
      deleteProgramme,
      shareDocument,
      attendance,
      resources,
      categories,
			tags,
			programmeTags,
      feedback,
      kpis,
      reminders,
      templates
    ]
  );

  return (
    <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
