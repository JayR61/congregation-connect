
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
  followers?: number;
  posts?: number;
  engagement?: number;
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt?: Date;
  status: 'active' | 'inactive' | 'archived';
  notes?: string;
  handle?: string;
  responsible?: string;
}
