"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Users, Cloud, CloudRain, Sun, CloudSnow } from "lucide-react"
import { getAllEvents } from "@/lib/storage"
import type { Event } from "@/lib/types"
import Link from "next/link"

interface NextEventCountdownProps {
  selectedType: "all" | "party" | "vacation" | "study" | "business" | "sport"
}

export function NextEventCountdown({ selectedType }: NextEventCountdownProps) {
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [weather, setWeather] = useState<{
    temp: number
    condition: string
    icon: string
  } | null>(null)

  useEffect(() => {
    const events = getAllEvents()
    const now = new Date()

    let filteredEvents = events.filter((e) => {
      const eventDateTime = new Date(`${e.date}T${e.time || "00:00"}`)
      return eventDateTime > now
    })

    if (selectedType !== "all") {
      filteredEvents = filteredEvents.filter((e) => e.type === selectedType)
    }

    // Find the next upcoming event
    const upcomingEvents = filteredEvents.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || "00:00"}`)
      const dateB = new Date(`${b.date}T${b.time || "00:00"}`)
      return dateA.getTime() - dateB.getTime()
    })

    if (upcomingEvents.length > 0) {
      setNextEvent(upcomingEvents[0])

      // Simulate weather data (in production, this would be an API call)
      setWeather({
        temp: Math.floor(Math.random() * 15) + 10, // 10-25°C
        condition: ["Zonnig", "Bewolkt", "Lichte regen", "Helder"][Math.floor(Math.random() * 4)],
        icon: ["sun", "cloud", "rain", "snow"][Math.floor(Math.random() * 4)],
      })
    } else {
      setNextEvent(null)
    }
  }, [selectedType])

  useEffect(() => {
    if (!nextEvent) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const eventDateTime = new Date(`${nextEvent.date}T${nextEvent.time || "00:00"}`)
      const eventTime = eventDateTime.getTime()
      const difference = eventTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [nextEvent])

  const eventTypes = [
    { value: "all" as const, label: "Alles", emoji: "🎯" },
    { value: "party" as const, label: "Feest", emoji: "🎉" },
    { value: "vacation" as const, label: "Vakantie", emoji: "✈️" },
    { value: "study" as const, label: "Studie", emoji: "📚" },
    { value: "business" as const, label: "Zakelijk", emoji: "💼" },
    { value: "sport" as const, label: "Sport", emoji: "🏋️" },
  ]

  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="w-8 h-8" />
    switch (weather.icon) {
      case "sun":
        return <Sun className="w-8 h-8 text-yellow-500" />
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-500" />
      case "snow":
        return <CloudSnow className="w-8 h-8 text-blue-300" />
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />
    }
  }

  if (!nextEvent) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12 border-dashed border-primary/30 rounded-4xl md:px-3.5 my-0 md:pl-2.5 border-0">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 text-primary bg-primary border-primary">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Countdown naar je volgende event</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Zodra je een event aanmaakt, zie je hier een live countdown, het verwachte weer en hoeveel gasten er
                komen
              </p>
              <Link href={selectedType === "all" ? "/create" : `/create?type=${selectedType}`}></Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const confirmedGuests = (nextEvent.guests || []).filter((g) => g.status === "yes").length

  return (
    <section className="container mx-auto px-4 py-12 opacity-100">
      <div className="max-w-6xl mx-auto">
        <Link href={`/events/${nextEvent.id}`}>
          <div className="rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group py-2 px-2 border opacity-100 text-card-foreground border-primary bg-popover">
            <div className="flex flex-col md:flex-row items-center justify-between gap-1">
              {/* Left side - Event info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Volgend Event</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform">
                  {nextEvent.title}
                </h2>

                <div className="flex flex-col gap-3 text-white/90">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="w-5 h-5 text-foreground" />
                    <span className="text-card-foreground">{nextEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Users className="w-5 h-5" />
                    <span>{confirmedGuests} gasten komen</span>
                  </div>
                </div>
              </div>

              {/* Center - Countdown */}
              <div className="flex-1">
                <div className="text-center">
                  <p className="text-sm mb-4 uppercase tracking-wider text-popover-foreground font-semibold">Begint over</p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="backdrop-blur-sm rounded-2xl p-4 px-1 bg-card-foreground">
                      <div className="text-4xl font-bold text-card">{timeLeft.days}</div>
                      <div className="text-xs text-white/70 mt-1">Dagen</div>
                    </div>
                    <div className="backdrop-blur-sm rounded-2xl p-4 px-2.5 bg-card-foreground">
                      <div className="text-4xl font-bold text-popover">{timeLeft.hours}</div>
                      <div className="text-xs text-white/70 mt-1">Uren</div>
                    </div>
                    <div className="backdrop-blur-sm rounded-2xl p-4 px-2 bg-card-foreground">
                      <div className="text-4xl font-bold px-0 mx-0 text-card">{timeLeft.minutes}</div>
                      <div className="text-xs text-white/70 mt-1">Min</div>
                    </div>
                    <div className="backdrop-blur-sm rounded-2xl p-4 font-extralight py-4 px-1.5 bg-card-foreground">
                      <div className="text-4xl font-bold text-card">{timeLeft.seconds}</div>
                      <div className="text-xs text-white/70 mt-1">Sec</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Weather */}
              {weather && (
                <div className="flex-shrink-0">
                  <div className="backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px] bg-popover-foreground">
                    <div className="flex justify-center mb-3">{getWeatherIcon()}</div>
                    <div className="text-3xl font-bold mb-1 text-card">{weather.temp}°C</div>
                    <div className="text-sm text-white/80">{weather.condition}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
