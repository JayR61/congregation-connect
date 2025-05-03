
export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  programmeId?: string;
  isPresent?: boolean;
  eventId?: string;
}
