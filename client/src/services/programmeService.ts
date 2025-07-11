
import { Programme, ProgrammeAttendance, ProgrammeTemplate, ProgrammeCategory, ProgrammeTag } from '@/types';
import { format, subMonths } from 'date-fns';

// Define types for missing interfaces
export interface ProgrammeResource {
  id: string;
  programmeId: string;
  name: string;
  type: string;
  quantity: number;
  status: 'available' | 'unavailable' | 'allocated';
  notes?: string;
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
}

export interface ProgrammeReminder {
  id: string;
  programmeId: string;
  date: Date;
  message: string;
  recipientIds?: string[];
  sent: boolean;
  sentDate?: Date;
  status?: 'scheduled' | 'sent' | 'failed';
}

export interface ProgrammeKPI {
  id: string;
  programmeId: string;
  name: string;
  target: number;
  actual?: number;
  unit: string;
  description?: string;
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

// Helper function to generate local storage keys
const getStorageKey = (key: string) => `church_app_${key}`;

// Local storage service functions for Programmes
export const getProgrammes = (): Programme[] => {
  try {
    const storedProgrammes = localStorage.getItem(getStorageKey('programmes'));
    return storedProgrammes ? JSON.parse(storedProgrammes) : [];
  } catch (error) {
    console.error('Error retrieving programmes from local storage', error);
    return [];
  }
};

export const saveProgrammes = (programmes: Programme[]): void => {
  try {
    localStorage.setItem(getStorageKey('programmes'), JSON.stringify(programmes));
  } catch (error) {
    console.error('Error saving programmes to local storage', error);
  }
};

// Local storage service functions for Attendance
export const getAttendance = (): ProgrammeAttendance[] => {
  try {
    const storedAttendance = localStorage.getItem(getStorageKey('attendance'));
    return storedAttendance ? JSON.parse(storedAttendance) : [];
  } catch (error) {
    console.error('Error retrieving attendance from local storage', error);
    return [];
  }
};

export const saveAttendance = (attendance: ProgrammeAttendance[]): void => {
  try {
    localStorage.setItem(getStorageKey('attendance'), JSON.stringify(attendance));
  } catch (error) {
    console.error('Error saving attendance to local storage', error);
  }
};

// Local storage service functions for Resources
export const getResources = (): ProgrammeResource[] => {
  try {
    const storedResources = localStorage.getItem(getStorageKey('resources'));
    return storedResources ? JSON.parse(storedResources) : [];
  } catch (error) {
    console.error('Error retrieving resources from local storage', error);
    return [];
  }
};

export const saveResources = (resources: ProgrammeResource[]): void => {
  try {
    localStorage.setItem(getStorageKey('resources'), JSON.stringify(resources));
  } catch (error) {
    console.error('Error saving resources to local storage', error);
  }
};

// Local storage service functions for Feedback
export const getFeedback = (): ProgrammeFeedback[] => {
  try {
    const storedFeedback = localStorage.getItem(getStorageKey('feedback'));
    return storedFeedback ? JSON.parse(storedFeedback) : [];
  } catch (error) {
    console.error('Error retrieving feedback from local storage', error);
    return [];
  }
};

export const saveFeedback = (feedback: ProgrammeFeedback[]): void => {
  try {
    localStorage.setItem(getStorageKey('feedback'), JSON.stringify(feedback));
  } catch (error) {
    console.error('Error saving feedback to local storage', error);
  }
};

// Local storage service functions for Reminders
export const getReminders = (): ProgrammeReminder[] => {
  try {
    const storedReminders = localStorage.getItem(getStorageKey('reminders'));
    return storedReminders ? JSON.parse(storedReminders) : [];
  } catch (error) {
    console.error('Error retrieving reminders from local storage', error);
    return [];
  }
};

export const saveReminders = (reminders: ProgrammeReminder[]): void => {
  try {
    localStorage.setItem(getStorageKey('reminders'), JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders to local storage', error);
  }
};

// Local storage service functions for KPIs
export const getKPIs = (): ProgrammeKPI[] => {
  try {
    const storedKPIs = localStorage.getItem(getStorageKey('kpis'));
    return storedKPIs ? JSON.parse(storedKPIs) : [];
  } catch (error) {
    console.error('Error retrieving KPIs from local storage', error);
    return [];
  }
};

export const saveKPIs = (kpis: ProgrammeKPI[]): void => {
  try {
    localStorage.setItem(getStorageKey('kpis'), JSON.stringify(kpis));
  } catch (error) {
    console.error('Error saving KPIs to local storage', error);
  }
};

// Local storage service functions for Templates
export const getTemplates = (): ProgrammeTemplate[] => {
  try {
    const storedTemplates = localStorage.getItem(getStorageKey('templates'));
    return storedTemplates ? JSON.parse(storedTemplates) : [];
  } catch (error) {
    console.error('Error retrieving templates from local storage', error);
    return [];
  }
};

export const saveTemplates = (templates: ProgrammeTemplate[]): void => {
  try {
    localStorage.setItem(getStorageKey('templates'), JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates to local storage', error);
  }
};

// Local storage service functions for Categories
export const getCategories = (): ProgrammeCategory[] => {
  try {
    const storedCategories = localStorage.getItem(getStorageKey('categories'));
    return storedCategories ? JSON.parse(storedCategories) : [];
  } catch (error) {
    console.error('Error retrieving categories from local storage', error);
    return [];
  }
};

export const saveCategories = (categories: ProgrammeCategory[]): void => {
  try {
    localStorage.setItem(getStorageKey('categories'), JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to local storage', error);
  }
};

// Local storage service functions for Tags
export const getTags = (): ProgrammeTag[] => {
  try {
    const storedTags = localStorage.getItem(getStorageKey('tags'));
    return storedTags ? JSON.parse(storedTags) : [];
  } catch (error) {
    console.error('Error retrieving tags from local storage', error);
    return [];
  }
};

export const saveTags = (tags: ProgrammeTag[]): void => {
  try {
    localStorage.setItem(getStorageKey('tags'), JSON.stringify(tags));
  } catch (error) {
    console.error('Error saving tags to local storage', error);
  }
};

// Local storage service functions for Programme Tags
export const getProgrammeTags = (): { programmeId: string; tagId: string }[] => {
  try {
    const storedProgrammeTags = localStorage.getItem(getStorageKey('programmeTags'));
    return storedProgrammeTags ? JSON.parse(storedProgrammeTags) : [];
  } catch (error) {
    console.error('Error retrieving programme tags from local storage', error);
    return [];
  }
};

export const saveProgrammeTags = (programmeTags: { programmeId: string; tagId: string }[]): void => {
  try {
    localStorage.setItem(getStorageKey('programmeTags'), JSON.stringify(programmeTags));
  } catch (error) {
    console.error('Error saving programme tags to local storage', error);
  }
};

// Utility function to calculate programme statistics
export const calculateProgrammeStatistics = (
  programmes: Programme[],
  attendance: ProgrammeAttendance[]
): ProgrammeStatistics => {
  // Calculate total programmes
  const totalProgrammes = programmes.length;
  
  // Count active and completed programmes
  const activeProgrammes = programmes.filter(p => 
    p.status === 'active' || p.status === 'ongoing' || p.status === 'upcoming'
  ).length;
  
  const completedProgrammes = programmes.filter(p => 
    p.status === 'completed'
  ).length;
  
  // Calculate total participants
  const totalParticipants = programmes.reduce((sum, programme) => 
    sum + (programme.attendees?.length || 0), 0
  );
  
  // Calculate attendance rate
  const presentRecords = attendance.filter(a => a.isPresent).length;
  const attendanceRate = attendance.length > 0 
    ? (presentRecords / attendance.length) * 100 
    : 0;
  
  // Calculate programmes by type
  const programmesByType = programmes.reduce((acc, programme) => {
    const type = programme.type || 'Undefined';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate participants trend (last 6 months)
  const participantsTrend = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const month = format(date, 'MMM yyyy');
    
    // Count participants for this month
    const monthAttendance = attendance.filter(a => {
      const attendanceDate = new Date(a.date);
      return format(attendanceDate, 'MMM yyyy') === month && a.isPresent;
    });
    
    return {
      month,
      count: monthAttendance.length
    };
  }).reverse();
  
  return {
    totalProgrammes,
    activeProgrammes,
    completedProgrammes,
    totalParticipants,
    attendanceRate,
    programmesByType,
    participantsTrend
  };
};
