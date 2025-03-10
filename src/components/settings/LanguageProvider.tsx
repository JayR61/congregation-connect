
import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appearance } = useSettings();
  
  useEffect(() => {
    // Set the lang attribute on the html element
    document.documentElement.lang = appearance.language;
    
    // You could also load language-specific resources here
    // For a real app, you'd use i18n libraries like react-i18next
  }, [appearance.language]);
  
  return <>{children}</>;
};
