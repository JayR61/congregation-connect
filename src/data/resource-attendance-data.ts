
import { ChurchResource, ResourceBooking, AttendanceRecord, ResourceCategory, ResourceHealthLog, ResourceInventoryAlert } from '@/types';

// Mock resource and attendance data
export const mockResources: ChurchResource[] = [
  {
    id: 'res-1',
    name: 'Main Sanctuary',
    type: 'room',
    description: 'Main church sanctuary for services',
    location: 'Main Building, 1st Floor',
    status: 'available',
    acquisitionDate: new Date('2000-01-01'),
    imageUrl: 'https://source.unsplash.com/photo-1518770660439-4636190af475',
    category: 'facilities',
    healthStatus: 95,
    lastMaintenanceDate: new Date('2023-01-15'),
    nextMaintenanceDate: new Date('2023-07-15'),
    purchasePrice: 250000,
    currentValue: 220000,
    qrCode: 'res-1-qrcode'
  },
  {
    id: 'res-2',
    name: 'Projector',
    type: 'equipment',
    description: 'HD Projector for presentations',
    location: 'Media Room',
    status: 'in-use',
    currentAssigneeId: 'member-1',
    acquisitionDate: new Date('2021-03-15'),
    imageUrl: 'https://source.unsplash.com/photo-1488590528505-98d2b5aba04b',
    category: 'media',
    healthStatus: 85,
    lastMaintenanceDate: new Date('2023-02-10'),
    nextMaintenanceDate: new Date('2023-08-10'),
    purchasePrice: 1200,
    currentValue: 950,
    qrCode: 'res-2-qrcode'
  },
  {
    id: 'res-3',
    name: 'Church Van',
    type: 'vehicle',
    description: '15-passenger van for church activities',
    location: 'Church Parking Lot',
    status: 'maintenance',
    maintenanceSchedule: new Date('2023-07-30'),
    acquisitionDate: new Date('2018-06-10'),
    imageUrl: 'https://source.unsplash.com/photo-1605810230434-7631ac76ec81',
    category: 'transportation',
    healthStatus: 65,
    lastMaintenanceDate: new Date('2023-01-05'),
    nextMaintenanceDate: new Date('2023-07-05'),
    purchasePrice: 35000,
    currentValue: 22000,
    qrCode: 'res-3-qrcode'
  },
  {
    id: 'res-4',
    name: 'Conference Room',
    type: 'room',
    description: 'Meeting space for up to 20 people',
    location: 'Main Building, 2nd Floor',
    status: 'available',
    acquisitionDate: new Date('2005-03-15'),
    imageUrl: 'https://source.unsplash.com/photo-1461749280684-dccba630e2f6',
    category: 'facilities',
    healthStatus: 90,
    lastMaintenanceDate: new Date('2023-03-01'),
    nextMaintenanceDate: new Date('2023-09-01'),
    purchasePrice: 50000,
    currentValue: 45000,
    qrCode: 'res-4-qrcode'
  },
  {
    id: 'res-5',
    name: 'Sound System',
    type: 'equipment',
    description: 'Professional audio equipment for services',
    location: 'Main Sanctuary',
    status: 'available',
    acquisitionDate: new Date('2019-10-05'),
    imageUrl: 'https://source.unsplash.com/photo-1581091226825-a6a2a5aee158',
    category: 'media',
    healthStatus: 88,
    lastMaintenanceDate: new Date('2023-02-20'),
    nextMaintenanceDate: new Date('2023-08-20'),
    purchasePrice: 8500,
    currentValue: 6200,
    inventoryCount: 1,
    minimumInventory: 1,
    qrCode: 'res-5-qrcode'
  },
  {
    id: 'res-6',
    name: 'Bibles',
    type: 'item',
    description: 'Church bibles for congregational use',
    location: 'Storage Room',
    status: 'available',
    acquisitionDate: new Date('2021-01-10'),
    imageUrl: 'https://source.unsplash.com/photo-1504052434569-70ad5836ab65',
    category: 'literature',
    healthStatus: 95,
    purchasePrice: 1500,
    currentValue: 1200,
    inventoryCount: 45,
    minimumInventory: 30,
    qrCode: 'res-6-qrcode'
  }
];

export const mockResourceCategories: ResourceCategory[] = [
  { id: 'cat-1', name: 'Facilities', description: 'Church buildings and rooms', color: '#10b981' },
  { id: 'cat-2', name: 'Media', description: 'Audio/visual equipment', color: '#f59e0b' },
  { id: 'cat-3', name: 'Transportation', description: 'Church vehicles', color: '#3b82f6' },
  { id: 'cat-4', name: 'Literature', description: 'Books and written materials', color: '#8b5cf6' },
  { id: 'cat-5', name: 'Music', description: 'Musical instruments and equipment', color: '#ec4899' }
];

export const mockResourceBookings: ResourceBooking[] = [
  {
    id: 'book-1',
    resourceId: 'res-1',
    memberId: 'member-1',
    purpose: 'Youth Group Meeting',
    startDate: new Date('2023-07-15T18:00:00'),
    endDate: new Date('2023-07-15T20:00:00'),
    status: 'approved',
    approvedById: 'member-2',
    approvedDate: new Date('2023-07-10T14:30:00')
  },
  {
    id: 'book-2',
    resourceId: 'res-2',
    memberId: 'member-1',
    purpose: 'Board Presentation',
    startDate: new Date('2023-07-20T14:00:00'),
    endDate: new Date('2023-07-20T16:00:00'),
    status: 'pending'
  },
  {
    id: 'book-3',
    resourceId: 'res-1',
    memberId: 'member-2',
    purpose: 'Prayer Meeting',
    startDate: new Date('2023-07-25T19:00:00'),
    endDate: new Date('2023-07-25T21:00:00'),
    status: 'approved',
    approvedById: 'member-1',
    approvedDate: new Date('2023-07-20T10:15:00'),
    checkedInAt: new Date('2023-07-25T18:55:00'),
    checkedOutAt: new Date('2023-07-25T21:05:00')
  },
  {
    id: 'book-4',
    resourceId: 'res-4',
    memberId: 'member-1',
    purpose: 'Leadership Training',
    startDate: new Date('2023-07-22T09:00:00'),
    endDate: new Date('2023-07-22T16:00:00'),
    status: 'approved',
    approvedById: 'member-2',
    approvedDate: new Date('2023-07-18T11:20:00')
  },
  {
    id: 'book-5',
    resourceId: 'res-3',
    memberId: 'member-2',
    purpose: 'Youth Retreat Transportation',
    startDate: new Date('2023-08-05T07:00:00'),
    endDate: new Date('2023-08-07T19:00:00'),
    status: 'declined',
    notes: 'Vehicle scheduled for maintenance during this period'
  },
  {
    id: 'book-6',
    resourceId: 'res-5',
    memberId: 'member-1',
    purpose: 'Choir Practice',
    startDate: new Date('2023-07-28T18:00:00'),
    endDate: new Date('2023-07-28T20:00:00'),
    status: 'approved',
    approvedById: 'member-2',
    approvedDate: new Date('2023-07-25T09:45:00')
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    resourceId: 'res-1',
    memberId: 'member-1',
    date: new Date('2023-07-15'),
    isPresent: true,
    checkInTime: new Date('2023-07-15T18:00:00'),
    checkOutTime: new Date('2023-07-15T20:05:00'),
    notes: 'Used for youth group meeting',
    createdAt: new Date('2023-07-15T20:10:00')
  },
  {
    id: 'att-2',
    resourceId: 'res-4',
    memberId: 'member-2',
    date: new Date('2023-07-22'),
    isPresent: true,
    checkInTime: new Date('2023-07-22T08:45:00'),
    checkOutTime: new Date('2023-07-22T16:15:00'),
    notes: 'Leadership training all day',
    createdAt: new Date('2023-07-22T16:20:00')
  },
  {
    id: 'att-3',
    resourceId: 'res-5',
    memberId: 'member-1',
    date: new Date('2023-07-28'),
    isPresent: true,
    checkInTime: new Date('2023-07-28T17:55:00'),
    createdAt: new Date('2023-07-28T17:55:00')
  }
];

export const mockHealthLogs: ResourceHealthLog[] = [
  {
    id: 'health-1',
    resourceId: 'res-3',
    date: new Date('2023-07-01'),
    status: 75,
    notes: 'Regular inspection, found minor issues with brakes',
    createdBy: 'member-2'
  },
  {
    id: 'health-2',
    resourceId: 'res-3',
    date: new Date('2023-07-15'),
    status: 65,
    notes: 'Follow-up inspection, brake issues worsening, scheduled maintenance',
    createdBy: 'member-2'
  },
  {
    id: 'health-3',
    resourceId: 'res-2',
    date: new Date('2023-07-10'),
    status: 90,
    notes: 'Regular maintenance check, all systems functioning properly',
    createdBy: 'member-1'
  },
  {
    id: 'health-4',
    resourceId: 'res-2',
    date: new Date('2023-07-20'),
    status: 85,
    notes: 'Bulb showing signs of wear, may need replacement soon',
    createdBy: 'member-1'
  }
];

export const mockInventoryAlerts: ResourceInventoryAlert[] = [
  {
    id: 'alert-1',
    resourceId: 'res-6',
    type: 'low-inventory',
    message: 'Bibles inventory is below minimum threshold (28/30)',
    date: new Date('2023-07-20'),
    isResolved: false
  },
  {
    id: 'alert-2',
    resourceId: 'res-3',
    type: 'maintenance-needed',
    message: 'Church van is due for maintenance',
    date: new Date('2023-07-25'),
    isResolved: false
  },
  {
    id: 'alert-3',
    resourceId: 'res-5',
    type: 'overdue',
    message: 'Sound system maintenance is overdue by 5 days',
    date: new Date('2023-07-15'),
    isResolved: true,
    resolvedDate: new Date('2023-07-18')
  }
];

// Export for compatibility
export const resources = mockResources;
export const resourceBookings = mockResourceBookings;
export const attendance = mockAttendance;
export const resourceCategories = mockResourceCategories;
export const healthLogs = mockHealthLogs;
export const inventoryAlerts = mockInventoryAlerts;
