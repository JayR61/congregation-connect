
// Add ChurchResource and ResourceBooking types to the index.ts file
// We'll append to the existing exports

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
  status: 'pending' | 'approved' | 'declined' | 'completed';
  notes?: string;
}

// For the build errors we need to re-export all the original types that were imported by other files
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  createdAt: Date;
  createdBy: string;
  fileSize: number;
  url: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  paymentMethod?: string;
  reference?: string;
  status?: 'pending' | 'completed' | 'failed';
  attachments?: string[];
  notes?: string;
  recurring?: boolean;
  recurrencePattern?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  programmeId?: string;
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
  status: 'active' | 'inactive' | 'pending';
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
}

export interface MemberNote {
  id: string;
  memberId: string;
  createdAt: Date;
  createdBy: string;
  content: string;
  category?: string;
  isPrivate?: boolean;
}

export interface ResourceProvided {
  id: string;
  memberId: string;
  resourceType: string;
  resourceDetails: string;
  date: Date;
  providedBy: string;
  notes?: string;
}

export interface Programme {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  organizer?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
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
}

export interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  records: {
    memberId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
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
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  name: string;
  target: number;
  actual?: number;
  unit: string;
  notes?: string;
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
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  categoryId?: string;
  tags?: string[];
  attachments?: string[];
  recurrence?: TaskRecurrence;
  comments?: TaskComment[];
  parentTaskId?: string;
  subtasks?: Task[];
  programmeId?: string;
  effort?: number;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
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
  addComment: (comment: Omit<TaskComment, 'id' | 'createdAt'>) => void;
  updateComment: (id: string, comment: Partial<TaskComment>) => void;
  deleteComment: (id: string) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export interface MentorshipProgram {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  mentors: string[];
  mentees: string[];
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  goals?: string[];
  sessions?: MentorshipSession[];
  resources?: string[];
  notes?: string;
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
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
  hours?: number;
  skills?: string[];
  notes?: string;
}
