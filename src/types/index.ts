
// Adding missing type definitions and fixing existing ones

export interface ChurchResource {
  id: string;
  name: string;
  type: string;
  description: string;
  location?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'reserved';
  acquisitionDate?: Date;
  currentAssigneeId?: string;
  maintenanceSchedule?: Date;
  notes?: string;
  imageUrl?: string;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  memberId: string;
  purpose: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'rejected';
  notes?: string;
}

// Fix the existing interfaces to address the type errors

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
}

export interface Document {
  id: string;
  name: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  fileType: string;
  fileSize: number;
  url: string;
  description?: string;
  tags?: string[];
  lastModifiedBy?: string;
  versions: DocumentVersion[];
  // Additional fields that are used in components
  title?: string;
  thumbnailUrl?: string;
  shared?: boolean;
  content?: string;
  uploadedById?: string;
  size?: number; // Alias for fileSize in some places
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  fileSize: number;
  url: string;
  notes?: string;
  createdById?: string;
  uploadedById?: string;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string[]; // Changed to string[] to match the data
  type: 'income' | 'expense';
  paymentMethod?: string;
  reference?: string;
  status?: 'pending' | 'completed' | 'failed';
  attachments?: string[];
  notes?: string;
  recurring?: boolean;
  recurrencePattern?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdById?: string;
  isRecurring?: boolean; // Used in some components
  categoryId?: string; // Used in some forms
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  programmeId?: string;
  isPresent?: boolean;
  eventId?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending' | 'prospect' | 'visitor';
  profileImage?: string;
  bio?: string;
  skills?: string[];
  ministries?: string[];
  roles?: string[];
  notes?: string[];
  attendance?: AttendanceRecord[];
  tags?: string[];
  familyMembers?: string[];
  volunteerRoles?: Volunteer[];
  familyIds?: string[];
  familyId?: string | null;
  structures?: string[];
  positions?: Array<{
    title: string;
    structure: string;
  }>;
  isActive?: boolean;
  isLeadership?: boolean;
  isFullMember?: boolean;
  category?: string;
  occupation?: string;
  birthDate?: Date;
  newMemberDate?: Date;
  city?: string;
  state?: string;
  zip?: string;
  mentorshipPrograms?: MentorshipProgram[];
  avatar?: string;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MemberNote {
  id: string;
  content: string;
  date: Date;
  createdBy: string;
  attachments: any[];
  category?: string;
  isPrivate?: boolean;
  memberId?: string;
  createdById?: string;
}

export interface ResourceProvided {
  id: string;
  description: string;
  date: Date;
  providedById: string;
  type: string;
  name: string;
  details: string;
  value?: number;
  attachments: any[];
  memberId?: string;
  resourceType?: string;
  resourceDetails?: string;
  providedBy?: string;
  notes?: string;
}

export interface Programme {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  location?: string;
  organizer?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'active';
  capacity?: number;
  attendees?: string[];
  category?: string;
  tags?: string[];
  kpis?: ProgrammeKPI[];
  resourceIds?: string[];
  feedback?: ProgrammeFeedback[];
  recurrence?: string;
  reminders?: {
    id: string;
    date: Date;
    sent: boolean;
  }[];
  image?: string;
  title?: string;
  type?: string;
  targetAudience?: string;
  budget?: number;
  objectives?: string[];
  notes?: string;
  coordinator?: string;
  recurring?: boolean;
  frequency?: string;
  currentAttendees?: number;
}

export interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date | string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  isPresent?: boolean;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  records: {
    memberId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }[];
  attendees?: {
    memberId: string;
    isPresent: boolean;
    notes: string;
  }[];
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface ProgrammeTag {
  id: string;
  name: string;
  color?: string;
}

export interface ProgrammeFeedback {
  id: string;
  programmeId: string;
  memberId: string;
  rating: number;
  comments?: string;
  date: Date;
  anonymous?: boolean;
  comment?: string;
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  name: string;
  target: number;
  actual?: number;
  unit: string;
  notes?: string;
  title?: string;
  current?: number;
  description?: string;
  createdAt?: Date;
}

export interface ProgrammeTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity?: number;
  categoryId?: string;
  tags?: string[];
  defaultResourceIds?: string[];
  notes?: string;
  title?: string;
  type?: string;
  content?: string;
  category?: string;
  resources?: string[];
  createdById?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'pending' | 'open' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  categoryId?: string;
  tags?: string[];
  attachments?: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  comments?: TaskComment[];
  parentTaskId?: string;
  subtasks?: Task[];
  programmeId?: string;
  effort?: number;
  assigneeIds?: string[]; // For multiple assignees
  createdById?: string;
  lastModifiedById?: string;
  lastModifiedAction?: string;
  categories?: TaskCategory[];
  category?: string[]; // Changed to string[] to match the data
  reporterId?: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'pending' | 'open' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: string[];
  userId?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  color?: string;
  parentId?: string;
  budget?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
}

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

export interface MentorshipProgram {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  mentors: string[];
  mentees: string[];
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  goals?: string[];
  sessions?: MentorshipSession[];
  resources?: string[];
  notes?: string;
  menteeId?: string;
  title?: string;
  mentorId?: string;
  progress?: number;
}

export interface MentorshipSession {
  id: string;
  programId: string;
  date: Date;
  duration: number;
  title: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  attendees: string[];
}

export interface Volunteer {
  id: string;
  memberId: string;
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
  hours?: number;
  skills?: string[];
  notes?: string;
  area: string;
  ministry?: string;
  role?: string;
  joinDate?: Date;
  availability?: string[];
  hoursPerWeek?: number;
}

export interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
  followers?: number;
  posts?: number;
  engagement?: number;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt?: Date;
  status: 'active' | 'inactive' | 'archived';
  notes?: string;
  handle?: string;
  responsible?: string;
}

export interface ProgrammeResource {
  id: string;
  programmeId: string;
  name: string;
  type: string;
  quantity: number;
  status: 'available' | 'unavailable' | 'allocated';
  notes?: string;
}

export interface ProgrammeReminder {
  id: string;
  programmeId: string;
  date: Date;
  message: string;
  recipientIds?: string[];
  sent: boolean;
  sentDate?: Date;
  createdBy?: string;
  schedule?: 'day_before' | 'hour_before' | 'week_before' | 'custom';
  customTime?: Date;
  status?: 'scheduled' | 'sent' | 'failed';
}

export interface ProgrammeStatistics {
  totalProgrammes: number;
  activeProgrammes: number;
  completedProgrammes: number;
  totalParticipants: number;
  attendanceRate: number;
  programmesByType: Record<string, number>;
  participantsTrend: { month: string; count: number }[];
}
