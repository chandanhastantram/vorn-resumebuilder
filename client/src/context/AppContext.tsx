import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, TemplateId, APIKeyConfig, AppSettings } from '../types/resume';
import { loadSettings, saveSettings } from '../services/storage';

interface AppContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  template: TemplateId;
  setTemplate: (t: TemplateId) => void;
  apiKeyConfig: APIKeyConfig | null;
  setApiKeyConfig: (config: APIKeyConfig | null) => void;
  aiUsageCount: number;
  incrementAIUsage: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  template: 'modern',
  apiKeyConfig: null,
  aiUsageCount: 0,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    return loadSettings() ?? DEFAULT_SETTINGS;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettings(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
  };

  const setTemplate = (template: TemplateId) => {
    setSettings(s => ({ ...s, template }));
  };

  const setApiKeyConfig = (apiKeyConfig: APIKeyConfig | null) => {
    setSettings(s => ({ ...s, apiKeyConfig }));
  };

  const incrementAIUsage = () => {
    setSettings(s => ({ ...s, aiUsageCount: s.aiUsageCount + 1 }));
  };

  return (
    <AppContext.Provider value={{
      theme: settings.theme,
      toggleTheme,
      template: settings.template,
      setTemplate,
      apiKeyConfig: settings.apiKeyConfig,
      setApiKeyConfig,
      aiUsageCount: settings.aiUsageCount,
      incrementAIUsage,
      isSettingsOpen,
      setIsSettingsOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
