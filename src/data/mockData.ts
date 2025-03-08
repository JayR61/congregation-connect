
import { 
  Member, 
  Transaction, 
  Document, 
  Folder, 
  User,
  Notification,
  TaskCategory,
  FinanceCategory,
  Task
} from '@/types';

// Mock data for members
const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 12345',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1980-01-15'),
    joinDate: new Date('2020-03-10'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'elder',
    notes: 'Regular attendee, volunteers for youth events.',
    structures: ['senior_leadership', 'youth_leadership'],
    positions: [
      {
        title: 'Elder',
        structure: 'senior_leadership',
        startDate: new Date('2021-01-01')
      }
    ],
    roles: ['elder', 'teacher'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2020-03-10'),
    updatedAt: new Date('2023-05-20'),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Springfield, CA 12345',
    city: 'Springfield',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1985-05-22'),
    joinDate: new Date('2018-09-15'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'regular',
    notes: 'Choir member, helps with children\'s ministry.',
    roles: ['choir'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2018-09-15'),
    updatedAt: new Date('2023-04-10'),
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '(555) 234-5678',
    address: '789 Pine St, Lakeview, CA 12345',
    city: 'Lakeview',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1975-11-30'),
    joinDate: new Date('2015-07-22'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'pastor',
    notes: 'Leads men\'s Bible study on Thursdays.',
    structures: ['senior_leadership', 'mens_forum'],
    positions: [
      {
        title: 'Pastor',
        structure: 'senior_leadership',
        startDate: new Date('2015-07-22')
      },
      {
        title: 'Coordinator',
        structure: 'mens_forum',
        startDate: new Date('2016-01-15')
      }
    ],
    roles: ['pastor', 'teacher'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2015-07-22'),
    updatedAt: new Date('2023-06-05'),
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 876-5432',
    address: '101 Cedar Dr, Riverdale, CA 12345',
    city: 'Riverdale',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1992-08-17'),
    joinDate: new Date('2019-11-03'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'youth',
    notes: 'Plays piano for worship, youth group leader.',
    structures: ['youth_leadership'],
    positions: [
      {
        title: 'Youth Coordinator',
        structure: 'youth_leadership',
        startDate: new Date('2020-06-01')
      }
    ],
    roles: ['worship', 'youth'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2019-11-03'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '(555) 345-6789',
    address: '222 Birch Ln, Hillside, CA 12345',
    city: 'Hillside',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1988-03-25'),
    joinDate: new Date('2017-05-14'),
    avatar: '',
    isActive: false,
    status: 'inactive',
    category: 'regular',
    notes: 'Moved to another city, now attends occasionally when visiting.',
    roles: [],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2017-05-14'),
    updatedAt: new Date('2023-01-30'),
  },
  {
    id: '6',
    firstName: 'Linda',
    lastName: 'Wilson',
    email: 'linda.wilson@example.com',
    phone: '(555) 456-7890',
    address: '333 Maple Dr, Valleyview, CA 12345',
    city: 'Valleyview',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1995-04-01'),
    joinDate: new Date('2021-08-01'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'youth',
    notes: 'Helps with social media and announcements.',
    roles: ['media'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2021-08-01'),
    updatedAt: new Date('2023-07-10'),
  },
  {
    id: '7',
    firstName: 'David',
    lastName: 'Garcia',
    email: 'david.garcia@example.com',
    phone: '(555) 567-8901',
    address: '444 Oak Ln, Forest Hills, CA 12345',
    city: 'Forest Hills',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1970-06-10'),
    joinDate: new Date('2016-02-28'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'elder',
    notes: 'Leads the finance committee and building maintenance.',
    structures: ['senior_leadership'],
    positions: [
      {
        title: 'Treasurer',
        structure: 'senior_leadership',
        startDate: new Date('2017-01-01')
      }
    ],
    roles: ['finance', 'maintenance'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2016-02-28'),
    updatedAt: new Date('2023-03-15'),
  },
  {
    id: '8',
    firstName: 'Karen',
    lastName: 'Rodriguez',
    email: 'karen.rodriguez@example.com',
    phone: '(555) 678-9012',
    address: '555 Pine Ave, Sunset Ridge, CA 12345',
    city: 'Sunset Ridge',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1982-09-18'),
    joinDate: new Date('2019-05-05'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'regular',
    notes: 'Coordinates the welcome team and new member orientation.',
    roles: ['greeter', 'orientation'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2019-05-05'),
    updatedAt: new Date('2023-08-01'),
  },
  {
    id: '9',
    firstName: 'Christopher',
    lastName: 'Lee',
    email: 'christopher.lee@example.com',
    phone: '(555) 789-0123',
    address: '666 Maple St, Lakeside, CA 12345',
    city: 'Lakeside',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1998-12-05'),
    joinDate: new Date('2022-01-15'),
    avatar: '',
    isActive: true,
    status: 'active',
    category: 'youth',
    notes: 'Helps with youth events and music ministry.',
    roles: ['youth', 'worship'],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2023-09-20'),
  },
  {
    id: '10',
    firstName: 'Jessica',
    lastName: 'Hall',
    email: 'jessica.hall@example.com',
    phone: '(555) 890-1234',
    address: '777 Oak St, Mountain View, CA 12345',
    city: 'Mountain View',
    state: 'CA',
    zip: '12345',
    birthDate: new Date('1978-07-29'),
    joinDate: new Date('2014-10-12'),
    avatar: '',
    isActive: false,
    status: 'inactive',
    category: 'regular',
    notes: 'Currently on sabbatical, plans to return next year.',
    roles: [],
    familyId: null,
    familyIds: [],
    createdAt: new Date('2014-10-12'),
    updatedAt: new Date('2023-04-01'),
  },
];

// Mock Transactions
const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    type: 'income',
    amount: 5000,
    date: new Date('2023-01-15'),
    categoryId: 'tithes',
    description: 'Sunday tithes and offerings',
    attachments: [],
    isRecurring: false,
    createdById: '1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'trans-2',
    type: 'expense',
    amount: 1200,
    date: new Date('2023-01-20'),
    categoryId: 'utilities',
    description: 'Electricity bill',
    attachments: [],
    isRecurring: true,
    recurringDetails: {
      frequency: 'monthly',
      endDate: null
    },
    createdById: '1',
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20')
  },
  {
    id: 'trans-3',
    type: 'income',
    amount: 2000,
    date: new Date('2023-02-05'),
    categoryId: 'donations',
    description: 'Special donation for youth camp',
    attachments: [],
    isRecurring: false,
    createdById: '1',
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-02-05')
  },
  {
    id: 'trans-4',
    type: 'expense',
    amount: 800,
    date: new Date('2023-02-10'),
    categoryId: 'events',
    description: 'Youth camp expenses',
    attachments: [],
    isRecurring: false,
    createdById: '1',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10')
  },
  {
    id: 'trans-5',
    type: 'expense',
    amount: 150,
    date: new Date('2023-02-15'),
    categoryId: 'supplies',
    description: 'Office supplies',
    attachments: [],
    isRecurring: false,
    createdById: '1',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  }
];

// Mock Documents
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Annual Report 2023',
    description: 'Financial and ministry annual report for 2023',
    folderId: 'folder-1',
    fileType: 'pdf',
    fileSize: 2500000,
    url: 'https://example.com/documents/annual-report-2023.pdf',
    thumbnailUrl: null,
    createdById: '1',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-15'),
    versions: [
      {
        id: 'version-1',
        documentId: 'doc-1',
        version: 1,
        url: 'https://example.com/documents/annual-report-2023.pdf',
        createdById: '1',
        createdAt: new Date('2023-12-15'),
        notes: 'Initial version'
      }
    ],
    shared: false
  },
  {
    id: 'doc-2',
    name: 'Church Constitution',
    description: 'Official church constitution and bylaws',
    folderId: 'folder-2',
    fileType: 'docx',
    fileSize: 1200000,
    url: 'https://example.com/documents/church-constitution.docx',
    thumbnailUrl: null,
    createdById: '1',
    createdAt: new Date('2022-05-10'),
    updatedAt: new Date('2023-03-22'),
    versions: [
      {
        id: 'version-2',
        documentId: 'doc-2',
        version: 1,
        url: 'https://example.com/documents/church-constitution-v1.docx',
        createdById: '1',
        createdAt: new Date('2022-05-10'),
        notes: 'Initial version'
      },
      {
        id: 'version-3',
        documentId: 'doc-2',
        version: 2,
        url: 'https://example.com/documents/church-constitution.docx',
        createdById: '1',
        createdAt: new Date('2023-03-22'),
        notes: 'Updated with new board members'
      }
    ],
    shared: true,
    shareLink: 'https://example.com/share/doc-2'
  }
];

// Mock Folders
const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Reports',
    parentId: null,
    createdById: '1',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2022-01-15')
  },
  {
    id: 'folder-2',
    name: 'Legal Documents',
    parentId: null,
    createdById: '1',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2022-01-15')
  },
  {
    id: 'folder-3',
    name: 'Meeting Minutes',
    parentId: null,
    createdById: '1',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2022-01-15')
  }
];

// Mock Current User
const mockCurrentUser: User = {
  id: '1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@churchchms.com',
  avatar: null,
  role: 'admin',
  lastActive: new Date(),
  createdAt: new Date('2022-01-01')
};

// Mock Notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Member',
    message: 'Linda Wilson has been added as a new member',
    type: 'info',
    read: false,
    targetUrl: '/members/6',
    createdAt: new Date('2023-08-01')
  },
  {
    id: 'notif-2',
    title: 'Payment Due',
    message: 'Electricity bill payment is due in 3 days',
    type: 'warning',
    read: true,
    targetUrl: '/finance',
    createdAt: new Date('2023-07-28')
  }
];

// Mock Task Categories
const mockTaskCategories: TaskCategory[] = [
  {
    id: 'taskcat-1',
    name: 'Administrative',
    color: '#4f46e5'
  },
  {
    id: 'taskcat-2',
    name: 'Events',
    color: '#16a34a'
  },
  {
    id: 'taskcat-3',
    name: 'Maintenance',
    color: '#ea580c'
  }
];

// Mock Finance Categories
const mockFinanceCategories: FinanceCategory[] = [
  {
    id: 'tithes',
    name: 'Tithes & Offerings',
    type: 'income',
    color: '#16a34a'
  },
  {
    id: 'donations',
    name: 'Donations',
    type: 'income',
    color: '#2563eb'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    type: 'expense',
    color: '#dc2626'
  },
  {
    id: 'salaries',
    name: 'Salaries',
    type: 'expense',
    color: '#9333ea'
  },
  {
    id: 'events',
    name: 'Events',
    type: 'expense',
    color: '#ea580c'
  },
  {
    id: 'supplies',
    name: 'Supplies',
    type: 'expense',
    color: '#0891b2'
  }
];

// Mock Tasks
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Prepare Sunday service program',
    description: 'Create the order of service for this Sunday\'s worship',
    status: 'completed',
    priority: 'high',
    categories: [mockTaskCategories[1]],
    dueDate: new Date('2023-08-18'),
    reminderDate: new Date('2023-08-17'),
    recurrence: 'weekly',
    assigneeIds: ['3', '4'],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: '1',
    createdAt: new Date('2023-08-14'),
    updatedAt: new Date('2023-08-17')
  },
  {
    id: 'task-2',
    title: 'Fix sanctuary lighting',
    description: 'Replace the burnt-out bulbs in the sanctuary',
    status: 'in-progress',
    priority: 'medium',
    categories: [mockTaskCategories[2]],
    dueDate: new Date('2023-08-20'),
    reminderDate: null,
    recurrence: 'none',
    assigneeIds: ['7'],
    dependencyIds: [],
    attachments: [],
    comments: [],
    createdById: '1',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-16')
  }
];

// Export data
export {
  mockMembers as members,
  mockTransactions as transactions,
  mockDocuments as documents,
  mockFolders as folders,
  mockCurrentUser as currentUser,
  mockNotifications as notifications,
  mockTaskCategories as taskCategories,
  mockFinanceCategories as financeCategories,
  mockTasks as tasks
};

// Export functions to simulate API calls
export const getMembers = async (): Promise<Member[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockMembers]);
    }, 500);
  });
};

export const getMemberById = async (id: string): Promise<Member | undefined> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMembers.find(member => member.id === id));
    }, 500);
  });
};

export const addMember = async (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMember: Member = {
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...member,
      };
      mockMembers.push(newMember);
      resolve(newMember);
    }, 500);
  });
};

export const updateMember = async (id: string, updates: Partial<Member>): Promise<Member | undefined> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const memberIndex = mockMembers.findIndex(member => member.id === id);
      if (memberIndex !== -1) {
        mockMembers[memberIndex] = {
          ...mockMembers[memberIndex],
          ...updates,
          updatedAt: new Date(),
        };
        resolve(mockMembers[memberIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

export const deleteMember = async (id: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const memberIndex = mockMembers.findIndex(member => member.id === id);
      if (memberIndex !== -1) {
        mockMembers.splice(memberIndex, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Create API-like functions for other data types
export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTransactions]);
    }, 500);
  });
};

export const getDocuments = async (): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDocuments]);
    }, 500);
  });
};

export const getFolders = async (): Promise<Folder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockFolders]);
    }, 500);
  });
};

export const getFoldersWithItemCount = async (): Promise<(Folder & { itemCount: number })[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foldersWithCount = mockFolders.map(folder => {
        const itemCount = mockDocuments.filter(doc => doc.folderId === folder.id).length;
        return { ...folder, itemCount };
      });
      resolve(foldersWithCount);
    }, 500);
  });
};

export const getTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockTasks]);
    }, 500);
  });
};
