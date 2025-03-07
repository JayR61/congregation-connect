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

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'comments'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      lastModifiedById: currentUser.id,
      lastModifiedAction: 'created'
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    const creatorName = `${currentUser.firstName} ${currentUser.lastName}`;
    addNotification({
      title: "New Task Created",
      message: `${creatorName} created a new task: "${task.title}"`,
      type: "info",
      targetUrl: `/tasks/${newTask.id}`
    });
    
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, task: Partial<Task>, editorId?: string) => {
    const editor = editorId || currentUser.id;
    const oldTask = tasks.find(t => t.id === id);
    
    if (!oldTask) return;
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === id 
          ? { 
              ...t, 
              ...task, 
              updatedAt: new Date(),
              lastModifiedById: editor,
              lastModifiedAction: task.status === 'completed' ? 'completed' : 'updated'
            } 
          : t
      )
    );
    
    const editorMember = members.find(m => m.id === editor);
    const editorName = editorMember 
      ? `${editorMember.firstName} ${editorMember.lastName}`
      : 'Someone';
    
    let message = `${editorName} updated the task: "${oldTask.title}"`;
    if (task.status === 'completed' && oldTask.status !== 'completed') {
      message = `${editorName} marked the task "${oldTask.title}" as completed`;
    } else if (task.status && task.status !== oldTask.status) {
      message = `${editorName} changed the status of "${oldTask.title}" to ${task.status}`;
    }
    
    addNotification({
      title: "Task Updated",
      message,
      type: "info",
      targetUrl: `/tasks/${id}`
    });
    
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string, deleterId?: string) => {
    const deleter = deleterId || currentUser.id;
    const taskToDelete = tasks.find(t => t.id === id);
    
    if (!taskToDelete) return;
    
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    
    const deleterMember = members.find(m => m.id === deleter);
    const deleterName = deleterMember 
      ? `${deleterMember.firstName} ${deleterMember.lastName}`
      : 'Someone';
    
    addNotification({
      title: "Task Deleted",
      message: `${deleterName} deleted the task: "${taskToDelete.title}"`,
      type: "warning",
      targetUrl: `/tasks`
    });
    
    toast.success("Task deleted successfully");
  };

  const addTaskComment = (taskId: string, content: string) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }
    
    const newComment: TaskComment = {
      id: `comment-${Date.now()}`,
      content,
      authorId: currentUser.id,
      createdAt: new Date()
    };
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              comments: [...t.comments, newComment],
              updatedAt: new Date()
            } 
          : t
      )
    );
    
    const commenterName = `${currentUser.firstName} ${currentUser.lastName}`;
    
    addNotification({
      title: "New Comment",
      message: `${commenterName} commented on task "${taskToUpdate.title}"`,
      type: "info",
      targetUrl: `/tasks/${taskId}`
    });
    
    toast.success("Comment added successfully");
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added successfully");
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, ...transaction, updatedAt: new Date() } 
          : t
      )
    );
    toast.success("Transaction updated successfully");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success("Transaction deleted successfully");
  };

  const addMember = (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: Member = {
      ...member,
      id: `member-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setMembers(prev => [...prev, newMember]);
    toast.success("Member added successfully");
  };

  const updateMember = (id: string, member: Partial<Member>) => {
    setMembers(prev => 
      prev.map(m => 
        m.id === id 
          ? { ...m, ...member, updatedAt: new Date() } 
          : m
      )
    );
    toast.success("Member updated successfully");
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success("Member removed successfully");
  };

  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'versions'>) => {
    const newDocument: Document = {
      ...document,
      id: `document-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [
        {
          id: `version-${Date.now()}`,
          documentId: `document-${Date.now()}`,
          version: 1,
          url: document.url,
          createdById: currentUser.id,
          createdAt: new Date(),
          notes: "Initial version"
        }
      ]
    };
    
    setDocuments(prev => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
  };

  const updateDocument = (id: string, document: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(d => {
        if (d.id === id) {
          if (document.url && document.url !== d.url) {
            const newVersion = {
              id: `version-${Date.now()}`,
              documentId: d.id,
              version: d.versions.length + 1,
              url: document.url,
              createdById: currentUser.id,
              createdAt: new Date(),
              notes: "Updated version"
            };
            
            return { 
              ...d, 
              ...document, 
              updatedAt: new Date(),
              versions: [...d.versions, newVersion]
            };
          }
          
          return { ...d, ...document, updatedAt: new Date() };
        }
        return d;
      })
    );
    toast.success("Document updated successfully");
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast.success("Document deleted successfully");
  };

  const addFolder = (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFolders(prev => [...prev, newFolder]);
    toast.success("Folder created successfully");
  };

  const updateFolder = (id: string, folder: Partial<Folder>) => {
    setFolders(prev => 
      prev.map(f => 
        f.id === id 
          ? { ...f, ...folder, updatedAt: new Date() } 
          : f
      )
    );
    toast.success("Folder updated successfully");
  };

  const deleteFolder = (id: string) => {
    const hasDocuments = documents.some(d => d.folderId === id);
    const hasSubfolders = folders.some(f => f.parentId === id);
    
    if (hasDocuments || hasSubfolders) {
      toast.error("Cannot delete folder with documents or subfolders");
      return;
    }
    
    setFolders(prev => prev.filter(f => f.id !== id));
    toast.success("Folder deleted successfully");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, read: true } 
          : n
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        notifications,
        markNotificationAsRead,
        addNotification,
        tasks,
        taskCategories,
        addTask,
        updateTask,
        deleteTask,
        addTaskComment,
        transactions,
        financeCategories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        members,
        addMember,
        updateMember,
        deleteMember,
        documents,
        folders,
        addDocument,
        updateDocument,
        deleteDocument,
        addFolder,
        updateFolder,
        deleteFolder
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
