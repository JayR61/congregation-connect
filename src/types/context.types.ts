
import { Member } from './member.types';
import { Task, TaskComment, TaskCategory } from './task.types';
import { Programme } from './programme.types';
import { Transaction, FinanceCategory } from './transaction.types';
import { Document, Folder } from './document.types';
import { Notification, User } from './user.types';
import { MentorshipProgram } from './mentorship.types';

export interface AppContextProps {
  members: Member[];
  tasks: Task[];
  programmes: Programme[];
  transactions: Transaction[];
  categories: FinanceCategory[];
  documents: Document[];
  folders: Folder[];
  notifications: Notification[];
  currentUser: User;
  comments: TaskComment[];
  taskCategories: TaskCategory[];
  mentorshipPrograms: MentorshipProgram[];
  attendance?: any[];
  resources?: any[];
  programmeCategories?: any[];
  tags?: any[];
  programmeTags?: any[];
  feedback?: any[];
  kpis?: any[];
  reminders?: any[];
  templates?: any[];
  
  // Comments
  addComment: (comment: Omit<TaskComment, "id" | "createdAt">) => TaskComment;
  updateComment: (id: string, comment: Partial<TaskComment>) => boolean;
  deleteComment: (id: string) => boolean;
  
  // Members
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Programmes
  addProgramme: (programme: Omit<Programme, 'id'>) => void;
  updateProgramme: (id: string, programme: Partial<Programme>) => void;
  deleteProgramme: (id: string) => void;
  
  // Finance
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Documents
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  
  // Folders
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFolder: (id: string, folder: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  
  // Task comments
  addTaskComment: (taskId: string, comment: Omit<TaskComment, "id" | "createdAt" | "taskId">) => boolean;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // Additional methods used in components
  moveDocument?: (documentId: string, folderId: string | null) => void;
  addDocumentVersion?: (documentId: string, fileUrl: string, notes: string) => void;
  financeCategories?: FinanceCategory[];
  clearAllNotifications?: () => boolean;
  shareDocument?: (documentId: string, memberIds: string[]) => void;
  recordAttendance?: (programmeId: string, memberId: string, date: Date, isPresent: boolean, notes?: string) => void;
  exportProgrammesToCSV?: () => boolean;
  exportAttendanceToCSV?: () => boolean;
  allocateResource?: (resource: any) => any;
  updateResourceStatus?: (id: string, status: string) => boolean;
  exportProgrammeToPDF?: (id: string, members?: Member[]) => boolean;
  createProgrammeTemplate?: (template: any) => any;
  createProgrammeFromTemplate?: (templateId: string) => any;
  exportProgrammeToCalendar?: (id: string) => boolean;
  addProgrammeFeedback?: (feedback: any) => any;
  addProgrammeKPI?: (kpi: any) => any;
  updateKPIProgress?: (id: string, progress: number) => boolean;
  createProgrammeReminder?: (reminder: any) => any;
  checkAndSendReminders?: () => boolean;
  recordBulkAttendance?: (data: any) => boolean;
  addProgrammeCategory?: (category: any) => any;
  addProgrammeTag?: (tag: any) => any;
  assignTagToProgramme?: (programmeId: string, tagId: string) => boolean;
  removeTagFromProgramme?: (programmeId: string, tagId: string) => boolean;
  addMentorshipProgram?: (program: any) => any;
}
