
import { Task, Transaction, Member, Document, Folder, User, Notification, TaskCategory, FinanceCategory, ChurchStructure, MemberCategory, ChurchPosition, ChurchStructureData, MemberCategoryData } from '@/types';

// Add functions to simulate API calls
export const getTasks = async (): Promise<Task[]> => {
  return tasks;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return transactions;
};

export const getDocuments = async () => {
  return documents;
};

export const getFolders = async () => {
  return folders;
};

export const getFoldersWithItemCount = async () => {
  return folders.map(folder => {
    const itemCount = documents.filter(doc => doc.folderId === folder.id).length;
    return { ...folder, itemCount };
  });
};

export const getMembers = async (): Promise<Member[]> => {
  return members;
};

// Fixed Member type objects with proper properties
const members: Member[] = [
  {
    id: 'member-1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    status: 'active',
    birthDate: new Date('1990-01-01'),
    joinDate: new Date('2020-01-01'),
    churchStructureId: 'structure-1',
    memberCategoryId: 'category-1',
    churchPositionId: 'position-1',
    isActive: true,
    avatar: '/placeholder.svg',
    notes: 'Active member since 2020',
    occupation: 'Software Engineer',
    skills: ['Programming', 'Web Development'],
    familyInfo: 'Married with two children',
    socialLinks: {
      facebook: 'facebook.com/alice',
      twitter: 'twitter.com/alice',
      linkedin: 'linkedin.com/in/alice'
    },
    emergencyContact: {
      name: 'Bob Smith',
      phone: '098-765-4321',
      relation: 'Husband'
    },
    qualifications: ['BSc Computer Science'],
    ministryInvolvement: ['Youth Ministry', 'Worship Team'],
    attendanceHistory: [],
    givingHistory: [],
    createdBy: 'user-1',
    updatedBy: 'user-1',
    roles: ['member', 'worship_team'],
    familyId: null,
    familyIds: [],
    category: 'regular',
    structures: ['senior_leadership', 'youth_leadership'],
    positions: [{
      structure: 'senior_leadership',
      title: 'Worship Leader',
      startDate: new Date('2020-01-01')
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'member-2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '456-789-0123',
    address: '456 Elm St',
    status: 'inactive',
    birthDate: new Date('1985-02-02'),
    joinDate: new Date('2019-02-02'),
    churchStructureId: 'structure-2',
    memberCategoryId: 'category-2',
    churchPositionId: 'position-2',
    isActive: false,
    avatar: '/placeholder.svg',
    notes: 'Inactive member since 2022',
    occupation: 'Teacher',
    skills: ['Teaching', 'Mentoring'],
    familyInfo: 'Single',
    socialLinks: {
      facebook: 'facebook.com/bob',
      twitter: 'twitter.com/bob',
      linkedin: 'linkedin.com/in/bob'
    },
    emergencyContact: {
      name: 'Carol Johnson',
      phone: '111-222-3333',
      relation: 'Sister'
    },
    qualifications: ['BA Education'],
    ministryInvolvement: ['Sunday School'],
    attendanceHistory: [],
    givingHistory: [],
    createdBy: 'user-1',
    updatedBy: 'user-1',
    roles: ['member', 'sunday_school'],
    familyId: null,
    familyIds: [],
    category: 'regular',
    structures: ['sunday_school'],
    positions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'member-3',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@example.com',
    phone: '789-012-3456',
    address: '789 Oak St',
    status: 'active',
    birthDate: new Date('1992-03-03'),
    joinDate: new Date('2021-03-03'),
    churchStructureId: 'structure-3',
    memberCategoryId: 'category-3',
    churchPositionId: 'position-3',
    isActive: true,
    avatar: '/placeholder.svg',
    notes: 'Active member since 2021',
    occupation: 'Nurse',
    skills: ['Healthcare', 'First Aid'],
    familyInfo: 'Married',
    socialLinks: {
      facebook: 'facebook.com/carol',
      twitter: 'twitter.com/carol',
      linkedin: 'linkedin.com/in/carol'
    },
    emergencyContact: {
      name: 'David Williams',
      phone: '444-555-6666',
      relation: 'Husband'
    },
    qualifications: ['RN'],
    ministryInvolvement: ['Healthcare Ministry'],
    attendanceHistory: [],
    givingHistory: [],
    createdBy: 'user-1',
    updatedBy: 'user-1',
    roles: ['member', 'healthcare_team'],
    familyId: null,
    familyIds: [],
    category: 'regular',
    structures: [],
    positions: [{
      structure: 'mens_forum',
      title: 'Healthcare Coordinator',
      startDate: new Date('2021-03-03')
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'member-4',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@example.com',
    phone: '012-345-6789',
    address: '012 Pine St',
    status: 'prospect',
    birthDate: new Date('1988-04-04'),
    joinDate: new Date('2023-04-04'),
    churchStructureId: 'structure-4',
    memberCategoryId: 'category-4',
    churchPositionId: null,
    isActive: false,
    avatar: '/placeholder.svg',
    notes: 'Potential new member',
    occupation: 'Accountant',
    skills: ['Accounting', 'Finance'],
    familyInfo: 'Single',
    socialLinks: {
      facebook: 'facebook.com/david',
      twitter: 'twitter.com/david',
      linkedin: 'linkedin.com/in/david'
    },
    emergencyContact: {
      name: 'Eve Brown',
      phone: '777-888-9999',
      relation: 'Mother'
    },
    qualifications: ['CPA'],
    ministryInvolvement: [],
    attendanceHistory: [],
    givingHistory: [],
    createdBy: 'user-1',
    updatedBy: 'user-1',
    roles: [],
    familyId: null,
    familyIds: [],
    category: 'visitor',
    structures: [],
    positions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'member-5',
    firstName: 'Eve',
    lastName: 'Davis',
    email: 'eve.davis@example.com',
    phone: '345-678-9012',
    address: '345 Maple St',
    status: 'visitor',
    birthDate: new Date('1995-05-05'),
    joinDate: new Date('2024-05-05'),
    churchStructureId: null,
    memberCategoryId: 'category-5',
    churchPositionId: null,
    isActive: false,
    avatar: '/placeholder.svg',
    notes: 'First-time visitor',
    occupation: 'Student',
    skills: ['Research', 'Writing'],
    familyInfo: 'Single',
    socialLinks: {
      facebook: 'facebook.com/eve',
      twitter: 'twitter.com/eve',
      linkedin: 'linkedin.com/in/eve'
    },
    emergencyContact: {
      name: 'Frank Davis',
      phone: '222-333-4444',
      relation: 'Father'
    },
    qualifications: ['High School Diploma'],
    ministryInvolvement: [],
    attendanceHistory: [],
    givingHistory: [],
    createdBy: 'user-1',
    updatedBy: 'user-1',
    roles: [],
    familyId: null,
    familyIds: [],
    category: 'visitor',
    structures: [],
    positions: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Export all required data
export { members };
export const transactions: Transaction[] = [];
export const documents: Document[] = [];
export const folders: Folder[] = [];
export const currentUser: User = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  avatar: '/placeholder.svg',
  lastActive: new Date(),
  createdAt: new Date()
};
export const notifications: Notification[] = [];
export const taskCategories: TaskCategory[] = [];
export const financeCategories: FinanceCategory[] = [];
export const tasks: Task[] = [];

// Church structures
export const churchStructures: ChurchStructureData[] = [
  { id: 'structure-1', name: 'Senior Leadership', description: 'Senior church leadership including pastors and elders' },
  { id: 'structure-2', name: 'Youth Leadership', description: 'Youth ministry leadership team' },
  { id: 'structure-3', name: 'Men\'s Forum', description: 'Men\'s ministry and outreach' },
  { id: 'structure-4', name: 'Sunday School', description: 'Sunday school and children\'s ministry' }
];

// Member categories
export const memberCategories: MemberCategoryData[] = [
  { id: 'category-1', name: 'Elders', description: 'Church elders' },
  { id: 'category-2', name: 'Pastors', description: 'Church pastors' },
  { id: 'category-3', name: 'Youth', description: 'Youth members' },
  { id: 'category-4', name: 'Children', description: 'Sunday school children' },
  { id: 'category-5', name: 'Visitors', description: 'First-time or occasional visitors' },
  { id: 'category-6', name: 'New Members', description: 'Recently joined members' },
  { id: 'category-7', name: 'Regular Members', description: 'Regular church members' }
];

// Church positions
export const churchPositions: ChurchPosition[] = [
  { id: 'position-1', name: 'Senior Pastor', structureId: 'structure-1' },
  { id: 'position-2', name: 'Elder', structureId: 'structure-1' },
  { id: 'position-3', name: 'Deacon', structureId: 'structure-1' },
  { id: 'position-4', name: 'Youth Pastor', structureId: 'structure-2' },
  { id: 'position-5', name: 'Youth Leader', structureId: 'structure-2' },
  { id: 'position-6', name: 'Men\'s Forum Leader', structureId: 'structure-3' },
  { id: 'position-7', name: 'Sunday School Teacher', structureId: 'structure-4' },
  { id: 'position-8', name: 'Worship Leader', structureId: 'structure-1' },
  { id: 'position-9', name: 'Admin Assistant', structureId: 'structure-1' }
];
