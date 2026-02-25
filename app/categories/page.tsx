"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { EVENT_TYPES, type EventType } from "@/lib/types"
import { useTranslation } from "@/lib/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"

const categoryGroups = {
  personal: [
    "birthday",
    "sweet16",
    "babyshower",
    "genderreveal",
    "housewarming",
    "engagement",
    "bachelor",
    "wedding",
    "anniversary",
  ] as EventType[],
  seasonal: ["newyear", "christmas", "halloween", "carnival", "kingsday", "easter", "summer"] as EventType[],
  friendsFamily: ["party", "gamenight", "movienight", "reunion", "surprise", "picnic"] as EventType[],
  business: [
    "vrijmibo",
    "teamouting",
    "lunch",
    "productlaunch",
    "networking",
    "businessparty",
    "opening",
    "business",
  ] as EventType[],
  theme: [
    "blackwhite",
    "retro",
    "pajama",
    "masquerade",
    "casino",
    "tropical",
    "festival",
    "silentdisco",
  ] as EventType[],
  student: ["intro", "cantus", "studenthouse", "beerpong", "afterexam", "study"] as EventType[],
  other: ["vacation", "sport"] as EventType[],
}

export default function CategoriesPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0F172A]/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-[1200px]">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
          </Link>
          <span className="text-2xl font-bold">{""}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-[1200px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">{t("exploreAll")}</h1>
          <p className="text-slate-300 text-lg">Kies het perfecte event type voor jouw gelegenheid</p>
        </div>

        {/* Personal Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-popover">
            <span className="text-3xl">🎉</span>
            {t("personalEvents")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.personal.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1 text-popover">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-card">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Seasonal Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-card">
            <span className="text-3xl">🎄</span>
            {t("seasonalEvents")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.seasonal.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1 text-card">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-card">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Friends & Family */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">👥</span>
            {t("friendsFamily")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.friendsFamily.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-slate-400">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Business & Networking */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">💼</span>
            {t("businessEvents")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.business.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-slate-400">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Theme Parties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">🎭</span>
            {t("themeParties")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.theme.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-slate-400">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Student Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            {t("studentEvents")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryGroups.student.map((type) => (
              <Link key={type} href={`/create?type=${type}`}>
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm">
                  <div className="text-4xl mb-3">{EVENT_TYPES[type].emoji}</div>
                  <h3 className="font-semibold mb-1">{EVENT_TYPES[type].label}</h3>
                  <p className="text-sm text-slate-400">{EVENT_TYPES[type].description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
