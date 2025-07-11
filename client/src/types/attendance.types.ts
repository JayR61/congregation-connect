
export interface AttendanceRecord {
  id: string;
  programmeId?: string;
  resourceId?: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  status?: 'present' | 'absent'; // Add status field for backward compatibility
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  createdAt: Date;
  eventId?: string; // Add eventId field for AttendanceTracker component
}
