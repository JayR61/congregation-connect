import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Transaction, Member, Document, Folder, User, Notification, TaskCategory, FinanceCategory } from '../types';
import { 
  tasks as initialTasks, 
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

interface AppContextType {
  // User data
  currentUser: User;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  
  // Tasks data and operations
  tasks: Task[];
  taskCategories: TaskCategory[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'comments'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTaskComment: (taskId: string, content: string) => void;
  
  // Finance data and operations
  transactions: Transaction[];
  financeCategories: FinanceCategory[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Members data and operations
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Documents and folders data and operations
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

  // Tasks operations
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'comments'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success("Task created successfully");
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === id 
          ? { ...t, ...task, updatedAt: new Date() } 
          : t
      )
    );
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    toast.success("Task deleted successfully");
  };

  const addTaskComment = (taskId: string, content: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: [
              ...task.comments,
              {
                id: `comment-${Date.now()}`,
                content,
                authorId: currentUser.id,
                createdAt: new Date()
              }
            ],
            updatedAt: new Date()
          };
        }
        return task;
      })
    );
  };

  // Finance operations
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

  // Members operations
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

  // Documents operations
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
          // If the URL changed, add a new version
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

  // Folders operations
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
    // Check if folder has documents or subfolders
    const hasDocuments = documents.some(d => d.folderId === id);
    const hasSubfolders = folders.some(f => f.parentId === id);
    
    if (hasDocuments || hasSubfolders) {
      toast.error("Cannot delete folder with documents or subfolders");
      return;
    }
    
    setFolders(prev => prev.filter(f => f.id !== id));
    toast.success("Folder deleted successfully");
  };

  // Notifications operations
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
