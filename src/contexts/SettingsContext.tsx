import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'th' | 'en';

interface SettingsContextType {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playPop: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  t: (thText: string, enText: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('th');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const playPop = () => {
    if (!soundEnabled) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const t = (thText: string, enText: string) => {
    return language === 'en' ? enText : thText;
  };

  // Dynamic Theme Injection
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const styleId = 'dynamic-theme-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      html.dark {
        color-scheme: dark;
      }
      html.dark body {
        background-color: #111827 !important;
        color: #f9fafb !important;
      }
      html.dark .bg-white { background-color: #1f2937 !important; }
      html.dark .text-gray-900 { color: #f9fafb !important; }
      html.dark .text-gray-800 { color: #f3f4f6 !important; }
      html.dark .text-gray-700 { color: #e5e7eb !important; }
      html.dark .text-gray-600 { color: #d1d5db !important; }
      html.dark .text-gray-500 { color: #9ca3af !important; }
      html.dark .bg-gray-50 { background-color: #111827 !important; }
      html.dark .bg-gray-100 { background-color: #374151 !important; }
      html.dark .bg-gray-200 { background-color: #4b5563 !important; }
      html.dark .border-gray-100 { border-color: #374151 !important; }
      html.dark .border-gray-200 { border-color: #4b5563 !important; }
      html.dark .border-gray-300 { border-color: #6b7280 !important; }
      html.dark .bg-\\[\\#e3e3e4\\] { background-color: #030712 !important; }
      html.dark .bg-\\[\\#397d54\\] { background-color: #2c5f3f !important; }
      html.dark .hover\\:bg-\\[\\#2c5f3f\\]:hover { background-color: #1f422c !important; }
    `;
  }, [isDarkMode]);

  return (
    <SettingsContext.Provider value={{
      isDarkMode, setIsDarkMode,
      language, setLanguage,
      soundEnabled, setSoundEnabled,
      playPop,
      isSettingsOpen, setIsSettingsOpen,
      t
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
