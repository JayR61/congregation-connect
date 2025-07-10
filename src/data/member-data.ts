
import { Member, Volunteer } from '@/types';

// Sample data for testing - MEMBERS
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
    newMemberDate: new Date(2020, 0, 1),
    interests: [], // Keep empty array
    category: "member" // Changed to string to match interface
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
    interests: [], // Keep empty array
    category: "leadership", // Changed to string to match interface
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

// Getter function
export const getMembers = () => mockMembers;

// Export directly for compatibility
export const members = mockMembers;
