
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
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, read: true } 
          : n
      )
    );
  };

  return {
    addNotification,
    markNotificationAsRead
  };
};
