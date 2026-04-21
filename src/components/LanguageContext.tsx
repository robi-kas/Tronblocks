
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../lib/translations';

type Language = 'en' | 'zh';

interface LanguageContextType {
  lang: Language;
  t: typeof translations.en;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'zh' : 'en'));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
