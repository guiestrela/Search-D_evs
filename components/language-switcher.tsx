"use client";


import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "preferred-language";

// Converts arbitrary language strings into one of the supported language codes.
const normalizeLanguage = (value: string | null): "en" | "pt" | null => {
  if (!value) {
    return null;
  }

  if (value.toLowerCase().startsWith("pt")) {
    return "pt";
  }

  if (value.toLowerCase().startsWith("en")) {
    return "en";
  }

  return null;
};

// Renders the language toggle and persists user preference in localStorage.
export function LanguageSwitcher() {
  const { i18n } = useTranslation("common");

  useEffect(() => {
    const savedLanguage = normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
    const browserLanguage = normalizeLanguage(window.navigator.language);
    const selectedLanguage = savedLanguage ?? browserLanguage ?? "en";

    void i18n.changeLanguage(selectedLanguage);
    document.documentElement.lang = selectedLanguage;
  }, [i18n]);

  // Applies the selected language immediately and persists it for future sessions.
  const onChangeLanguage = (language: "pt" | "en") => {
    window.localStorage.setItem(STORAGE_KEY, language);
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  };

  const activeLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? "en";

  return (
    <div className="language-switcher" role="group" aria-label="Language switcher">
      <button
        type="button"
        onClick={() => onChangeLanguage("pt")}
        className={activeLanguage === "pt" ? "language-switcher-btn active" : "language-switcher-btn"}
        aria-pressed={activeLanguage === "pt"}
      >
        PT
      </button>
      <button
        type="button"
        onClick={() => onChangeLanguage("en")}
        className={activeLanguage === "en" ? "language-switcher-btn active" : "language-switcher-btn"}
        aria-pressed={activeLanguage === "en"}
      >
        EN
      </button>
    </div>
  );
}
