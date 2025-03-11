// Task related types
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskModificationAction = 'created' | 'updated' | 'completed' | 'deleted';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  categories: TaskCategory[];
  dueDate: Date | null;
  reminderDate: Date | null;
  recurrence: TaskRecurrence;
  assigneeIds: string[];
  dependencyIds: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedById?: string;
  lastModifiedAction?: TaskModificationAction;
}

// Finance related types
export type TransactionType = 'income' | 'expense';

export interface FinanceCategory {
  id: string;
  name: string;
  type: TransactionType | 'both';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  categoryId: string;
  description: string;
  attachments: TaskAttachment[];
  isRecurring: boolean;
  recurringDetails?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    endDate: Date | null;
  };
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceAdjustment {
  id: string;
  amount: number;
  date: Date;
  reason: string;
  createdById: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Document related types
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

// Member related types
export type MemberStatus = 'active' | 'inactive' | 'prospect' | 'visitor';
export type MemberCategory = 'elder' | 'pastor' | 'youth' | 'child' | 'visitor' | 'new' | 'regular' | 'full';
export type ChurchStructure = 'senior_leadership' | 'youth_leadership' | 'mens_forum' | 'sunday_school';

export interface ChurchStructureData {
  id: string;
  name: string;
  description: string;
}

export interface MemberCategoryData {
  id: string;
  name: string;
  description: string;
}

export interface ChurchPosition {
  id: string;
  name: string;
  structureId: string;
}

export interface Position {
  structure: ChurchStructure;
  title: string;
  startDate: Date;
  endDate?: Date;
}

export interface MemberNote {
  id: string;
  content: string;
  date: Date;
  createdById: string;
  attachments?: string[];
}

export interface ResourceProvided {
  id: string;
  description: string;
  date: Date;
  value?: number;
  createdById: string;
  attachments?: string[];
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  birthDate?: Date | null;
  joinDate: Date;
  avatar?: string | null;
  roles?: string[];
  isActive: boolean;
  familyId?: string | null;
  familyIds?: string[];
  status?: MemberStatus;
  category: MemberCategory;
  structures?: ChurchStructure[];
  positions?: Position[];
  notes?: string;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  attendance?: AttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  churchStructureId?: string;
  memberCategoryId?: string;
  churchPositionId?: string | null;
  occupation?: string;
  skills?: string[];
  familyInfo?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  qualifications?: string[];
  ministryInvolvement?: string[];
  attendanceHistory?: any[];
  givingHistory?: any[];
  isFullMember?: boolean;
  newMemberDate?: Date | null;
}

// Attendance interface
export interface Attendance {
  id: string;
  eventId: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  notes: string;
}

// Document related types
export interface Document {
  id: string;
  name: string;
  description?: string;
  folderId: string | null;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  shared: boolean;
  shareLink?: string;
  versions: DocumentVersion[];
  content?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  url: string;
  createdById: string;
  createdAt: Date;
  notes: string;
}

// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: 'admin' | 'staff' | 'member';
  lastActive?: Date;
  createdAt?: Date;
}

// Notification type
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  targetUrl?: string;
  createdAt: Date;
}

// Church settings
export interface ChurchSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string | null;
  timezone: string;
  currency: string;
}
