
export interface AttendanceRecord {
  id: string;
  programmeId?: string;
  resourceId?: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
  createdAt: Date;
}
