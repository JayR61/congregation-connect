import { User } from './index';

export interface MemberNote {
  id: string;
  memberId?: string;
  content: string;
  type?: 'pastoral' | 'general' | 'follow-up';
  createdAt?: Date;
  updatedById?: string;
  date: Date;
  createdById?: string;
  attachments?: string[];
}

export interface ResourceProvided {
  id: string;
  memberId?: string;
  name?: string;
  type?: 'book' | 'course' | 'counseling' | 'financial' | 'other';
  date: Date;
  details?: string;
  providedById?: string;
  description: string;
  value?: number;
  attachments?: string[];
}

export interface Volunteer {
  id: string;
  memberId: string;
  ministry: string;
  role: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'former' | 'on leave';
  hoursPerWeek: number;
  availability?: string[];
  notes?: string;
  area: string;
  startDate: Date;
  endDate?: Date;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'prospect' | 'visitor';
  birthDate?: Date;
  joinDate?: string | Date;
  membershipDate?: Date;
  notes?: string;
  familyIds?: string[];
  familyId?: string;
  roleIds?: string[];
  teamIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  avatar?: string;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  category?: string;
  isFullMember?: boolean;
  isLeadership?: boolean;
  structures?: string[];
  positions?: Array<{
    title: string;
    structure: string;
  }>;
  occupation?: string;
  skills?: string[];
  newMemberDate?: Date;
  city?: string;
  state?: string;
  zip?: string;
  mentorshipPrograms?: any[];
  roles?: string[];
  volunteerRoles?: Volunteer[];
}

export interface FamilyRelationship {
  id: string;
  memberId: string;
  relatedMemberId: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberRole {
  id: string;
  name: string;
  description?: string;
  isLeadership: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberTeam {
  id: string;
  name: string;
  description?: string;
  leaderId?: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Additional types needed by various components
export type ChurchStructure = string;
export type MemberCategory = string;
