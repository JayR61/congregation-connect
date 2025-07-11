
import { Notification } from '@/types';

interface UseNotificationActionsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export const useNotificationActions = ({
  notifications,
  setNotifications
}: UseNotificationActionsProps) => {
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const updateNotification = (id: string, update: Partial<Notification>) => {
    let found = false;
    setNotifications(prev => 
      prev.map(n => {
        if (n.id === id) {
          found = true;
          return { ...n, ...update };
        }
        return n;
      })
    );
    return found;
  };
  
  const deleteNotification = (id: string) => {
    let found = false;
    setNotifications(prev => {
      const filtered = prev.filter(n => {
        if (n.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    return found;
  };

  const markNotificationAsRead = (id: string) => {
    return updateNotification(id, { read: true });
  };

  return {
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead
  };
};
