"use client";

import { useLanguage } from "@/contexts/LanguageContext";

type Translations<T> = {
  en: T;
  id: T;
};

export function useTranslation<T extends Record<string, string>>(
  translations: Translations<T>
) {
  const { lang } = useLanguage();
  return translations[lang];
}
