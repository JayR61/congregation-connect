
import { User, Notification } from '@/types';

export const mockCurrentUser: User = {
  id: "user-1",
  email: "admin@churchapp.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  active: true,
  createdAt: new Date()
};

export const mockNotifications: Notification[] = [];
