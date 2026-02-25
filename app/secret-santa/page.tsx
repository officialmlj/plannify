"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gift, Sparkles, Star } from "lucide-react"
import { SecretSanta } from "@/components/secret-santa"
import { useTranslation } from "@/lib/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function SecretSantaPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50/30 to-amber-50/50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-amber-950/10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="btn-pop hover:bg-purple-50 dark:hover:bg-purple-950/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 dark:from-purple-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent">
                {t.secretSantaTitle}
              </h1>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-14 relative">
            {/* Decorative Stars */}
            <div className="absolute -top-4 left-1/4 animate-pulse">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <div className="absolute top-0 right-1/4 animate-pulse delay-75">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-6 border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <Gift className="w-4 h-4" />
              <span>{t.secretSantaSubtitle}</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-5 text-balance">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 dark:from-purple-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent">
                {t.secretSantaTitle}
              </span>
            </h2>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              {t.secretSantaInfo}
            </p>
          </div>

          {/* Secret Santa Component */}
          <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-3xl border-2 border-border/50 shadow-2xl shadow-purple-500/10 p-6 md:p-10 mb-10 backdrop-blur-sm relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />

            <div className="relative z-10">
              <SecretSanta />
            </div>
          </div>

          {/* Instructions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 rounded-2xl border-2 border-purple-200/50 dark:border-purple-800/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground">{t.howItWorks || "Hoe werkt het?"}</h3>
              </div>
              <ol className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-sm text-foreground pt-0.5">
                    {t.step1 || "Voeg alle deelnemers toe (minimaal 3 personen)"}
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-sm text-foreground pt-0.5">
                    {t.step2 || "Klik op 'Trek Lootjes' om de trekking te starten"}
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-sm text-foreground pt-0.5">
                    {t.step3 || "Bekijk de resultaten en deel ze met de deelnemers"}
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                    4
                  </span>
                  <span className="text-sm text-foreground pt-0.5">
                    {t.step4 || "Niemand krijgt zichzelf - dat garanderen wij!"}
                  </span>
                </li>
              </ol>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-br from-pink-50 to-amber-50/50 dark:from-pink-950/20 dark:to-amber-900/10 rounded-2xl border-2 border-pink-200/50 dark:border-pink-800/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Tips & Tricks</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="text-pink-500 mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Deel de resultaten direct via WhatsApp of andere apps</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-pink-500 mt-0.5">✓</span>
                  <span className="text-sm text-foreground">
                    Stel een budget in zodat iedereen weet hoeveel te besteden
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-pink-500 mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Maak een verlanglijstje om het makkelijker te maken</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-pink-500 mt-0.5">✓</span>
                  <span className="text-sm text-foreground">Trek de lootjes opnieuw als je niet tevreden bent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
