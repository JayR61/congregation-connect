
export interface Programme {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  location?: string;
  organizer?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'active';
  capacity?: number;
  attendees?: string[];
  category?: string;
  tags?: string[];
  kpis?: ProgrammeKPI[];
  resourceIds?: string[];
  feedback?: ProgrammeFeedback[];
  recurrence?: string;
  reminders?: {
    id: string;
    date: Date;
    sent: boolean;
  }[];
  image?: string;
  title?: string;
  type?: string;
  targetAudience?: string;
  budget?: number;
  objectives?: string[];
  notes?: string;
  coordinator?: string;
  recurring?: boolean;
  frequency?: string;
  currentAttendees?: number;
}

export interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date | string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  isPresent?: boolean;
}

export interface BulkAttendanceRecord {
  programmeId: string;
  date: Date;
  records: {
    memberId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }[];
  attendees?: {
    memberId: string;
    isPresent: boolean;
    notes: string;
  }[];
}

export interface ProgrammeCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface ProgrammeTag {
  id: string;
  name: string;
  color?: string;
}

export interface ProgrammeFeedback {
  id: string;
  programmeId: string;
  memberId: string;
  rating: number;
  comments?: string;
  date: Date;
  anonymous?: boolean;
  comment?: string;
  suggestions?: string;
  wouldRecommend?: boolean;
  submittedAt?: Date;
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  name: string;
  target: number;
  actual?: number;
  unit: string;
  notes?: string;
  title?: string;
  current?: number;
  description?: string;
  createdAt?: Date;
}

export interface ProgrammeTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity?: number;
  categoryId?: string;
  tags?: string[];
  defaultResourceIds?: string[];
  notes?: string;
  title?: string;
  type?: string;
  content?: string;
  category?: string;
  resources?: string[];
  createdById?: string;
}

export interface ProgrammeResource {
  id: string;
  programmeId: string;
  name: string;
  type: string;
  quantity: number;
  status: 'available' | 'unavailable' | 'allocated';
  notes?: string;
}

export interface ProgrammeReminder {
  id: string;
  programmeId: string;
  date: Date;
  message: string;
  recipientIds?: string[];
  sent: boolean;
  sentDate?: Date;
  createdBy?: string;
  schedule?: 'day_before' | 'hour_before' | 'week_before' | 'custom';
  customTime?: Date;
  status?: 'scheduled' | 'sent' | 'failed';
  type?: 'email' | 'push' | 'sms';
  title?: string;
  scheduledFor?: Date;
  targetAudience?: 'all' | 'registered' | 'waitlist';
  recipients?: string[];
}

export interface ProgrammeStatistics {
  totalProgrammes: number;
  activeProgrammes: number;
  completedProgrammes: number;
  totalParticipants: number;
  attendanceRate: number;
  programmesByType: Record<string, number>;
  participantsTrend: { month: string; count: number }[];
}
