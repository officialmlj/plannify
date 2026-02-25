"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/translations"

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("nl")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) {
      setLanguage(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const switchLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }))
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
            <button
              onClick={() => switchLanguage("nl")}
              className={`w-full px-4 py-2.5 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                language === "nl" ? "bg-muted font-medium" : ""
              }`}
            >
              <span className="text-lg">🇳🇱</span>
              <span>Nederlands</span>
            </button>
            <button
              onClick={() => switchLanguage("en")}
              className={`w-full px-4 py-2.5 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                language === "en" ? "bg-muted font-medium" : ""
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
