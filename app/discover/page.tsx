"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, Filter, ArrowLeft } from "lucide-react"
import type { Event, EventType } from "@/lib/types"
import { EVENT_TYPES } from "@/lib/types"
import { getPublicEvents } from "@/lib/storage"
import Link from "next/link"

export default function DiscoverPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<EventType | "all">("all")

  useEffect(() => {
    const publicEvents = getPublicEvents()
    setEvents(publicEvents)
    setFilteredEvents(publicEvents)
  }, [])

  useEffect(() => {
    let filtered = events

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((e) => e.eventType === selectedType)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, selectedType, events])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="min-h-screen bg-[#09091C] relative overflow-hidden">
      {/* Decorative curved lines */}
      <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-[#2070FF]/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full border-2 border-[#06B6D4]/20 rounded-full transform translate-x-1/2 translate-y-1/2" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#09091C]/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src="/images/plannify-logo-white.png" alt="Plannify" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">Plannify</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#2070FF] to-[#06B6D4] bg-clip-text text-transparent">
              Ontdek Events
            </h1>
            <p className="text-xl text-gray-300">Vind interessante events in jouw buurt en maak nieuwe connecties</p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Zoek op titel, locatie of beschrijving..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                className={
                  selectedType === "all"
                    ? "bg-gradient-to-r from-[#2070FF] to-[#06B6D4]"
                    : "border-white/10 text-white hover:bg-white/5"
                }
              >
                Alles
              </Button>
              {(Object.keys(EVENT_TYPES) as EventType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className={
                    selectedType === type
                      ? "bg-gradient-to-r from-[#2070FF] to-[#06B6D4]"
                      : "border-white/10 text-white hover:bg-white/5"
                  }
                >
                  {EVENT_TYPES[type].emoji} {EVENT_TYPES[type].label}
                </Button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <Card className="p-12 text-center bg-white/5 border-white/10 backdrop-blur-xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2 text-white">Geen events gevonden</h3>
              <p className="text-gray-300 mb-6">
                {searchQuery || selectedType !== "all"
                  ? "Probeer je zoekopdracht aan te passen"
                  : "Er zijn nog geen publieke events. Wees de eerste en maak er een!"}
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-[#2070FF] to-[#06B6D4]">Maak een Event</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const guestCount = event.guests.filter((g) => g.status === "yes").length
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group h-full bg-white/5 border-white/10 backdrop-blur-xl">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.coverImage || "/placeholder.svg?height=200&width=400"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div
                          className="absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold"
                          style={{
                            backgroundColor: `${event.theme.primaryColor}20`,
                            border: `2px solid ${event.theme.primaryColor}`,
                            color: event.theme.primaryColor,
                          }}
                        >
                          {EVENT_TYPES[event.eventType].emoji} {EVENT_TYPES[event.eventType].label}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" style={{ color: event.theme.primaryColor }} />
                            <span>
                              {formatDate(event.date)} om {event.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" style={{ color: event.theme.primaryColor }} />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>

                          {guestCount > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" style={{ color: event.theme.primaryColor }} />
                              <span>
                                {guestCount} {guestCount === 1 ? "persoon komt" : "mensen komen"}
                              </span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                        )}

                        <Button className="w-full" style={{ backgroundColor: event.theme.primaryColor }}>
                          Bekijk Event
                        </Button>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
