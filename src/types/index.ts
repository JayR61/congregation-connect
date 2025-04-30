
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'done' | 'blocked' | 'completed' | 'pending' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  category: string;
  assigneeId: string;
  assigneeIds?: string[]; // Make this optional for backward compatibility
  reporterId: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comments?: TaskComment[];
  categories?: TaskCategory[]; // Add categories array for compatibility
  createdById?: string; // For compatibility with TaskDialog
  lastModifiedById?: string;
  lastModifiedAction?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

// Add these types for TaskDialog component
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  color?: string; // Add color property
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string; // This is the correct field name
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
  type: 'income' | 'expense' | 'both';
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberNote {
  id: string;
  content: string;
  date: Date;
  createdById: string;
  attachments: string[];
  updatedAt?: Date;
}

export interface ResourceProvided {
  id: string;
  description: string;
  date: Date;
  value?: number;
  createdById: string;
  attachments: string[];
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status?: string;
  birthDate: Date;
  joinDate?: Date;
  churchStructureId?: string;
  memberCategoryId?: string;
  churchPositionId?: string;
  isActive?: boolean;
  avatar?: string;
  notes?: string;
  occupation: string;
  skills: string[];
  interests?: string[];
  familyId?: string;
  familyIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  newMemberDate?: Date | string | null;
  isFullMember?: boolean;
  isLeadership?: boolean;
  structures?: string[];
  positions?: Array<{title: string, structure: string, startDate?: Date}>;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  city?: string;
  state?: string;
  zip?: string;
  membershipDate: Date;
  // Additional fields needed by MemberDialog
  attachments?: any[];
  mentorshipPrograms?: any[];
  volunteerRoles?: any[];
  socialMediaAccounts?: any[];
  resourceBookings?: any[];
  // Attendance data
  attendance?: Array<{date: string, isPresent: boolean, notes?: string, eventId?: string, id?: string}>;
  attendanceHistory?: any[];
  givingHistory?: any[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  qualifications?: string[];
  ministryInvolvement?: string[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  familyInfo?: string;
  roles?: string[];
  createdBy?: string;
  updatedBy?: string;
}

// Add missing types for MemberDialog
export interface MemberCategory {
  id: string;
  name: string;
}

export interface ChurchStructure {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  title: string;
}

export interface MemberStatus {
  id: string;
  name: string;
}

export interface MentorshipProgram {
  id: string;
  name: string;
}

export interface Volunteer {
  id: string;
  role: string;
}

export interface SocialMediaAccount {
  id: string;
  platform: string;
}

export interface ResourceBooking {
  id: string;
  resource: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  eventId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  folderId: string | null;
  uploadedById: string;
  uploadDate: Date;
  versions: DocumentVersion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  name: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  url?: string;
  content?: string;
  shared?: boolean;
}

export interface DocumentVersion {
  versionNumber: number;
  uploadDate: Date;
  fileUrl: string;
  uploadedById: string;
  id: string;
  version: number;
  createdAt: Date;
  createdById: string;
  url: string;
  notes?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdById: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  userId: string;
  createdAt: Date;
  read: boolean;
}

export interface Programme {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string;
  category: string;
  tags: string[];
  targetAudience: string;
  currentAttendees: number;
  attendees: string[];
  budget: number;
  status: 'planning' | 'ongoing' | 'completed' | 'cancelled';
  objectives: string[];
  kpis: string[];
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
  type: string;
  name: string;
  coordinator: string;
  capacity: number;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

export interface ProgrammeResource {
  id: string;
  programmeId: string;
  name: string;
  description: string;
  url: string;
  type: 'document' | 'video' | 'audio' | 'link' | 'room'; // Add 'room' as a valid type
  status: 'available' | 'in use' | 'outdated' | 'allocated' | 'pending' | 'denied'; // Add 'pending' and 'denied'
  quantity?: number;
  unit?: string;
  cost?: number;
  notes?: string;
}

export interface ProgrammeFeedback {
  id: string;
  programmeId: string;
  memberId: string;
  rating: number;
  comments: string;
  submittedAt: Date;
}

export interface ProgrammeReminder {
  id: string;
  programmeId: string;
  title: string;
  message: string;
  scheduledTime: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed' | 'scheduled' | 'cancelled';
  recipients?: string[];
  scheduledDate?: Date;
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
}

export interface ProgrammeTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  createdById: string;
  createdAt: Date;
  name?: string;
  type?: string;
  capacity?: number;
  duration?: number; // Add duration property
  resources: Array<{
    name: string;
    type: string;
    quantity: number;
    unit: string;
    cost: number;
    notes: string;
  }>;
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface ProgrammeTag {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  memberIds: Array<{memberId: string, isPresent: boolean, notes?: string}>;
  notes?: string;
}

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
