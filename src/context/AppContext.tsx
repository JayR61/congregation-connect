
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
  MentorshipProgram
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

  // Setup notification actions first since it's needed by other action hooks
  const notificationActions = useNotificationActions({ 
    notifications, 
    setNotifications 
  });

  // Task Actions
  const taskActions = useTaskActions({
    tasks,
    setTasks,
    currentUser,
    members,
    addNotification: notificationActions.addNotification
  });

  // Member Actions
  const memberActions = useMemberActions({
    members,
    setMembers
  });

  // Transaction Actions
  const transactionActions = useTransactionActions({
    transactions,
    setTransactions,
    currentUser
  });

  // Document Actions
  const documentActions = useDocumentActions({ 
    documents, 
    setDocuments,
    currentUser 
  });

  // Folder Actions
  const folderActions = useFolderActions({
    folders,
    setFolders,
    currentUser
  });

  // Finance Actions
  const financeActions = useFinanceActions({
    financeCategories,
    setFinanceCategories,
    transactions,
    setTransactions
  });

  // Programme Actions
  const programmeActions = useProgrammeActions({
    programmes,
    setProgrammes,
    currentUser
  });

  const addTaskComment = (taskId: string, comment: Omit<TaskComment, "id" | "createdAt" | "taskId">) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `comment-${Date.now()}`,
              content: comment.content,
              userId: comment.userId,
              taskId,
              createdAt: new Date()
            }
          ]
        };
      }
      return t;
    }));
    return true;
  };

  // Mentorship program methods
  const addMentorshipProgram = (program: MentorshipProgram) => {
    // Add the program to the mentee's record
    setMembers(prev => prev.map(member => {
      if (member.id === program.menteeId) {
        return {
          ...member,
          mentorshipPrograms: [
            ...(member.mentorshipPrograms || []),
            program
          ]
        };
      }
      return member;
    }));
    
    return program;
  };

  // Additional methods for document functionality
  const moveDocument = (documentId: string, folderId: string | null) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          folderId,
          updatedAt: new Date()
        };
      }
      return doc;
    }));
    
    return true;
  };

  // Method for basic attendance recording
  const recordAttendance = (attendanceData: any) => {
    setAttendance(prev => [...prev, attendanceData]);
  };

  // Export methods (simplified placeholders)
  const exportProgrammesToCSV = () => {
    console.log("Exporting programmes to CSV");
    return true;
  };

  const exportAttendanceToCSV = () => {
    console.log("Exporting attendance to CSV");
    return true;
  };

  // Placeholder programme management methods
  const allocateResource = (resource: any) => {
    setResources(prev => [...prev, resource]);
    return resource;
  };

  const updateResourceStatus = (id: string, status: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status };
      }
      return r;
    }));
    return true;
  };

  const exportProgrammeToPDF = (id: string) => {
    console.log(`Exporting programme ${id} to PDF`);
    return true;
  };

  const createProgrammeTemplate = (template: any) => {
    const newTemplate = { ...template, id: `template-${Date.now()}` };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const createProgrammeFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    const newProgramme = {
      ...template,
      id: `programme-${Date.now()}`,
      createdAt: new Date()
    };
    
    setProgrammes(prev => [...prev, newProgramme]);
    return newProgramme;
  };

  const exportProgrammeToCalendar = (id: string) => {
    console.log(`Exporting programme ${id} to calendar`);
    return true;
  };

  const addProgrammeFeedback = (feedbackData: any) => {
    const newFeedback = { ...feedbackData, id: `feedback-${Date.now()}` };
    setFeedback(prev => [...prev, newFeedback]);
    return newFeedback;
  };

  const addProgrammeKPI = (kpi: any) => {
    const newKPI = { ...kpi, id: `kpi-${Date.now()}` };
    setKpis(prev => [...prev, newKPI]);
    return newKPI;
  };

  const updateKPIProgress = (id: string, progress: number) => {
    setKpis(prev => prev.map(k => {
      if (k.id === id) {
        return { ...k, current: progress };
      }
      return k;
    }));
    return true;
  };

  const createProgrammeReminder = (reminder: any) => {
    const newReminder = { ...reminder, id: `reminder-${Date.now()}` };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  };

  const checkAndSendReminders = () => {
    console.log("Checking and sending reminders");
    return true;
  };

  const recordBulkAttendance = (data: any) => {
    setAttendance(prev => [...prev, ...data.attendees.map((a: any) => ({
      id: `attendance-${Date.now()}-${Math.random()}`,
      programmeId: data.programmeId,
      date: data.date,
      memberId: a.memberId,
      isPresent: a.isPresent
    }))]);
    return true;
  };

  const addProgrammeCategory = (category: any) => {
    const newCategory = { ...category, id: `category-${Date.now()}` };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const addProgrammeTag = (tag: any) => {
    const newTag = { ...tag, id: `tag-${Date.now()}` };
    setTags(prev => [...prev, newTag]);
    return newTag;
  };

  const assignTagToProgramme = (programmeId: string, tagId: string) => {
    setProgrammes(prev => prev.map(p => {
      if (p.id === programmeId) {
        return { ...p, tags: [...p.tags, tagId] };
      }
      return p;
    }));
    return true;
  };

  const removeTagFromProgramme = (programmeId: string, tagId: string) => {
    setProgrammes(prev => prev.map(p => {
      if (p.id === programmeId) {
        return { ...p, tags: p.tags.filter(t => t !== tagId) };
      }
      return p;
    }));
    return true;
  };

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
      addTask: taskActions.addTask,
      updateTask: taskActions.updateTask,
      deleteTask: taskActions.deleteTask,
      addTaskComment,
      addMember: memberActions.addMember,
      updateMember: memberActions.updateMember,
      deleteMember: memberActions.deleteMember,
      addTransaction: transactionActions.addTransaction,
      updateTransaction: transactionActions.updateTransaction,
      deleteTransaction: transactionActions.deleteTransaction,
      addNotification: notificationActions.addNotification,
      updateNotification: notificationActions.updateNotification,
      deleteNotification: notificationActions.deleteNotification,
      markNotificationAsRead: notificationActions.markNotificationAsRead,
      clearAllNotifications: () => {
        setNotifications([]);
        return true;
      },
      addDocument: documentActions.addDocument,
      updateDocument: documentActions.updateDocument,
      deleteDocument: documentActions.deleteDocument,
      addDocumentVersion: documentActions.addDocumentVersion,
      addFolder: folderActions.addFolder,
      updateFolder: folderActions.updateFolder,
      deleteFolder: folderActions.deleteFolder,
      addFinanceCategory: financeActions.addFinanceCategory,
      updateFinanceCategory: financeActions.updateFinanceCategory,
      deleteFinanceCategory: financeActions.deleteFinanceCategory,
      addProgramme: programmeActions.addProgramme,
      updateProgramme: programmeActions.updateProgramme,
      deleteProgramme: programmeActions.deleteProgramme,
      shareDocument: documentActions.shareDocument,
      moveDocument,
      recordAttendance,
      exportProgrammesToCSV,
      exportAttendanceToCSV,
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
      checkAndSendReminders,
      recordBulkAttendance,
      addProgrammeCategory,
      addProgrammeTag,
      assignTagToProgramme,
      removeTagFromProgramme,
      addMentorshipProgram
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
      attendance,
      resources,
      categories,
      tags,
      programmeTags,
      feedback,
      kpis,
      reminders,
      templates,
      taskActions,
      memberActions,
      transactionActions,
      notificationActions,
      documentActions,
      folderActions,
      financeActions,
      programmeActions,
      addTaskComment
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
