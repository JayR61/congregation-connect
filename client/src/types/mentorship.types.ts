
export interface MentorshipProgram {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  mentors: string[];
  mentees: string[];
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  goals?: string[];
  sessions?: MentorshipSession[];
  resources?: string[];
  notes?: string;
  menteeId?: string;
  title?: string;
  mentorId?: string;
  progress?: number;
}

export interface MentorshipSession {
  id: string;
  programId: string;
  date: Date;
  duration: number;
  title: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  attendees: string[];
}
