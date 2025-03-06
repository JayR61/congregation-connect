
import { 
  Task, TaskStatus, TaskPriority, TaskCategory, 
  Transaction, FinanceCategory, 
  Member, Document, Folder, User, Notification,
  ChurchSettings
} from "../types";

// Users
export const currentUser: User = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  role: "admin",
  lastActive: new Date(),
  createdAt: new Date(2023, 1, 15)
};

export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "staff",
    lastActive: new Date(),
    createdAt: new Date(2023, 2, 10)
  },
  {
    id: "user-3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "staff",
    lastActive: new Date(2023, 7, 20),
    createdAt: new Date(2023, 3, 5)
  }
];

// Task Categories
export const taskCategories: TaskCategory[] = [
  { id: "category-1", name: "Worship", color: "#3b82f6" },
  { id: "category-2", name: "Outreach", color: "#10b981" },
  { id: "category-3", name: "Administration", color: "#f59e0b" },
  { id: "category-4", name: "Education", color: "#8b5cf6" },
  { id: "category-5", name: "Maintenance", color: "#6b7280" },
  { id: "category-6", name: "Events", color: "#ec4899" }
];

// Tasks
export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Plan Sunday Service",
    description: "Organize music, readings, and sermon for this Sunday's worship service.",
    status: "in-progress",
    priority: "high",
    categories: [taskCategories[0]],
    dueDate: new Date(2023, 8, 15),
    reminderDate: new Date(2023, 8, 14),
    recurrence: "weekly",
    assigneeIds: ["user-1", "user-2"],
    dependencyIds: [],
    attachments: [],
    comments: [
      {
        id: "comment-1",
        content: "I've selected the hymns for this week.",
        authorId: "user-2",
        createdAt: new Date(2023, 8, 10)
      }
    ],
    createdById: "user-1",
    createdAt: new Date(2023, 8, 1),
    updatedAt: new Date(2023, 8, 10)
  },
  {
    id: "task-2",
    title: "Update Church Website",
    description: "Update events, sermon series, and staff information.",
    status: "pending",
    priority: "medium",
    categories: [taskCategories[2]],
    dueDate: new Date(2023, 8, 20),
    reminderDate: null,
    recurrence: "none",
    assigneeIds: ["user-3"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-1",
    createdAt: new Date(2023, 8, 5),
    updatedAt: new Date(2023, 8, 5)
  },
  {
    id: "task-3",
    title: "Organize Food Drive",
    description: "Coordinate with local food bank and set up collection points.",
    status: "pending",
    priority: "high",
    categories: [taskCategories[1]],
    dueDate: new Date(2023, 9, 1),
    reminderDate: new Date(2023, 8, 25),
    recurrence: "none",
    assigneeIds: ["user-1", "user-2"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-2",
    createdAt: new Date(2023, 8, 7),
    updatedAt: new Date(2023, 8, 7)
  },
  {
    id: "task-4",
    title: "Fix Sanctuary Lighting",
    description: "Replace bulbs and repair wiring for the main lighting system.",
    status: "completed",
    priority: "medium",
    categories: [taskCategories[4]],
    dueDate: new Date(2023, 8, 5),
    reminderDate: null,
    recurrence: "none",
    assigneeIds: ["user-3"],
    dependencyIds: [],
    attachments: [],
    comments: [
      {
        id: "comment-2",
        content: "All fixed! Used LED bulbs for energy efficiency.",
        authorId: "user-3",
        createdAt: new Date(2023, 8, 5)
      }
    ],
    createdById: "user-1",
    createdAt: new Date(2023, 7, 28),
    updatedAt: new Date(2023, 8, 5)
  },
  {
    id: "task-5",
    title: "Prepare Bible Study Material",
    description: "Create study guides for the upcoming 6-week series on Psalms.",
    status: "in-progress",
    priority: "medium",
    categories: [taskCategories[3]],
    dueDate: new Date(2023, 8, 25),
    reminderDate: new Date(2023, 8, 20),
    recurrence: "none",
    assigneeIds: ["user-1"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-1",
    createdAt: new Date(2023, 8, 2),
    updatedAt: new Date(2023, 8, 10)
  }
];

// Finance Categories
export const financeCategories: FinanceCategory[] = [
  { id: "finance-category-1", name: "Tithes & Offerings", type: "income", color: "#10b981" },
  { id: "finance-category-2", name: "Donations", type: "income", color: "#3b82f6" },
  { id: "finance-category-3", name: "Events", type: "both", color: "#f59e0b" },
  { id: "finance-category-4", name: "Salaries", type: "expense", color: "#ef4444" },
  { id: "finance-category-5", name: "Utilities", type: "expense", color: "#6b7280" },
  { id: "finance-category-6", name: "Maintenance", type: "expense", color: "#8b5cf6" },
  { id: "finance-category-7", name: "Mission", type: "expense", color: "#ec4899" },
  { id: "finance-category-8", name: "Office Supplies", type: "expense", color: "#f97316" }
];

// Transactions
export const transactions: Transaction[] = [
  {
    id: "transaction-1",
    type: "income",
    amount: 2350.00,
    date: new Date(2023, 7, 6),
    categoryId: "finance-category-1",
    description: "Sunday tithes & offerings",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(2023, 7, 6),
    updatedAt: new Date(2023, 7, 6)
  },
  {
    id: "transaction-2",
    type: "income",
    amount: 2400.00,
    date: new Date(2023, 7, 13),
    categoryId: "finance-category-1",
    description: "Sunday tithes & offerings",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(2023, 7, 13),
    updatedAt: new Date(2023, 7, 13)
  },
  {
    id: "transaction-3",
    type: "income",
    amount: 500.00,
    date: new Date(2023, 7, 15),
    categoryId: "finance-category-2",
    description: "Donation for youth ministry",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(2023, 7, 15),
    updatedAt: new Date(2023, 7, 15)
  },
  {
    id: "transaction-4",
    type: "expense",
    amount: 1200.00,
    date: new Date(2023, 7, 16),
    categoryId: "finance-category-4",
    description: "Part-time worship director salary",
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: "monthly",
      endDate: null
    },
    createdById: "user-1",
    createdAt: new Date(2023, 7, 16),
    updatedAt: new Date(2023, 7, 16)
  },
  {
    id: "transaction-5",
    type: "expense",
    amount: 350.00,
    date: new Date(2023, 7, 20),
    categoryId: "finance-category-5",
    description: "Electricity bill",
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: "monthly",
      endDate: null
    },
    createdById: "user-1",
    createdAt: new Date(2023, 7, 20),
    updatedAt: new Date(2023, 7, 20)
  },
  {
    id: "transaction-6",
    type: "expense",
    amount: 175.00,
    date: new Date(2023, 7, 22),
    categoryId: "finance-category-5",
    description: "Water bill",
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: "monthly",
      endDate: null
    },
    createdById: "user-1",
    createdAt: new Date(2023, 7, 22),
    updatedAt: new Date(2023, 7, 22)
  },
  {
    id: "transaction-7",
    type: "expense",
    amount: 250.00,
    date: new Date(2023, 7, 25),
    categoryId: "finance-category-8",
    description: "Office supplies and printing",
    attachments: [],
    isRecurring: false,
    createdById: "user-2",
    createdAt: new Date(2023, 7, 25),
    updatedAt: new Date(2023, 7, 25)
  },
  {
    id: "transaction-8",
    type: "expense",
    amount: 600.00,
    date: new Date(2023, 7, 28),
    categoryId: "finance-category-7",
    description: "Support for local homeless shelter",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(2023, 7, 28),
    updatedAt: new Date(2023, 7, 28)
  },
  {
    id: "transaction-9",
    type: "income",
    amount: 2500.00,
    date: new Date(2023, 7, 27),
    categoryId: "finance-category-1",
    description: "Sunday tithes & offerings",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(2023, 7, 27),
    updatedAt: new Date(2023, 7, 27)
  },
  {
    id: "transaction-10",
    type: "income",
    amount: 1200.00,
    date: new Date(2023, 8, 2),
    categoryId: "finance-category-3",
    description: "Youth camp registrations",
    attachments: [],
    isRecurring: false,
    createdById: "user-2",
    createdAt: new Date(2023, 8, 2),
    updatedAt: new Date(2023, 8, 2)
  }
];

// Members
export const members: Member[] = [
  {
    id: "member-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    birthDate: new Date(1980, 5, 15),
    joinDate: new Date(2010, 3, 10),
    avatar: "https://i.pravatar.cc/150?img=1",
    roles: ["Pastor", "Elder"],
    isActive: true,
    familyId: "family-1",
    notes: "Senior Pastor",
    createdAt: new Date(2010, 3, 10),
    updatedAt: new Date(2022, 1, 5)
  },
  {
    id: "member-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave",
    city: "Springfield",
    state: "IL",
    zip: "62702",
    birthDate: new Date(1982, 9, 22),
    joinDate: new Date(2012, 6, 15),
    avatar: "https://i.pravatar.cc/150?img=2",
    roles: ["Worship Leader", "Elder"],
    isActive: true,
    familyId: "family-2",
    notes: "Plays piano and leads worship team",
    createdAt: new Date(2012, 6, 15),
    updatedAt: new Date(2022, 2, 10)
  },
  {
    id: "member-3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine St",
    city: "Springfield",
    state: "IL",
    zip: "62703",
    birthDate: new Date(1975, 2, 8),
    joinDate: new Date(2015, 1, 20),
    avatar: "https://i.pravatar.cc/150?img=3",
    roles: ["Deacon", "Youth Leader"],
    isActive: true,
    familyId: "family-3",
    notes: "Coordinates youth activities",
    createdAt: new Date(2015, 1, 20),
    updatedAt: new Date(2022, 3, 15)
  },
  {
    id: "member-4",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    phone: "(555) 456-7890",
    address: "101 Cedar Ln",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    birthDate: new Date(1990, 7, 12),
    joinDate: new Date(2018, 5, 5),
    avatar: "https://i.pravatar.cc/150?img=4",
    roles: ["Children's Ministry", "Missions Committee"],
    isActive: true,
    familyId: "family-4",
    notes: "Teaches Sunday School for elementary children",
    createdAt: new Date(2018, 5, 5),
    updatedAt: new Date(2022, 4, 20)
  },
  {
    id: "member-5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    phone: "(555) 567-8901",
    address: "202 Maple Dr",
    city: "Springfield",
    state: "IL",
    zip: "62705",
    birthDate: new Date(1970, 11, 3),
    joinDate: new Date(2005, 9, 12),
    avatar: "https://i.pravatar.cc/150?img=5",
    roles: ["Trustee", "Finance Committee"],
    isActive: true,
    familyId: "family-5",
    notes: "Manages church finances and budgeting",
    createdAt: new Date(2005, 9, 12),
    updatedAt: new Date(2022, 5, 25)
  },
  {
    id: "member-6",
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarah.miller@example.com",
    phone: "(555) 678-9012",
    address: "303 Birch Rd",
    city: "Springfield",
    state: "IL",
    zip: "62706",
    birthDate: new Date(1988, 4, 17),
    joinDate: new Date(2017, 2, 8),
    avatar: "https://i.pravatar.cc/150?img=6",
    roles: ["Outreach Coordinator", "Worship Team"],
    isActive: true,
    familyId: "family-6",
    notes: "Leads community outreach initiatives",
    createdAt: new Date(2017, 2, 8),
    updatedAt: new Date(2022, 6, 30)
  },
  {
    id: "member-7",
    firstName: "Robert",
    lastName: "Davis",
    email: "robert.davis@example.com",
    phone: "(555) 789-0123",
    address: "404 Walnut St",
    city: "Springfield",
    state: "IL",
    zip: "62707",
    birthDate: new Date(1965, 8, 25),
    joinDate: new Date(2008, 7, 30),
    avatar: "https://i.pravatar.cc/150?img=7",
    roles: ["Elder", "Bible Study Leader"],
    isActive: true,
    familyId: "family-7",
    notes: "Leads Wednesday night Bible study",
    createdAt: new Date(2008, 7, 30),
    updatedAt: new Date(2022, 7, 5)
  },
  {
    id: "member-8",
    firstName: "Jennifer",
    lastName: "Wilson",
    email: "jennifer.wilson@example.com",
    phone: "(555) 890-1234",
    address: "505 Elm St",
    city: "Springfield",
    state: "IL",
    zip: "62708",
    birthDate: new Date(1985, 6, 9),
    joinDate: new Date(2016, 4, 15),
    avatar: "https://i.pravatar.cc/150?img=8",
    roles: ["Hospitality Team", "Prayer Ministry"],
    isActive: true,
    familyId: "family-8",
    notes: "Coordinates church events and hospitality services",
    createdAt: new Date(2016, 4, 15),
    updatedAt: new Date(2022, 8, 10)
  }
];

// Folders
export const folders: Folder[] = [
  {
    id: "folder-1",
    name: "Administrative",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-2",
    name: "Worship",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-3",
    name: "Sermons",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-4",
    name: "Events",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-5",
    name: "Financial",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-6",
    name: "Board Meetings",
    parentId: "folder-1",
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-7",
    name: "Staff Meetings",
    parentId: "folder-1",
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-8",
    name: "Song Sheets",
    parentId: "folder-2",
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  },
  {
    id: "folder-9",
    name: "Budget",
    parentId: "folder-5",
    createdById: "user-1",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15)
  }
];

// Documents
export const documents: Document[] = [
  {
    id: "document-1",
    name: "Church Bylaws.pdf",
    description: "Official bylaws of the church",
    folderId: "folder-1",
    fileType: "application/pdf",
    fileSize: 2500000,
    url: "/documents/bylaws.pdf",
    thumbnailUrl: "/document-thumbnails/pdf.png",
    createdById: "user-1",
    createdAt: new Date(2023, 1, 20),
    updatedAt: new Date(2023, 1, 20),
    versions: [
      {
        id: "version-1",
        documentId: "document-1",
        version: 1,
        url: "/documents/bylaws.pdf",
        createdById: "user-1",
        createdAt: new Date(2023, 1, 20),
        notes: "Initial version"
      }
    ],
    shared: false
  },
  {
    id: "document-2",
    name: "Annual Budget 2023.xlsx",
    description: "Annual budget for 2023",
    folderId: "folder-9",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSize: 1800000,
    url: "/documents/budget_2023.xlsx",
    thumbnailUrl: "/document-thumbnails/excel.png",
    createdById: "user-1",
    createdAt: new Date(2023, 2, 5),
    updatedAt: new Date(2023, 5, 10),
    versions: [
      {
        id: "version-2-1",
        documentId: "document-2",
        version: 1,
        url: "/documents/budget_2023_v1.xlsx",
        createdById: "user-1",
        createdAt: new Date(2023, 2, 5),
        notes: "Initial draft"
      },
      {
        id: "version-2-2",
        documentId: "document-2",
        version: 2,
        url: "/documents/budget_2023.xlsx",
        createdById: "user-1",
        createdAt: new Date(2023, 5, 10),
        notes: "Updated with Q2 adjustments"
      }
    ],
    shared: true,
    shareLink: "https://example.com/shared/budget2023"
  },
  {
    id: "document-3",
    name: "Board Meeting Minutes - July 2023.docx",
    description: "Minutes from July board meeting",
    folderId: "folder-6",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 500000,
    url: "/documents/board_minutes_july_2023.docx",
    thumbnailUrl: "/document-thumbnails/word.png",
    createdById: "user-2",
    createdAt: new Date(2023, 7, 15),
    updatedAt: new Date(2023, 7, 15),
    versions: [
      {
        id: "version-3",
        documentId: "document-3",
        version: 1,
        url: "/documents/board_minutes_july_2023.docx",
        createdById: "user-2",
        createdAt: new Date(2023, 7, 15),
        notes: "Approved minutes"
      }
    ],
    shared: false
  },
  {
    id: "document-4",
    name: "Church Picnic Flyer.jpg",
    description: "Promotional flyer for annual church picnic",
    folderId: "folder-4",
    fileType: "image/jpeg",
    fileSize: 3500000,
    url: "/documents/picnic_flyer.jpg",
    thumbnailUrl: "/documents/picnic_flyer_thumb.jpg",
    createdById: "user-3",
    createdAt: new Date(2023, 6, 28),
    updatedAt: new Date(2023, 6, 28),
    versions: [
      {
        id: "version-4",
        documentId: "document-4",
        version: 1,
        url: "/documents/picnic_flyer.jpg",
        createdById: "user-3",
        createdAt: new Date(2023, 6, 28),
        notes: "Final version for printing"
      }
    ],
    shared: true,
    shareLink: "https://example.com/shared/picnicflyer"
  },
  {
    id: "document-5",
    name: "Worship Songs - August 6.pdf",
    description: "Song sheets for August 6 service",
    folderId: "folder-8",
    fileType: "application/pdf",
    fileSize: 1200000,
    url: "/documents/worship_aug6.pdf",
    thumbnailUrl: "/document-thumbnails/pdf.png",
    createdById: "user-2",
    createdAt: new Date(2023, 7, 31),
    updatedAt: new Date(2023, 7, 31),
    versions: [
      {
        id: "version-5",
        documentId: "document-5",
        version: 1,
        url: "/documents/worship_aug6.pdf",
        createdById: "user-2",
        createdAt: new Date(2023, 7, 31),
        notes: "Final set list"
      }
    ],
    shared: false
  }
];

// Notifications
export const notifications: Notification[] = [
  {
    id: "notification-1",
    title: "Task Assigned",
    message: "You have been assigned to 'Plan Sunday Service'",
    type: "info",
    read: false,
    targetUrl: "/tasks/task-1",
    createdAt: new Date(2023, 8, 1)
  },
  {
    id: "notification-2",
    title: "Task Due Soon",
    message: "Task 'Update Church Website' is due in 2 days",
    type: "warning",
    read: false,
    targetUrl: "/tasks/task-2",
    createdAt: new Date(2023, 8, 18)
  },
  {
    id: "notification-3",
    title: "New Budget Entry",
    message: "New expense has been added to the budget",
    type: "info",
    read: true,
    targetUrl: "/finance",
    createdAt: new Date(2023, 8, 15)
  }
];

// Church Settings
export const churchSettings: ChurchSettings = {
  name: "Grace Community Church",
  address: "123 Faith Street, Springfield, IL 62701",
  phone: "(555) 123-4567",
  email: "info@gracecommunity.example.com",
  website: "www.gracecommunity.example.com",
  logo: "/images/church-logo.png",
  timezone: "America/Chicago",
  currency: "USD"
};

// Helper function to get transactions by type
export const getTransactionsByType = (type: "income" | "expense") => {
  return transactions.filter(transaction => transaction.type === type);
};

// Helper function to get total income
export const getTotalIncome = (): number => {
  return getTransactionsByType("income").reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Helper function to get total expenses
export const getTotalExpenses = (): number => {
  return getTransactionsByType("expense").reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Helper function to get current balance
export const getCurrentBalance = (): number => {
  return getTotalIncome() - getTotalExpenses();
};

// Helper function to get financial data for charts
export const getFinancialChartData = () => {
  // Income vs Expenses by month
  const monthlyData = [
    { name: "Jan", income: 8500, expenses: 7200 },
    { name: "Feb", income: 8700, expenses: 7300 },
    { name: "Mar", income: 9000, expenses: 7500 },
    { name: "Apr", income: 8900, expenses: 7400 },
    { name: "May", income: 9200, expenses: 7600 },
    { name: "Jun", income: 9500, expenses: 7800 },
    { name: "Jul", income: 9300, expenses: 7700 },
    { name: "Aug", income: 9800, expenses: 8000 }
  ];

  // Expenses by category
  const categoryExpenses = financeCategories
    .filter(category => category.type === "expense" || category.type === "both")
    .map(category => {
      const totalAmount = transactions
        .filter(t => t.type === "expense" && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: totalAmount,
        color: category.color
      };
    })
    .filter(item => item.value > 0);

  return {
    monthlyData,
    categoryExpenses
  };
};

// Helper function to get task statistics
export const getTaskStatistics = () => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === "completed").length;
  const inProgress = tasks.filter(task => task.status === "in-progress").length;
  const pending = tasks.filter(task => task.status === "pending").length;
  const assignedToCurrentUser = tasks.filter(task => 
    task.assigneeIds.includes(currentUser.id)
  ).length;
  const overdue = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
  ).length;

  return {
    total,
    completed,
    inProgress,
    pending,
    assignedToCurrentUser,
    overdue
  };
};

// Task distribution by priority
export const getTaskDistributionByPriority = () => {
  const highPriority = tasks.filter(task => task.priority === "high").length;
  const mediumPriority = tasks.filter(task => task.priority === "medium").length;
  const lowPriority = tasks.filter(task => task.priority === "low").length;

  return [
    { name: "High", value: highPriority },
    { name: "Medium", value: mediumPriority },
    { name: "Low", value: lowPriority }
  ];
};

// Task distribution by status
export const getTaskDistributionByStatus = () => {
  const completed = tasks.filter(task => task.status === "completed").length;
  const inProgress = tasks.filter(task => task.status === "in-progress").length;
  const pending = tasks.filter(task => task.status === "pending").length;

  return [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Pending", value: pending }
  ];
};

// Task distribution by category
export const getTaskDistributionByCategory = () => {
  const categoryCounts = taskCategories.map(category => {
    const count = tasks.filter(task => 
      task.categories.some(cat => cat.id === category.id)
    ).length;

    return {
      name: category.name,
      value: count,
      color: category.color
    };
  }).filter(item => item.value > 0);

  return categoryCounts;
};
