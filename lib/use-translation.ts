"use client"

import { useState, useEffect } from "react"
import { translations, type Language } from "./translations"

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("nl")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) {
      setLanguage(saved)
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail)
    }

    window.addEventListener("languageChange", handleLanguageChange as EventListener)
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange as EventListener)
    }
  }, [])

  const t = (key: keyof typeof translations.nl) => {
    return translations[language][key]
  }

  return {
    t,
    language,
  }
}
