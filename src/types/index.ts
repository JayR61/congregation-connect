
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
  comments?: TaskComment[]; // Make comments optional
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
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
  category: string;
  date: Date;
  attachments: string[];
  isRecurring: boolean;
  paymentMethod: string;
  createdById?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinanceCategory {
  id: string;
  name: string;
  description?: string;
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
  membershipDate: Date;
  birthDate: Date;
  occupation: string;
  skills: string[];
  interests: string[];
  familyId?: string;
  familyIds?: string[]; // Keep for backward compatibility
  notes?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  joinDate?: string; // Keep as string to match existing code
  status?: string; // Added field
  isActive?: boolean; // Added field
  category?: string; // Added field
  newMemberDate?: string | Date; // Added field
  isFullMember?: boolean; // Added field
  isLeadership?: boolean; // Added field
  structures?: string[]; // Added field
  positions?: Array<{title: string, structure: string}>; // Added field
  attendance?: Array<{date: string, isPresent: boolean, notes?: string, eventId?: string, id?: string}>; // Added fields for compatibility
  // Additional fields needed by MemberDialog
  attachments?: any[];
  mentorshipPrograms?: any[];
  volunteerRoles?: any[];
  socialMediaAccounts?: any[];
  resourceBookings?: any[];
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
  name: string; // Added field
  fileType: string; // Added field
  fileSize: number; // Added field
  thumbnailUrl?: string; // Added field
  url?: string; // Added field
  content?: string; // Added field
  shared?: boolean; // Added field
}

export interface DocumentVersion {
  versionNumber: number;
  uploadDate: Date;
  fileUrl: string;
  uploadedById: string;
  id: string; // Added field
  version: number; // Added field for backward compatibility
  createdAt: Date; // Added field
  createdById: string; // Added field
  url: string; // Added field
  notes?: string; // Added field
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
  createdAt: string;
  updatedAt: string;
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
  endDate: Date;
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
  type: 'document' | 'video' | 'audio' | 'link';
  status: 'available' | 'in use' | 'outdated';
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
  status: 'pending' | 'sent' | 'failed';
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
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description: string;
}

export interface ProgrammeTag {
  id: string;
  name: string;
  description: string;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  memberIds: string[];
  notes?: string;
}
