import { 
  Task, 
  TaskCategory, 
  Transaction, 
  FinanceCategory, 
  Member, 
  Document, 
  Folder, 
  User, 
  Notification 
} from "../types";

// Current user
export const currentUser: User = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  role: "admin",
  lastActive: new Date(),
  createdAt: new Date("2023-01-15")
};

// Task Categories
export const taskCategories: TaskCategory[] = [
  { id: "cat-1", name: "Worship", color: "#4f46e5" },
  { id: "cat-2", name: "Outreach", color: "#10b981" },
  { id: "cat-3", name: "Administrative", color: "#f59e0b" },
  { id: "cat-4", name: "Maintenance", color: "#6366f1" },
  { id: "cat-5", name: "Events", color: "#ec4899" }
];

// Tasks
export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Prepare Sunday Service Materials",
    description: "Create slides, print bulletins, and prepare music sheets for the Sunday service.",
    status: "pending",
    priority: "high",
    categories: [taskCategories[0]],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    recurrence: "weekly",
    assigneeIds: ["user-1", "user-2"],
    dependencyIds: [],
    attachments: [],
    comments: [
      {
        id: "comment-1",
        content: "Don't forget to include the new song we practiced last week.",
        authorId: "user-2",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
      }
    ],
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "task-2",
    title: "Organize Community Food Drive",
    description: "Coordinate with local businesses and volunteers to organize a food drive for the homeless shelter.",
    status: "in-progress",
    priority: "medium",
    categories: [taskCategories[1]],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    recurrence: "none",
    assigneeIds: ["user-1", "user-3", "user-4"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
  },
  {
    id: "task-3",
    title: "Fix Sanctuary Lighting",
    description: "Replace the burned-out bulbs in the sanctuary and check the wiring for the stage lights.",
    status: "completed",
    priority: "high",
    categories: [taskCategories[3]],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    reminderDate: null,
    recurrence: "none",
    assigneeIds: ["user-5"],
    dependencyIds: [],
    attachments: [],
    comments: [
      {
        id: "comment-2",
        content: "All fixed! Used the LED bulbs as requested.",
        authorId: "user-5",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
      },
      {
        id: "comment-3",
        content: "Great job, they look much better now.",
        authorId: "user-1",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
      }
    ],
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: "task-4",
    title: "Prepare Annual Financial Report",
    description: "Compile all financial data from the past year and prepare the annual report for the congregation.",
    status: "pending",
    priority: "high",
    categories: [taskCategories[2]],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    recurrence: "none",
    assigneeIds: ["user-1"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    id: "task-5",
    title: "Plan Easter Service",
    description: "Coordinate the special Easter service, including music, decorations, and program.",
    status: "in-progress",
    priority: "medium",
    categories: [taskCategories[0], taskCategories[4]],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 21)),
    reminderDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    recurrence: "none",
    assigneeIds: ["user-1", "user-2", "user-3"],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
  }
];

// Finance Categories
export const financeCategories: FinanceCategory[] = [
  { id: "fin-cat-1", name: "Tithes & Offerings", type: "income", color: "#10b981" },
  { id: "fin-cat-2", name: "Donations", type: "income", color: "#6366f1" },
  { id: "fin-cat-3", name: "Utilities", type: "expense", color: "#ef4444" },
  { id: "fin-cat-4", name: "Salaries", type: "expense", color: "#f59e0b" },
  { id: "fin-cat-5", name: "Maintenance", type: "expense", color: "#8b5cf6" },
  { id: "fin-cat-6", name: "Outreach Programs", type: "expense", color: "#ec4899" },
  { id: "fin-cat-7", name: "Office Supplies", type: "expense", color: "#14b8a6" }
];

// Transactions
export const transactions: Transaction[] = [
  {
    id: "trans-1",
    type: "income",
    amount: 5250.75,
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    categoryId: "fin-cat-1",
    description: "Sunday service tithes and offerings",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    id: "trans-2",
    type: "income",
    amount: 1000,
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    categoryId: "fin-cat-2",
    description: "Anonymous donation for youth program",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5))
  },
  {
    id: "trans-3",
    type: "expense",
    amount: 420.33,
    date: new Date(new Date().setDate(new Date().getDate() - 7)),
    categoryId: "fin-cat-3",
    description: "Electric bill for March",
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: "monthly",
      endDate: null
    },
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 7))
  },
  {
    id: "trans-4",
    type: "expense",
    amount: 4500,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    categoryId: "fin-cat-4",
    description: "Staff salaries for March",
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: "monthly",
      endDate: null
    },
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "trans-5",
    type: "expense",
    amount: 850,
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
    categoryId: "fin-cat-5",
    description: "Roof repair",
    attachments: [],
    isRecurring: false,
    createdById: "user-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 10))
  }
];

// Members
export const members: Member[] = [
  {
    id: "member-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    birthDate: new Date("1985-06-15"),
    joinDate: new Date("2015-03-10"),
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    roles: ["Pastor", "Admin"],
    isActive: true,
    familyId: "family-1",
    notes: "Senior Pastor",
    createdAt: new Date("2015-03-10"),
    updatedAt: new Date("2022-01-15")
  },
  {
    id: "member-2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave",
    city: "Springfield",
    state: "IL",
    zip: "62702",
    birthDate: new Date("1990-11-22"),
    joinDate: new Date("2018-05-20"),
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    roles: ["Worship Leader"],
    isActive: true,
    familyId: "family-2",
    notes: "Excellent singer and pianist",
    createdAt: new Date("2018-05-20"),
    updatedAt: new Date("2022-02-10")
  },
  {
    id: "member-3",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@example.com",
    phone: "555-456-7890",
    address: "789 Pine Rd",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    birthDate: new Date("1975-03-28"),
    joinDate: new Date("2010-11-05"),
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    roles: ["Deacon", "Finance Committee"],
    isActive: true,
    familyId: "family-3",
    notes: "Manages church finances",
    createdAt: new Date("2010-11-05"),
    updatedAt: new Date("2022-01-30")
  },
  {
    id: "member-4",
    firstName: "Mary",
    lastName: "Williams",
    email: "mary.williams@example.com",
    phone: "555-789-0123",
    address: "321 Cedar Ln",
    city: "Springfield",
    state: "IL",
    zip: "62703",
    birthDate: new Date("1982-09-14"),
    joinDate: new Date("2017-02-18"),
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    roles: ["Sunday School Teacher"],
    isActive: true,
    familyId: "family-4",
    notes: "Works with children ages 5-8",
    createdAt: new Date("2017-02-18"),
    updatedAt: new Date("2022-03-05")
  },
  {
    id: "member-5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phone: "555-234-5678",
    address: "654 Maple Dr",
    city: "Springfield",
    state: "IL",
    zip: "62707",
    birthDate: new Date("1995-07-30"),
    joinDate: new Date("2019-08-12"),
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    roles: ["Youth Leader"],
    isActive: true,
    familyId: "family-5",
    notes: "College student, works with teens",
    createdAt: new Date("2019-08-12"),
    updatedAt: new Date("2022-02-25")
  }
];

// Folders
export const folders: Folder[] = [
  {
    id: "folder-1",
    name: "Sermons",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date("2022-01-05"),
    updatedAt: new Date("2022-01-05")
  },
  {
    id: "folder-2",
    name: "Financial Reports",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date("2022-01-10"),
    updatedAt: new Date("2022-01-10")
  },
  {
    id: "folder-3",
    name: "Meeting Minutes",
    parentId: null,
    createdById: "user-1",
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2022-01-15")
  },
  {
    id: "folder-4",
    name: "2023",
    parentId: "folder-1",
    createdById: "user-1",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02")
  },
  {
    id: "folder-5",
    name: "2022",
    parentId: "folder-1",
    createdById: "user-1",
    createdAt: new Date("2022-01-05"),
    updatedAt: new Date("2022-01-05")
  }
];

// Documents
export const documents: Document[] = [
  {
    id: "doc-1",
    name: "Easter Sunday Sermon.pdf",
    description: "Easter Sunday sermon transcript",
    folderId: "folder-4",
    fileType: "application/pdf",
    fileSize: 1258000,
    url: "/documents/sermon-easter-2023.pdf",
    thumbnailUrl: null,
    createdById: "user-1",
    createdAt: new Date("2023-04-09"),
    updatedAt: new Date("2023-04-09"),
    versions: [
      {
        id: "version-1",
        documentId: "doc-1",
        version: 1,
        url: "/documents/sermon-easter-2023.pdf",
        createdById: "user-1",
        createdAt: new Date("2023-04-09"),
        notes: "Initial version"
      }
    ],
    shared: false
  },
  {
    id: "doc-2",
    name: "Annual Financial Report 2022.xlsx",
    description: "Complete financial report for 2022",
    folderId: "folder-2",
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileSize: 2540000,
    url: "/documents/financial-report-2022.xlsx",
    thumbnailUrl: null,
    createdById: "user-1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-20"),
    versions: [
      {
        id: "version-2",
        documentId: "doc-2",
        version: 1,
        url: "/documents/financial-report-2022-draft.xlsx",
        createdById: "user-1",
        createdAt: new Date("2023-01-15"),
        notes: "Draft version"
      },
      {
        id: "version-3",
        documentId: "doc-2",
        version: 2,
        url: "/documents/financial-report-2022.xlsx",
        createdById: "user-1",
        createdAt: new Date("2023-01-20"),
        notes: "Final version"
      }
    ],
    shared: true,
    shareLink: "https://share.example.com/doc-2"
  },
  {
    id: "doc-3",
    name: "Church Board Meeting Minutes - March 2023.docx",
    description: "Minutes from the March board meeting",
    folderId: "folder-3",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 856000,
    url: "/documents/board-minutes-march-2023.docx",
    thumbnailUrl: null,
    createdById: "user-1",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
    versions: [
      {
        id: "version-4",
        documentId: "doc-3",
        version: 1,
        url: "/documents/board-minutes-march-2023.docx",
        createdById: "user-1",
        createdAt: new Date("2023-03-15"),
        notes: "Initial version"
      }
    ],
    shared: false
  },
  {
    id: "doc-4",
    name: "Christmas Program 2022.jpg",
    description: "Photo from the Christmas program",
    folderId: null,
    fileType: "image/jpeg",
    fileSize: 3540000,
    url: "/documents/christmas-program-2022.jpg",
    thumbnailUrl: "/documents/christmas-program-2022-thumb.jpg",
    createdById: "user-1",
    createdAt: new Date("2022-12-24"),
    updatedAt: new Date("2022-12-24"),
    versions: [
      {
        id: "version-5",
        documentId: "doc-4",
        version: 1,
        url: "/documents/christmas-program-2022.jpg",
        createdById: "user-1",
        createdAt: new Date("2022-12-24"),
        notes: "Initial version"
      }
    ],
    shared: true,
    shareLink: "https://share.example.com/doc-4"
  },
  {
    id: "doc-5",
    name: "Church Bylaws.pdf",
    description: "Official church bylaws document",
    folderId: null,
    fileType: "application/pdf",
    fileSize: 4250000,
    url: "/documents/church-bylaws.pdf",
    thumbnailUrl: null,
    createdById: "user-1",
    createdAt: new Date("2022-05-10"),
    updatedAt: new Date("2022-05-10"),
    versions: [
      {
        id: "version-6",
        documentId: "doc-5",
        version: 1,
        url: "/documents/church-bylaws.pdf",
        createdById: "user-1",
        createdAt: new Date("2022-05-10"),
        notes: "Initial version"
      }
    ],
    shared: false
  }
];

// Notifications
export const notifications: Notification[] = [
  {
    id: "notif-1",
    title: "Task Assigned",
    message: "You have been assigned to the task 'Prepare Sunday Service Materials'",
    type: "info",
    read: false,
    targetUrl: "/tasks/task-1",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "notif-2",
    title: "Task Completed",
    message: "The task 'Fix Sanctuary Lighting' has been marked as completed",
    type: "success",
    read: true,
    targetUrl: "/tasks/task-3",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
  },
  {
    id: "notif-3",
    title: "New Comment",
    message: "New comment on 'Prepare Annual Financial Report'",
    type: "info",
    read: false,
    targetUrl: "/tasks/task-4",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3))
  },
  {
    id: "notif-4",
    title: "Transaction Recorded",
    message: "A new transaction 'Staff salaries for March' has been recorded",
    type: "info",
    read: false,
    targetUrl: "/finance/transactions",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
  },
  {
    id: "notif-5",
    title: "Document Shared",
    message: "The document 'Annual Financial Report 2022.xlsx' has been shared with you",
    type: "info",
    read: true,
    targetUrl: "/documents/doc-2",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4))
  }
];

export const emptyState = {
  tasks: {
    title: "No Tasks Found",
    description: "There are no tasks matching your current filters. Try adjusting your filters or create a new task.",
    action: "Create Task"
  },
  members: {
    title: "No Members Found",
    description: "There are no members matching your search criteria. Try adjusting your search or add a new member.",
    action: "Add Member"
  },
  finance: {
    title: "No Transactions Found",
    description: "There are no financial transactions for the selected period. Try adjusting the date range or add a new transaction.",
    action: "Add Transaction"
  },
  documents: {
    title: "No Documents Found",
    description: "There are no documents in this folder. Upload a new document to get started.",
    action: "Upload Document"
  }
};

// Data retrieval functions
export const getTasks = (): Task[] => {
  return tasks;
};

export const getTaskCategories = (): TaskCategory[] => {
  return taskCategories;
};

export const getTransactions = (): Transaction[] => {
  return transactions;
};

export const getFinanceCategories = (): FinanceCategory[] => {
  return financeCategories;
};

export const getMembers = (): Member[] => {
  return members;
};

export const getDocuments = (folderId: string | null = null): Document[] => {
  if (folderId === 'root' || folderId === null) {
    return documents.filter(doc => doc.folderId === null);
  }
  return documents.filter(doc => doc.folderId === folderId);
};

export const getFolders = (parentId: string | null = null): Folder[] => {
  if (parentId === 'root' || parentId === null) {
    return folders.filter(folder => folder.parentId === null);
  }
  return folders.filter(folder => folder.parentId === parentId);
};

// Helper function to add folder item count
export const getFoldersWithItemCount = (parentId: string | null = null): (Folder & { itemCount: number })[] => {
  const filteredFolders = getFolders(parentId);
  
  return filteredFolders.map(folder => {
    const subfolderCount = folders.filter(f => f.parentId === folder.id).length;
    const documentCount = documents.filter(d => d.folderId === folder.id).length;
    
    return {
      ...folder,
      itemCount: subfolderCount + documentCount
    };
  });
};
