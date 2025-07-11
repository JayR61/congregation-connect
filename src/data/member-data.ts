
import { Member, Volunteer } from '@/types/member.types';

// MEMBERS - All data starts empty, users must add members
export const mockMembers: Member[] = [];

// Getter function
export const getMembers = () => mockMembers;

// Export directly for compatibility
export const members = mockMembers;
