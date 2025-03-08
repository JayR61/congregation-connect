import { Member } from '@/types';

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

// Mock data
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
    category: 'elder', // Adding required category property
    notes: 'Regular attendee, volunteers for youth events.',
    structures: ['senior_leadership', 'youth_leadership'],
    positions: [
      {
        title: 'Elder',
        structure: 'senior_leadership',
        startDate: new Date('2021-01-01')
      }
    ],
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
    category: 'regular', // Adding required category property
    notes: 'Choir member, helps with children\'s ministry.',
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
    category: 'pastor', // Adding required category property
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
    category: 'youth', // Adding required category property
    notes: 'Plays piano for worship, youth group leader.',
    structures: ['youth_leadership'],
    positions: [
      {
        title: 'Youth Coordinator',
        structure: 'youth_leadership',
        startDate: new Date('2020-06-01')
      }
    ],
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
    category: 'regular', // Adding required category property
    notes: 'Moved to another city, now attends occasionally when visiting.',
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
    createdAt: new Date('2014-10-12'),
    updatedAt: new Date('2023-04-01'),
  },
];
