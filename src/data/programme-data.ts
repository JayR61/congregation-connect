
import { Programme, ProgrammeKPI } from '@/types';

// PROGRAMMES
export const mockProgrammes: Programme[] = [
  {
    id: "programme-1",
    title: "Sunday Service",
    description: "Weekly worship service",
    startDate: new Date(2023, 0, 1),
    endDate: null,
    location: "Main Sanctuary",
    category: "worship",  // Changed back to string as per the expected type
    tags: ["sunday", "service"],
    targetAudience: "Everyone",
    currentAttendees: 150,
    attendees: [],
    budget: 500,
    status: "ongoing",
    objectives: ["Worship", "Fellowship"],
    kpis: [],
    notes: "",
    name: "Sunday Service",
    type: "recurring",
    coordinator: "John Doe",
    capacity: 200,
    recurring: true,
    frequency: "weekly"
  }
];

// Additional mock data
export const mockProgrammeTags = [];
export const mockKpis: ProgrammeKPI[] = [];
export const mockReminders = [];
export const mockTemplates = [];

// Export directly for compatibility
export const programmes = mockProgrammes;
