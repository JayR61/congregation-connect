
import { ChurchResource, ResourceBooking, AttendanceRecord, ResourceCategory, ResourceHealthLog, ResourceInventoryAlert } from '@/types';

// Mock resource and attendance data
export const mockResources: ChurchResource[] = [];

export const mockResourceCategories: ResourceCategory[] = [];

export const mockResourceBookings: ResourceBooking[] = [];

export const mockAttendance: AttendanceRecord[] = [];

export const mockHealthLogs: ResourceHealthLog[] = [];

export const mockInventoryAlerts: ResourceInventoryAlert[] = [];

// Export for compatibility
export const resources = mockResources;
export const resourceBookings = mockResourceBookings;
export const attendance = mockAttendance;
export const resourceCategories = mockResourceCategories;
export const healthLogs = mockHealthLogs;
export const inventoryAlerts = mockInventoryAlerts;
