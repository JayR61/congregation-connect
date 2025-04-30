
import { Member as ImportedMember } from './member';
export type { ChurchStructure, MemberCategory } from './member';

// Extend existing types as needed
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  birthDate: Date;
  joinDate: Date;
  membershipDate?: Date;
  occupation: string;
  skills: string[];
  isLeadership?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  avatar?: string;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  familyIds?: string[];
  familyId?: string;
  category?: string;
  isFullMember?: boolean;
  structures?: string[];
  positions?: Array<{
    title: string;
    structure: string;
  }>;
  attendance?: AttendanceRecord[];
  newMemberDate?: Date;
  city?: string;
  state?: string;
  zip?: string;
  mentorshipPrograms?: any[];
  roles?: string[];
  volunteerRoles?: string[];
  notes?: string;
}

export interface MemberNote {
  id: string;
  memberId?: string;
  content: string;
  type?: 'pastoral' | 'general' | 'follow-up';
  createdAt?: Date;
  updatedById?: string;
  date: Date;               
  createdById?: string;     
  attachments?: string[];   
}

export interface ResourceProvided {
  id: string;
  memberId?: string;
  name?: string;
  type?: 'book' | 'course' | 'counseling' | 'financial' | 'other';
  date: Date;
  details?: string;
  providedById?: string;
  description: string;      
  value?: number;           
  attachments?: string[];   
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assigneeId: string;
  reporterId: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comments: TaskComment[];
  assigneeIds: string[];
  categories: TaskCategory[];
  createdById: string;
  lastModifiedById: string;
  lastModifiedAction: string;
  reminderDate?: Date | null;
  recurrence?: TaskRecurrence;
  dependencyIds?: string[];
  attachments?: any[];
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'done' | 'open';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: Date;
}

export interface TaskCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: Date;
  attachments: string[];
  isRecurring: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  fileType: string;
  size: number;
  url: string;
  folderId: string | null;
  uploadedById: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  versions: DocumentVersion[];
  title?: string;           
  thumbnailUrl?: string;    
  fileSize: number;         
  shared?: boolean;         
  content?: string;         
  createdById?: string;     
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  url: string;
  uploadedById: string;
  notes: string;
  createdAt: Date;
  size: number;
  createdById?: string;     
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  eventId: string;
  date: string | Date;
  isPresent: boolean;
  notes?: string;
}

export interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  attendees: Array<{memberId: string; isPresent: boolean}>;
}

export interface ProgrammeFeedback {
  id: string;
  programmeId: string;
  memberId: string;
  rating: number;
  comment: string;
  date: Date;
  anonymous?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  userId: string;
  targetUrl?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'leader' | 'member';
  lastActive: Date;
  createdAt: Date;
  avatar?: string;
}

export interface Programme {
  id: string;
  title: string; // Required for TaskDetail.tsx
  name: string; // Required for compatibility
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: string;
  tags: string[];
  targetAudience: string;
  currentAttendees: number;
  attendees: any[]; // This could be more specific
  budget: number;
  status: string;
  objectives: string[];
  kpis: string[];
  notes: string;
  type: string;
  coordinator: string;
  capacity: number;
  recurring: boolean;
  frequency: string;
}

export type ProgrammeFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ProgrammeTag {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  title: string;
  name: string; // For compatibility
  description: string;
  target: number;
  current: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeResource {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'room';
  quantity: number;
  unit: string;
  cost: number | null;
  notes: string;
  status: 'available' | 'in use' | 'outdated' | 'allocated' | 'pending' | 'denied';
  programmeId: string;
  description: string;
  url: string;
}

export interface ProgrammeReminder {
  id: string;
  recipients: string[];
  programmeId: string;
  title: string;
  message: string;
  scheduledTime: Date;
  status: 'pending' | 'sent' | 'failed' | 'scheduled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  createdById: string;
  duration: number;
  capacity: number;
  resources: any[];
}

export interface MentorshipProgram {
  id: string;
  title: string;
  name: string; // Both title and name needed
  menteeId: string;
  mentorId: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date | null;
  description: string;
  goals: string[];
  progress: number;
  notes: string;
}

export interface AppContextProps {
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
  recordAttendance: (attendance: any) => void;
  exportProgrammesToCSV: () => void;
  exportAttendanceToCSV: () => void;
  resources: any[];
  categories: any[];
  tags: any[];
  programmeTags: any[];
  feedback: any[];
  kpis: any[];
  reminders: any[];
  templates: any[];
  addProgrammeCategory: (category: any) => any;
  addProgrammeTag: (tag: any) => any;
  assignTagToProgramme: (programmeId: string, tagId: string) => boolean;
  removeTagFromProgramme: (programmeId: string, tagId: string) => boolean;
  allocateResource: (resource: any) => any;
  updateResourceStatus: (id: string, status: string) => boolean;
  exportProgrammeToPDF: (id: string) => void;
  createProgrammeTemplate: (template: any) => any;
  createProgrammeFromTemplate: (templateId: string) => any;
  exportProgrammeToCalendar: (id: string) => void;
  addProgrammeFeedback: (feedback: any) => any;
  addProgrammeKPI: (kpi: any) => any;
  updateKPIProgress: (id: string, progress: number) => boolean;
  createProgrammeReminder: (reminder: any) => any;
  checkAndSendReminders: () => void;
  recordBulkAttendance: (data: any) => void;
  addMentorshipProgram: (program: MentorshipProgram) => MentorshipProgram;
};

// Export member types from member.ts
export * from './member';
