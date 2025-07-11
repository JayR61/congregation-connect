
import { AttendanceRecord } from './attendance.types';
import { MentorshipProgram } from './mentorship.types';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending' | 'prospect' | 'visitor';
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
  familyIds?: string[];
  familyId?: string | null;
  structures?: string[];
  positions?: Array<{
    title: string;
    structure: string;
  }>;
  isActive?: boolean;
  isLeadership?: boolean;
  isFullMember?: boolean;
  category?: string;
  occupation?: string;
  birthDate?: Date;
  newMemberDate?: Date;
  city?: string;
  state?: string;
  zip?: string;
  mentorshipPrograms?: MentorshipProgram[];
  avatar?: string;
  memberNotes?: MemberNote[];
  resourcesProvided?: ResourceProvided[];
  createdAt?: Date;
  updatedAt?: Date;
  membershipDate?: Date;
}

export interface MemberNote {
  id: string;
  content: string;
  date: Date;
  createdBy: string;
  attachments: any[];
  category?: string;
  isPrivate?: boolean;
  memberId?: string;
  createdById?: string;
}

export interface ResourceProvided {
  id: string;
  description: string;
  date: Date;
  providedById: string;
  type: string;
  name: string;
  details: string;
  value?: number;
  attachments: any[];
  memberId?: string;
  resourceType?: string;
  resourceDetails?: string;
  providedBy?: string;
  notes?: string;
}

export interface Volunteer {
  id: string;
  memberId: string;
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
  hours?: number;
  skills?: string[];
  notes?: string;
  area: string;
  ministry?: string;
  role?: string;
  joinDate?: Date;
  availability?: string[];
  hoursPerWeek?: number;
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

export type ChurchStructure = string;
export type MemberCategory = string;
