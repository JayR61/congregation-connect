import { MentorshipProgram, MentorshipSession } from '@/types/mentorship.types';

export const mockMentorshipPrograms: MentorshipProgram[] = [];

export const mockMentorshipSessions: MentorshipSession[] = [];

export const mentorshipPrograms = mockMentorshipPrograms;
export const mentorshipSessions = mockMentorshipSessions;

export const getMentorshipPrograms = () => mockMentorshipPrograms;
export const getMentorshipSessions = (programId?: string) => {
  if (programId) {
    return mockMentorshipSessions.filter(session => session.programId === programId);
  }
  return mockMentorshipSessions;
};

export const addMentorshipProgram = (program: Omit<MentorshipProgram, 'id'>) => {
  const newProgram: MentorshipProgram = {
    ...program,
    id: `program-${Date.now()}`
  };
  mockMentorshipPrograms.push(newProgram);
  return newProgram;
};

export const updateMentorshipProgram = (id: string, updates: Partial<MentorshipProgram>) => {
  const index = mockMentorshipPrograms.findIndex(p => p.id === id);
  if (index !== -1) {
    mockMentorshipPrograms[index] = { ...mockMentorshipPrograms[index], ...updates };
    return mockMentorshipPrograms[index];
  }
  return null;
};

export const deleteMentorshipProgram = (id: string) => {
  const index = mockMentorshipPrograms.findIndex(p => p.id === id);
  if (index !== -1) {
    mockMentorshipPrograms.splice(index, 1);
    return true;
  }
  return false;
};