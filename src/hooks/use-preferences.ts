import { useEffect, useState } from "react";

import { COOKIE_KEYS, COOKIE_MAX_AGE } from "@/config/cookies";
import { getCookie, setCookie } from "@/lib/cookies";
import { clampBatchSize } from "@/lib/campaign";
import type { Language, Theme } from "@/types/campaign";

export function usePreferences() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = getCookie(COOKIE_KEYS.theme);
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "dark";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = getCookie(COOKIE_KEYS.language);
    return savedLanguage === "ar" || savedLanguage === "en" ? savedLanguage : "en";
  });

  const [batchSize, setBatchSize] = useState<number>(() =>
    clampBatchSize(Number(getCookie(COOKIE_KEYS.batchSize) ?? "2"))
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }, [theme, language]);

  useEffect(() => {
    setCookie(COOKIE_KEYS.theme, theme, COOKIE_MAX_AGE);
  }, [theme]);

  useEffect(() => {
    setCookie(COOKIE_KEYS.language, language, COOKIE_MAX_AGE);
  }, [language]);

  useEffect(() => {
    setCookie(COOKIE_KEYS.batchSize, String(batchSize), COOKIE_MAX_AGE);
  }, [batchSize]);

  return {
    theme,
    setTheme,
    language,
    setLanguage,
    batchSize,
    setBatchSize,
  };
}
