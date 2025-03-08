
import { User } from './index';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'prospect' | 'visitor';
  joinDate?: string;
  notes?: string;
  familyIds?: string[];
  roleIds?: string[];
  teamIds?: string[];
  createdAt: Date;
  updatedAt: Date;
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
