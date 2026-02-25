"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPin, Users, ChevronRight } from "lucide-react"
import { getHostEvents, getHostId } from "@/lib/storage"
import type { Event } from "@/lib/types"

export function EventsCarousel() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const hostId = getHostId()
    const hostEvents = getHostEvents(hostId)
    const upcoming = hostEvents
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
    setEvents(upcoming)
  }, [])

  if (events.length === 0) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Jouw Aankomende Events</h2>
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 text-slate-300 hover:text-white hover:bg-white/5">
                Alles bekijken
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {events.map((event, index) => {
              const guestCounts = {
                yes: (event.guests || []).filter((g) => g.status === "yes").length,
                total: (event.guests || []).length,
              }

              return (
                <div key={event.id} className="snap-start">
                  <Link href={`/events/${event.id}/manage`}>
                    <Card className="min-w-[320px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer group">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={event.coverImage || "/placeholder.svg?height=200&width=400"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-white text-xl line-clamp-2">{event.title}</h3>
                        </div>
                        <div className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-2xl backdrop-blur-md bg-blue-500/20 border border-blue-400/30 shadow-lg">
                          {event.theme?.emoji || "🎉"}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CalendarIcon className="w-4 h-4 text-blue-400" />
                          <span>
                            {formatDate(event.date)} • {event.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm pt-2 border-t border-white/10">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-white">
                            {guestCounts.yes} {guestCounts.yes === 1 ? "gast" : "gasten"}
                          </span>
                          {guestCounts.total > guestCounts.yes && (
                            <span className="text-slate-400">• {guestCounts.total} totaal</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
