
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/lib/toast';

interface ChurchInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string | null;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  weeklyDigest: boolean;
}

interface SettingsContextType {
  churchInfo: ChurchInfo;
  updateChurchInfo: (info: Partial<ChurchInfo>) => void;
  uploadChurchLogo: (file: File) => Promise<void>;
  
  notificationSettings: NotificationSettings;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>(() => {
    const savedInfo = localStorage.getItem('churchInfo');
    if (savedInfo) {
      return JSON.parse(savedInfo);
    }
    return {
      name: 'Grace Community Church',
      address: '123 Main Street, Anytown, USA',
      phone: '(555) 123-4567',
      email: 'info@gracechurch.org',
      website: 'www.gracechurch.org',
      logo: null,
    };
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      emailNotifications: true,
      pushNotifications: true,
      taskReminders: true,
      eventReminders: true,
      weeklyDigest: false,
    };
  });

  const updateChurchInfo = (info: Partial<ChurchInfo>) => {
    setChurchInfo(prev => {
      const updated = { ...prev, ...info };
      localStorage.setItem('churchInfo', JSON.stringify(updated));
      return updated;
    });
    toast.success("Church information updated successfully");
  };

  const uploadChurchLogo = async (file: File): Promise<void> => {
    try {
      // In a real app, you would upload the file to a server
      // Here we'll just convert it to a data URL
      const reader = new FileReader();
      
      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      setChurchInfo(prev => {
        const updated = { ...prev, logo: result };
        localStorage.setItem('churchInfo', JSON.stringify(updated));
        return updated;
      });
      
      toast.success("Church logo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
      throw error;
    }
  };

  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('notificationSettings', JSON.stringify(updated));
      return updated;
    });
    toast.success(`${key} setting updated`);
  };

  return (
    <SettingsContext.Provider
      value={{
        churchInfo,
        updateChurchInfo,
        uploadChurchLogo,
        notificationSettings,
        updateNotificationSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
