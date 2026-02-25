"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Sparkles, HelpCircle, Settings, Plus } from "lucide-react"
import { useEffect, useState } from "react"

const plannedEvents = [
  {
    id: 1,
    title: "Verjaardag",
    date: "2023-10-15",
    image: "/images/john-arano-qadvinji20-unsplash-20-281-29.jpg",
    badgeColor: "bg-red-500",
    timeLeft: "10d 5h 30m",
    guestColors: ["bg-red-500", "bg-blue-500", "bg-green-500"],
    guestCount: 15,
  },
  {
    id: 2,
    title: "Borrel",
    date: "2023-11-20",
    image: "/friends-drinking-cocktails-at-bar-cozy-atmosphere.jpg",
    badgeColor: "bg-yellow-500",
    timeLeft: "20d 12h 45m",
    guestColors: ["bg-yellow-500", "bg-orange-500"],
    guestCount: 25,
  },
  {
    id: 3,
    title: "BBQ",
    date: "2023-12-01",
    image: "/summer-bbq-party-garden-friends-grilling-food-outd.jpg",
    badgeColor: "bg-green-500",
    timeLeft: "30d 3h 15m",
    guestColors: ["bg-green-500", "bg-brown-500"],
    guestCount: 30,
  },
]

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Example: countdown to New Year 2027
    const targetDate = new Date("2027-01-01T00:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#09091C] relative overflow-hidden">
      <svg
        className="absolute top-0 right-0 w-96 h-96 opacity-30"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M400 0C400 100 350 150 250 200C150 250 100 300 0 400" stroke="url(#gradient1)" strokeWidth="2" />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2070FF" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-96 h-96 opacity-30"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 400C0 300 50 250 150 200C250 150 300 100 400 0" stroke="url(#gradient2)" strokeWidth="2" />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#2070FF" />
          </linearGradient>
        </defs>
      </svg>

      <nav className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/3f2caac9-0280-4ded-a48f-bcf263c686bd.png"
                alt="Plannify"
                className="h-16 w-16 object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/discover"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                
                
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Mijn Events</span>
              </Link>
              <button className="p-2 text-white/70 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <Link href="/create">
              <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE7] text-white font-semibold px-6 py-2 rounded-lg">
                Event Maken
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 border border-[#6366F1]/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm text-white/90 font-medium">Slimme uitnodigingen voor elk moment</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">
            Plan je event
            <br />
            in{" "}
            <span className="bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
              30 seconden
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            Maak een event, deel de link via WhatsApp of Instagram, en zie direct wie er komt. Geen app download nodig
            voor je gasten.
          </p>

          <Link href="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] hover:from-[#5558E3] hover:to-[#0EA5C7] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nieuw Event Maken
            </Button>
          </Link>
        </div>
      </section>

      {/* Geplande Feestjes Section */}
      {plannedEvents.length > 0 && (
        <section className="relative z-10 container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">Geplande Feestjes</h2>
            <Link href="/dashboard" className="text-[#06B6D4] hover:text-[#0EA5C7] text-sm font-medium flex items-center gap-1">
              Bekijk alle
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plannedEvents.map((event) => (
              <Link href={`/event/${event.id}`} key={event.id} className="group">
                <div className="bg-gradient-to-br from-[#1B1B47]/50 to-[#09091C]/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#6366F1]/50 transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className={`absolute top-3 right-3 ${event.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {event.timeLeft}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {event.guestColors.map((color, index) => (
                          <div key={index} className={`w-6 h-6 rounded-full ${color} border-2 border-[#09091C]`}></div>
                        ))}
                      </div>
                      <span className="text-white/60 text-sm">{event.guestCount} gasten</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="relative z-10 container mx-auto px-6 pb-20 my-11">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-heading">Plan je event</h2>
          <p className="text-white/60 mb-6">Klik op een foto voor inspiratie en start direct</p>
          <Link href="/create">
            <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE7] text-white font-semibold px-8 py-3 rounded-lg text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Start nu
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/images/john-arano-qadvinji20-unsplash-20-281-29.jpg"
                alt="Verjaardag"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>

          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/friends-drinking-cocktails-at-bar-cozy-atmosphere.jpg"
                alt="Borrel"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>

          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/summer-bbq-party-garden-friends-grilling-food-outd.jpg"
                alt="BBQ"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>

          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/house-party-dancing-friends-colorful-lights-fun-ni.jpg"
                alt="Huisfeest"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>

          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/elegant-dinner-party-friends-table-candles-wine-fo.jpg"
                alt="Diner"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>

          <Link href="/create" className="group relative">
            <div className="relative overflow-hidden aspect-square cursor-pointer rounded-lg">
              <img
                src="/costume-theme-party-people-dressed-up-fun-hallowee.jpg"
                alt="Themafeest"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-1.5">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden border border-white/10 rounded-3xl p-8 md:p-12 py-5">
            <img
              src="/images/countdown-bg.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B1B47]/70 to-[#09091C]/80" />
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading">Volgend Groot Evenement</h2>
                <p className="text-white/60">Nieuwjaarsfeest 2027</p>
              </div>

              <div className="grid grid-cols-4 gap-4 md:gap-8">
                <div className="text-center mx-0">
                  <div className="bg-gradient-to-br from-[#2070FF]/20 to-[#06B6D4]/20 border border-[#2070FF]/30 rounded-2xl p-4 md:p-6 mb-2 px-px mr-[-30] ml-[-23px]">
                    <div className="text-4xl font-bold text-white font-heading px-0 md:text-3xl">{timeLeft.days}</div>
                  </div>
                  <div className="text-white/60 text-sm md:text-base font-medium">Dagen</div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#2070FF]/20 to-[#06B6D4]/20 border border-[#2070FF]/30 rounded-2xl p-4 md:p-6 mb-2 ml-[-2px] px-px">
                    <div className="font-bold text-white font-heading text-3xl">{timeLeft.hours}</div>
                  </div>
                  <div className="text-white/60 text-sm md:text-base font-medium">Uren</div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#2070FF]/20 to-[#06B6D4]/20 border border-[#2070FF]/30 rounded-2xl p-4 md:p-6 mb-2 px-[11px]">
                    <div className="text-4xl font-bold text-white font-heading px-0 md:text-3xl">{timeLeft.minutes}</div>
                  </div>
                  <div className="text-white/60 text-sm md:text-base font-medium">Minuten</div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#2070FF]/20 to-[#06B6D4]/20 border border-[#2070FF]/30 rounded-2xl p-4 md:p-6 mb-2 py-[17px] ml-[-2px] mr-[-9px] px-[9px]">
                    <div className="text-4xl font-bold text-white font-heading md:text-3xl">{timeLeft.seconds}</div>
                  </div>
                  <div className="text-white/60 text-sm md:text-base font-medium">Seconden</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link href="/create" className="fixed bottom-6 right-6 z-50">
        <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE7] text-white font-semibold px-4 py-2 rounded-lg">
          <Plus className="w-5 h-5 mr-2" />
          Event Maken
        </Button>
      </Link>
    </div>
  )
}
