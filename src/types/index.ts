
// Types for Programme related features
export interface Programme {
  id: string;
  name: string;
  type: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  coordinator: string;
  capacity: number;
  currentAttendees: number;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
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
  memberIds: {
    memberId: string;
    isPresent: boolean;
    notes?: string;
  }[];
}

export interface ProgrammeFeedback {
  id: string;
  programmeId: string;
  memberId: string;
  rating: number;
  comments?: string;
  submittedAt: Date;
}

export interface ProgrammeReminder {
  id: string;
  programmeId: string;
  title: string;
  message: string;
  scheduledDate: Date;
  sentDate?: Date;
  status: 'scheduled' | 'sent' | 'cancelled';
  recipients: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  structure: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface ProgrammeTag {
  id: string;
  name: string;
  color: string;
}

export interface ProgrammeResource {
  id: string;
  programmeId: string;
  name: string;
  type: string;
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammeStatistics {
  totalProgrammes: number;
  activeProgrammes: number;
  completedProgrammes: number;
  totalParticipants: number;
  attendanceRate: number;
  programmesByType: Record<string, number>;
  participantsTrend: {
    month: string;
    count: number;
  }[];
}

// Member related types
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'prospect' | 'visitor';
  joinDate?: string;
  notes?: string;
  familyIds?: string[];
  roleIds?: string[];
  teamIds?: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ChurchStructure {
  id: string;
  name: string;
  type: string;
  parentId?: string;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
}

export interface MemberStatus {
  id: string;
  name: string;
  description?: string;
}

export interface MentorshipProgram {
  id: string;
  name: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  memberId: string;
  area: string;
  hours: number;
}

export interface SocialMediaAccount {
  id: string;
  memberId: string;
  platform: string;
  username: string;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
}

export interface MemberNote {
  id: string;
  memberId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface ResourceProvided {
  id: string;
  memberId: string;
  resourceType: string;
  description: string;
  date: Date;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  eventId: string;
  date: Date;
  isPresent: boolean;
}

// Document related types
export interface Document {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  folderId: string | null;
  url: string;
  thumbnailUrl?: string;
  shared: boolean;
  content?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  url: string;
  createdById: string;
  notes?: string;
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

// Finance related types
export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

// Tasks related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  completedDate?: Date;
  categoryId?: string;
  recurrence?: TaskRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

// User and notification types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Import member types for backward compatibility
export * from './member';
