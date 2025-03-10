
import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontSize = 'small' | 'medium' | 'large';
export type AccentColor = 'blue' | 'green' | 'purple' | 'red';
export type Language = 'en' | 'es' | 'fr';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  weeklyDigest: boolean;
}

interface AppearanceSettings {
  compactView: boolean;
  fontSize: FontSize;
  accentColor: AccentColor;
  language: Language;
}

interface ChurchInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

interface SettingsContextType {
  notifications: NotificationSettings;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  
  appearance: AppearanceSettings;
  updateAppearanceSetting: <K extends keyof AppearanceSettings>(
    key: K, 
    value: AppearanceSettings[K]
  ) => void;
  
  churchInfo: ChurchInfo;
  updateChurchInfo: <K extends keyof ChurchInfo>(
    key: K,
    value: ChurchInfo[K]
  ) => void;
  
  saveChurchInfo: () => void;
  saveNotificationSettings: () => void;
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  eventReminders: true,
  weeklyDigest: false,
};

const defaultAppearanceSettings: AppearanceSettings = {
  compactView: false,
  fontSize: 'medium',
  accentColor: 'blue',
  language: 'en',
};

const defaultChurchInfo: ChurchInfo = {
  name: 'Grace Community Church',
  address: '123 Main Street, Anytown, USA',
  phone: '(555) 123-4567',
  email: 'info@gracechurch.org',
  website: 'www.gracechurch.org',
  logo: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : defaultNotificationSettings;
  });
  
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : defaultAppearanceSettings;
  });
  
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>(() => {
    const saved = localStorage.getItem('churchInfo');
    return saved ? JSON.parse(saved) : defaultChurchInfo;
  });
  
  // Apply font size globally when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = appearance.fontSize === 'small' 
      ? '14px' 
      : appearance.fontSize === 'large' 
        ? '18px' 
        : '16px';
    
    // Apply compact view
    if (appearance.compactView) {
      root.classList.add('compact-view');
    } else {
      root.classList.remove('compact-view');
    }
    
    // Apply accent color
    root.style.setProperty('--accent-color', appearance.accentColor);
    
    // Save to localStorage
    localStorage.setItem('appearanceSettings', JSON.stringify(appearance));
  }, [appearance]);
  
  // Update notification setting
  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save notification settings
  const saveNotificationSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  };
  
  // Update appearance setting
  const updateAppearanceSetting = <K extends keyof AppearanceSettings>(
    key: K, 
    value: AppearanceSettings[K]
  ) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Update church info
  const updateChurchInfo = <K extends keyof ChurchInfo>(
    key: K,
    value: ChurchInfo[K]
  ) => {
    setChurchInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save church info
  const saveChurchInfo = () => {
    localStorage.setItem('churchInfo', JSON.stringify(churchInfo));
  };
  
  return (
    <SettingsContext.Provider 
      value={{
        notifications,
        updateNotificationSetting,
        saveNotificationSettings,
        appearance,
        updateAppearanceSetting,
        churchInfo,
        updateChurchInfo,
        saveChurchInfo
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
