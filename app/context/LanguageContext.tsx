'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKey } from '../locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise default to 'en'
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
    setIsInitialized(true);
  }, []);

  // Update localStorage and HTML dir attribute when language changes
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('language', language);
    
    // Handle RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  /**
   * Optimized t() function with fallback and variable replacement.
   * Fallback strategy: Current Language -> English -> Key String
   */
  const t = useCallback((key: TranslationKey, variables?: Record<string, string | number>): string => {
    // 1. Try current language
    let text = (translations[language] as any)[key];

    // 2. Fallback to English if missing or empty
    if (!text && language !== 'en') {
      text = (translations['en'] as any)[key];
    }

    // 3. Fallback to key itself if still missing
    if (!text) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: "${key}" for language: "${language}"`);
      }
      return key;
    }

    // 4. Replace variables {varName}
    if (variables) {
      Object.entries(variables).forEach(([vKey, vValue]) => {
        text = text.replace(new RegExp(`{${vKey}}`, 'g'), String(vValue));
      });
    }

    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};