import { Programme, ProgrammeAttendance, ProgrammeResource, ProgrammeFeedback, 
  ProgrammeReminder, ProgrammeKPI, ProgrammeTemplate, ProgrammeCategory, 
  ProgrammeTag, Member } from "@/types";
import { format, addDays, addHours, addWeeks } from "date-fns";

// Local storage keys
const STORAGE_KEYS = {
  PROGRAMMES: 'church_programmes',
  ATTENDANCE: 'programme_attendance',
  RESOURCES: 'programme_resources',
  FEEDBACK: 'programme_feedback',
  REMINDERS: 'programme_reminders',
  KPIS: 'programme_kpis',
  TEMPLATES: 'programme_templates',
  CATEGORIES: 'programme_categories',
  TAGS: 'programme_tags',
  PROGRAMME_TAGS: 'programme_to_tags'
};

// Helper function to get items from localStorage
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
};

// Helper function to save items to localStorage
export const saveStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Programme CRUD operations
export const getProgrammes = (): Programme[] => 
  getStorageItem<Programme[]>(STORAGE_KEYS.PROGRAMMES, []);

export const saveProgrammes = (programmes: Programme[]): void => 
  saveStorageItem(STORAGE_KEYS.PROGRAMMES, programmes);

// Attendance operations
export const getAttendance = (): ProgrammeAttendance[] => 
  getStorageItem<ProgrammeAttendance[]>(STORAGE_KEYS.ATTENDANCE, []);

export const saveAttendance = (attendance: ProgrammeAttendance[]): void => 
  saveStorageItem(STORAGE_KEYS.ATTENDANCE, attendance);

// Resources operations
export const getResources = (): ProgrammeResource[] => 
  getStorageItem<ProgrammeResource[]>(STORAGE_KEYS.RESOURCES, []);

export const saveResources = (resources: ProgrammeResource[]): void => 
  saveStorageItem(STORAGE_KEYS.RESOURCES, resources);

// Feedback operations
export const getFeedback = (): ProgrammeFeedback[] => 
  getStorageItem<ProgrammeFeedback[]>(STORAGE_KEYS.FEEDBACK, []);

export const saveFeedback = (feedback: ProgrammeFeedback[]): void => 
  saveStorageItem(STORAGE_KEYS.FEEDBACK, feedback);

// Reminders operations
export const getReminders = (): ProgrammeReminder[] => 
  getStorageItem<ProgrammeReminder[]>(STORAGE_KEYS.REMINDERS, []);

export const saveReminders = (reminders: ProgrammeReminder[]): void => 
  saveStorageItem(STORAGE_KEYS.REMINDERS, reminders);

// KPIs operations
export const getKPIs = (): ProgrammeKPI[] => 
  getStorageItem<ProgrammeKPI[]>(STORAGE_KEYS.KPIS, []);

export const saveKPIs = (kpis: ProgrammeKPI[]): void => 
  saveStorageItem(STORAGE_KEYS.KPIS, kpis);

// Templates operations
export const getTemplates = (): ProgrammeTemplate[] => 
  getStorageItem<ProgrammeTemplate[]>(STORAGE_KEYS.TEMPLATES, []);

export const saveTemplates = (templates: ProgrammeTemplate[]): void => 
  saveStorageItem(STORAGE_KEYS.TEMPLATES, templates);

// Categories operations
export const getCategories = (): ProgrammeCategory[] => 
  getStorageItem<ProgrammeCategory[]>(STORAGE_KEYS.CATEGORIES, []);

export const saveCategories = (categories: ProgrammeCategory[]): void => 
  saveStorageItem(STORAGE_KEYS.CATEGORIES, categories);

// Tags operations
export const getTags = (): ProgrammeTag[] => 
  getStorageItem<ProgrammeTag[]>(STORAGE_KEYS.TAGS, []);

export const saveTags = (tags: ProgrammeTag[]): void => 
  saveStorageItem(STORAGE_KEYS.TAGS, tags);

// Programme-Tags relationships
export const getProgrammeTags = (): { programmeId: string; tagId: string }[] => 
  getStorageItem<{ programmeId: string; tagId: string }[]>(STORAGE_KEYS.PROGRAMME_TAGS, []);

export const saveProgrammeTags = (programmeTags: { programmeId: string; tagId: string }[]): void => 
  saveStorageItem(STORAGE_KEYS.PROGRAMME_TAGS, programmeTags);

// PDF generation
export const generateProgrammePDF = (programme: Programme, members: Member[], attendance: ProgrammeAttendance[]): string => {
  // This would normally use a library like jsPDF to generate a PDF,
  // but for this implementation we'll just return a data URL
  
  // In a real implementation, this code would create a PDF with full formatting
  const dataUrl = `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKErlctGHsLhcFIxrARvEBokKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDEgMCBSCj4+Cj4+Ci9Db250ZW50cyA1IDAgUgovUGFyZW50IDIgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Cj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoxIDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLVJvbWFuCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgovTWFya0luZm8gMwowIFIKPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDI1OSAwMDAwMCBuIAowMDAwMDAwMjAwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDA3OCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAzMjcgMDAwMDAgbgogdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDYgMCBSCj4+CnN0YXJ0eHJlZgozOTAKJSVFT0YK`;
  
  return dataUrl;
};

// Email/notification reminders
export const scheduleReminder = (reminder: Omit<ProgrammeReminder, 'id' | 'sentAt' | 'status'>): ProgrammeReminder => {
  const newReminder: ProgrammeReminder = {
    id: `reminder-${Date.now()}`,
    ...reminder,
    sentAt: undefined,
    status: 'scheduled'
  };
  
  const reminders = getReminders();
  saveReminders([...reminders, newReminder]);
  
  return newReminder;
};

// In a real app, this would be called by a server-side process or cron job
export const processReminders = () => {
  const reminders = getReminders();
  const programmes = getProgrammes();
  
  const now = new Date();
  const updatedReminders = reminders.map(reminder => {
    if (reminder.status !== 'scheduled') return reminder;
    
    const programme = programmes.find(p => p.id === reminder.programmeId);
    if (!programme) return { ...reminder, status: 'failed' as const };
    
    let shouldSendNow = false;
    
    if (reminder.schedule === 'custom' && reminder.customTime) {
      shouldSendNow = new Date(reminder.customTime) <= now;
    } else if (programme.startDate) {
      const programmeDate = new Date(programme.startDate);
      
      switch (reminder.schedule) {
        case 'day_before':
          shouldSendNow = addDays(now, 1).getTime() >= programmeDate.getTime();
          break;
        case 'hour_before':
          shouldSendNow = addHours(now, 1).getTime() >= programmeDate.getTime();
          break;
        case 'week_before':
          shouldSendNow = addWeeks(now, 1).getTime() >= programmeDate.getTime();
          break;
      }
    }
    
    if (shouldSendNow) {
      // In a real app, this would send an actual email or notification
      console.log(`Sending reminder for programme: ${programme.name}`);
      return { ...reminder, sentAt: now, status: 'sent' as const };
    }
    
    return reminder;
  });
  
  saveReminders(updatedReminders);
  return updatedReminders.filter(r => r.status === 'sent' && r.sentAt && r.sentAt.getTime() >= now.getTime() - 60000);
};

// Export services for calendar
export const exportToICS = (programme: Programme): string => {
  const startDate = format(new Date(programme.startDate), "yyyyMMdd'T'HHmmss");
  const endDate = programme.endDate 
    ? format(new Date(programme.endDate), "yyyyMMdd'T'HHmmss")
    : format(addHours(new Date(programme.startDate), 1), "yyyyMMdd'T'HHmmss");
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Church Management//Programme Calendar//EN',
    'BEGIN:VEVENT',
    `UID:${programme.id}`,
    `DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${programme.name}`,
    `DESCRIPTION:${programme.description}`,
    `LOCATION:${programme.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
};

// Calculate statistics
export const calculateProgrammeStatistics = (
  programmes: Programme[], 
  attendance: ProgrammeAttendance[]
): ProgrammeStatistics => {
  const now = new Date();
  const activeProgrammes = programmes.filter(p => !p.endDate || new Date(p.endDate) >= now);
  const completedProgrammes = programmes.filter(p => p.endDate && new Date(p.endDate) < now);
  
  // Calculate attendance rate
  const totalAttendanceRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.isPresent).length;
  const attendanceRate = totalAttendanceRecords > 0 
    ? (presentRecords / totalAttendanceRecords) * 100 
    : 0;
  
  // Group programmes by type
  const programmesByType = programmes.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Create a trend of participants over the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const months: Record<string, number> = {};
  
  // Initialize the last 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = format(date, 'MMM yyyy');
    months[monthName] = 0;
  }
  
  // Count attendees per month
  attendance
    .filter(a => new Date(a.date) >= sixMonthsAgo && a.isPresent)
    .forEach(record => {
      const monthName = format(new Date(record.date), 'MMM yyyy');
      if (months[monthName] !== undefined) {
        months[monthName]++;
      }
    });
  
  // Convert to array and sort chronologically
  const participantsTrend = Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .reverse();
  
  return {
    totalProgrammes: programmes.length,
    activeProgrammes: activeProgrammes.length,
    completedProgrammes: completedProgrammes.length,
    totalParticipants: programmes.reduce((acc, curr) => acc + curr.currentAttendees, 0),
    attendanceRate,
    programmesByType,
    participantsTrend
  };
};
