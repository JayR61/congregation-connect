
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type AccentColor = 'blue' | 'green' | 'purple' | 'red';
type Language = 'en' | 'es' | 'fr';

interface AppearanceSettings {
  theme: Theme;
  compactView: boolean;
  fontSize: FontSize;
  accentColor: AccentColor;
  language: Language;
}

interface ThemeContextType {
  theme: Theme;
  compactView: boolean;
  fontSize: FontSize;
  accentColor: AccentColor;
  language: Language;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setCompactView: (compact: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setAccentColor: (color: AccentColor) => void;
  setLanguage: (lang: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      theme: 'light',
      compactView: false,
      fontSize: 'medium',
      accentColor: 'blue',
      language: 'en'
    };
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
    
    // Apply font size
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    root.classList.add(`text-size-${settings.fontSize}`);
    
    // Apply compact view
    if (settings.compactView) {
      root.classList.add('compact-view');
    } else {
      root.classList.remove('compact-view');
    }
    
    // Apply accent color
    root.style.setProperty('--custom-accent-color', getAccentColorValue(settings.accentColor));
    
    // Apply language to HTML lang attribute
    root.setAttribute('lang', settings.language);
    
    // Save settings to localStorage
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
  }, [settings]);

  const getAccentColorValue = (color: AccentColor): string => {
    switch (color) {
      case 'blue': return 'hsl(210, 80%, 56%)';
      case 'green': return 'hsl(142, 76%, 36%)';
      case 'purple': return 'hsl(280, 67%, 55%)';
      case 'red': return 'hsl(0, 84%, 60%)';
      default: return 'hsl(210, 80%, 56%)';
    }
  };

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const toggleTheme = () => {
    setSettings(prev => ({ 
      ...prev, 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };

  const setCompactView = (compactView: boolean) => {
    setSettings(prev => ({ ...prev, compactView }));
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const setAccentColor = (accentColor: AccentColor) => {
    setSettings(prev => ({ ...prev, accentColor }));
  };

  const setLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: settings.theme,
      compactView: settings.compactView,
      fontSize: settings.fontSize,
      accentColor: settings.accentColor,
      language: settings.language,
      setTheme,
      toggleTheme,
      setCompactView,
      setFontSize,
      setAccentColor,
      setLanguage
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
