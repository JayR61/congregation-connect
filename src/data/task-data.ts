
import { Task, TaskCategory } from '@/types';

// TASKS - All values start at 0, users must add data
export const mockTasks: Task[] = [];

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
