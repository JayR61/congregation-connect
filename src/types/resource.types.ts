
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
  category?: string;
  healthStatus?: number; // 0-100%
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  inventoryCount?: number;
  minimumInventory?: number;
  qrCode?: string;
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
  approvedById?: string;
  approvedDate?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  feedback?: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface ResourceHealthLog {
  id: string;
  resourceId: string;
  date: Date;
  status: number; // 0-100%
  notes: string;
  createdBy: string;
}

export interface ResourceInventoryAlert {
  id: string;
  resourceId: string;
  type: 'low-inventory' | 'maintenance-needed' | 'overdue';
  message: string;
  date: Date;
  isResolved: boolean;
  resolvedDate?: Date;
}
