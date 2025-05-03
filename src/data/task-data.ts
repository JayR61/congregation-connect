
import { Task, TaskCategory } from '@/types';

// TASKS
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Plan Sunday Service",
    description: "Coordinate with worship team",
    status: "in-progress",
    priority: "high",
    category: ["service"],  // Using string array instead of string
    assigneeId: "member-1",
    reporterId: "member-2",
    dueDate: new Date(2023, 5, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "member-2",
    comments: [],
    assigneeIds: ["member-1"],
    categories: [],
    createdById: "member-2",
    lastModifiedById: "member-2", 
    lastModifiedAction: "created"
  }
];

// TASK CATEGORIES
export const mockTaskCategories: TaskCategory[] = [
  {
    id: "category-1",
    name: "Service",
    description: "Sunday service related tasks",
    color: "#ff5722"
  },
  {
    id: "category-2",
    name: "Administration",
    description: "Administrative tasks",
    color: "#2196f3"
  },
  {
    id: "category-3",
    name: "Outreach",
    description: "Community outreach activities",
    color: "#4caf50"
  }
];

// Getter functions
export const getTasks = () => mockTasks;

// Export directly for compatibility
export const tasks = mockTasks;
