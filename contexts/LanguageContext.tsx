"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "id";

type LanguageContextType = {
  lang: Language;
  switchLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("yameiya-language") as Language | null;
    if (saved) setLang(saved);
  }, []);

  const switchLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("yameiya-language", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
