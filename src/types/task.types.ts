
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'pending' | 'open' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assigneeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  categoryId?: string;
  tags?: string[];
  attachments?: string[];
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  comments?: TaskComment[];
  parentTaskId?: string;
  subtasks?: Task[];
  programmeId?: string;
  effort?: number;
  assigneeIds?: string[]; // For multiple assignees
  createdById?: string;
  lastModifiedById?: string;
  lastModifiedAction?: string;
  categories?: TaskCategory[];
  category?: string[]; // Array of strings
  reporterId?: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'pending' | 'open' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: string[];
  userId?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}
