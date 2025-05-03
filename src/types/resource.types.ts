
export interface ChurchResource {
  id: string;
  name: string;
  type: string;
  description: string;
  location?: string;
  status: 'available' | 'in-use' | 'maintenance' | 'reserved';
  acquisitionDate?: Date;
  currentAssigneeId?: string;
  maintenanceSchedule?: Date;
  notes?: string;
  imageUrl?: string;
}

export interface ResourceBooking {
  id: string;
  resourceId: string;
  memberId: string;
  purpose: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'rejected';
  notes?: string;
}
