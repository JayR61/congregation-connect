
import { 
  Member, Task, Transaction, FinanceCategory, Document, 
  Folder, Notification, User, Programme, TaskCategory, Volunteer, ProgrammeKPI
} from '@/types';

// Sample data for testing
export const mockMembers: Member[] = [
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
    roles: ["member"],
    createdAt: new Date(),
    updatedAt: new Date(),
    membershipDate: new Date(2020, 0, 1),
    notes: "",
    city: "",
    state: "",
    zip: "",
    newMemberDate: new Date(2020, 0, 1)
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
    roles: ["admin"],
    isLeadership: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    membershipDate: new Date(2019, 3, 10),
    notes: "",
    city: "",
    state: "",
    zip: "",
    newMemberDate: new Date(2019, 3, 10),
    volunteerRoles: [{
      id: "volunteer-1",
      memberId: "member-2",
      position: "greeter",
      department: "Hospitality",
      startDate: new Date(2019, 5, 1),
      status: "active",
      hours: 2,
      area: "Welcome Team",
      ministry: "Hospitality",
      role: "greeter",
      joinDate: new Date(2019, 5, 1),
      availability: ["Sunday morning"]
    }]
  }
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Plan Sunday Service",
    description: "Coordinate with worship team",
    status: "in-progress",
    priority: "high",
    category: ["service"],  // Ensuring this is a string array
    assigneeId: "member-1",
    reporterId: "member-2",
    dueDate: new Date(2023, 5, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "member-2",
    comments: [],
    assigneeIds: ["member-1"],
    categories: [],
    createdById: "member-2",
    lastModifiedById: "member-2", 
    lastModifiedAction: "created"
  }
];

// Add task categories
export const mockTaskCategories: TaskCategory[] = [
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

export const mockTransactions: Transaction[] = [
  {
    id: "transaction-1",
    description: "Sunday offering",
    amount: 1250.00,
    type: "income",
    category: ["Offerings"],  // Ensuring this is a string array
    categoryId: "category-1",
    date: new Date(2023, 4, 7),
    attachments: [],
    isRecurring: false,
    createdById: "member-1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockFinanceCategories: FinanceCategory[] = [
  {
    id: "category-1",
    name: "Offerings",
    type: "income",
    color: "#4caf50"
  },
  {
    id: "category-2",
    name: "Utilities",
    type: "expense",
    color: "#f44336"
  }
];

export const mockDocuments: Document[] = [];
export const mockFolders: Folder[] = [];
export const mockNotifications: Notification[] = [];

export const mockCurrentUser: User = {
  id: "user-1",
  email: "admin@churchapp.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  active: true,
  createdAt: new Date()
};

export const mockProgrammes: Programme[] = [
  {
    id: "programme-1",
    title: "Sunday Service",
    description: "Weekly worship service",
    startDate: new Date(2023, 0, 1),
    endDate: null,
    location: "Main Sanctuary",
    category: "worship",  // Ensuring this is a string (not an array)
    tags: ["sunday", "service"],
    targetAudience: "Everyone",
    currentAttendees: 150,
    attendees: [],
    budget: 500,
    status: "ongoing",
    objectives: ["Worship", "Fellowship"],
    kpis: [],
    notes: "",
    name: "Sunday Service",
    type: "recurring",
    coordinator: "John Doe",
    capacity: 200,
    recurring: true,
    frequency: "weekly"
  }
];

// Additional mock data needed for AppProvider
export const mockAttendance = [];
export const mockResources = [];
export const mockCategories = [];
export const mockTags = [];
export const mockProgrammeTags = [];
export const mockFeedback = [];
export const mockKpis = [];
export const mockReminders = [];
export const mockTemplates = [];

// Export data directly to fix mockDataHelpers.ts issues
export const members = mockMembers;
export const tasks = mockTasks;
export const documents = mockDocuments;
export const folders = mockFolders;
export const transactions = mockTransactions;
export const getMembers = () => mockMembers;
export const getTasks = () => mockTasks;
export const getTransactions = () => mockTransactions;

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

// Fix the properties that have string type errors by ensuring they are string arrays
export const fixMemberData = (members: any[]) => {
  return members.map(member => ({
    ...member,
    skills: Array.isArray(member.skills) ? member.skills : member.skills ? [member.skills] : [],
    interests: Array.isArray(member.interests) ? member.interests : member.interests ? [member.interests] : [],
    // Add any other fields that need to be arrays
  }));
};
