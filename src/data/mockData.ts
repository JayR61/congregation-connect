
import { 
  Member, Task, Transaction, FinanceCategory, Document, 
  Folder, Notification, User, Programme, TaskCategory 
} from '@/types';

// Sample data for testing
const mockMembers: Member[] = [
  {
    id: "member-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "555-1234",
    address: "123 Main St",
    status: "active",
    birthDate: new Date(1980, 0, 1),
    joinDate: new Date(2020, 0, 1),
    occupation: "Developer",
    skills: ["programming", "teaching"],
    createdAt: new Date(),
    updatedAt: new Date(),
    membershipDate: new Date(2020, 0, 1)
  },
  {
    id: "member-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "555-5678",
    address: "456 Oak St",
    status: "active",
    birthDate: new Date(1985, 5, 15),
    joinDate: new Date(2019, 3, 10),
    occupation: "Designer",
    skills: ["design", "communication"],
    isLeadership: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    membershipDate: new Date(2019, 3, 10)
  }
];

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Plan Sunday Service",
    description: "Coordinate with worship team",
    status: "in progress",
    priority: "high",
    category: "service",
    assigneeId: "member-1",
    reporterId: "member-2",
    dueDate: new Date(2023, 5, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    assigneeIds: ["member-1"], // Adding this field for compatibility
    categories: [], // Adding this field for compatibility
    createdById: "member-2", // Adding this field for compatibility
    lastModifiedById: "member-2", // Adding this field for compatibility
    lastModifiedAction: "created" // Adding this field for compatibility
  }
];

// Add task categories
const mockTaskCategories: TaskCategory[] = [
  {
    id: "category-1",
    name: "Service",
    description: "Sunday service related tasks",
    color: "#ff5722"
  },
  {
    id: "category-2",
    name: "Administration",
    description: "Administrative tasks",
    color: "#2196f3"
  },
  {
    id: "category-3",
    name: "Outreach",
    description: "Community outreach activities",
    color: "#4caf50"
  }
];

const mockTransactions: Transaction[] = [
  {
    id: "transaction-1",
    description: "Sunday offering",
    amount: 1250.00,
    type: "income",
    categoryId: "category-1",
    date: new Date(2023, 4, 7),
    attachments: [],
    isRecurring: false,
    createdById: "member-1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockFinanceCategories: FinanceCategory[] = [
  {
    id: "category-1",
    name: "Offerings",
    type: "income",
    color: "#4caf50",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "category-2",
    name: "Utilities",
    type: "expense",
    color: "#f44336",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockDocuments: Document[] = [];
const mockFolders: Folder[] = [];
const mockNotifications: Notification[] = [];

const mockCurrentUser: User = {
  id: "user-1",
  email: "admin@churchapp.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  lastActive: new Date(),
  createdAt: new Date()
};

const mockProgrammes: Programme[] = [
  {
    id: "programme-1",
    title: "Sunday Service",
    description: "Weekly worship service",
    startDate: new Date(2023, 0, 1),
    endDate: null,
    location: "Main Sanctuary",
    category: "worship",
    tags: ["sunday", "service"],
    targetAudience: "Everyone",
    currentAttendees: 150,
    attendees: [],
    budget: 500,
    status: "ongoing",
    objectives: ["Worship", "Fellowship"],
    kpis: ["attendance", "engagement"],
    notes: "",
    name: "Sunday Service",
    type: "recurring",
    coordinator: "John Doe",
    capacity: 200,
    recurring: true,
    frequency: "weekly"
  }
];

export const getInitialData = () => {
  return {
    members: mockMembers,
    tasks: mockTasks,
    transactions: mockTransactions,
    financeCategories: mockFinanceCategories,
    documents: mockDocuments,
    folders: mockFolders,
    notifications: mockNotifications,
    currentUser: mockCurrentUser,
    programmes: mockProgrammes,
    taskCategories: mockTaskCategories
  };
};

// Export data directly to fix mockDataHelpers.ts issues
export const members = mockMembers;
export const tasks = mockTasks;
export const documents = mockDocuments;
export const folders = mockFolders;
export const transactions = mockTransactions;
export const getMembers = () => mockMembers;
export const getTasks = () => mockTasks;
export const getTransactions = () => mockTransactions;

