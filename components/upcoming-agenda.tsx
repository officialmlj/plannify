"use client"

import { useEffect, useState } from "react"
import { MapPin, Users, Clock, Calendar, Plus } from "lucide-react"
import { getAllEvents } from "@/lib/storage"
import type { Event } from "@/lib/types"
import Link from "next/link"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import { Button } from "@/components/ui/button"

interface UpcomingAgendaProps {
  selectedType: "all" | "party" | "vacation" | "study" | "business" | "sport"
}

export function UpcomingAgenda({ selectedType }: UpcomingAgendaProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  useEffect(() => {
    const events = getAllEvents()
    const now = new Date()

    let filteredEvents = events.filter((e) => new Date(e.date) > now)

    if (selectedType !== "all") {
      filteredEvents = filteredEvents.filter((e) => e.type === selectedType)
    }

    // Get upcoming events (next 5)
    const upcoming = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5)

    setUpcomingEvents(upcoming)
  }, [selectedType])

  const eventTypes = [
    { value: "all" as const, label: "Alles", emoji: "🎯" },
    { value: "party" as const, label: "Feest", emoji: "🎉" },
    { value: "vacation" as const, label: "Vakantie", emoji: "✈️" },
    { value: "study" as const, label: "Studie", emoji: "📚" },
    { value: "business" as const, label: "Zakelijk", emoji: "💼" },
    { value: "sport" as const, label: "Sport", emoji: "🏋️" },
  ]

  if (upcomingEvents.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Jouw Agenda</h2>
            <p className="text-muted-foreground">Hier zie je al je aankomende events</p>
          </div>

          <div className="bg-card border-2 border-dashed border-border p-12 text-center rounded-4xl">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {selectedType === "all"
                ? "Je agenda is nog leeg"
                : `Geen ${eventTypes.find((t) => t.value === selectedType)?.label.toLowerCase()} events`}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {selectedType === "all"
                ? "Maak je eerste event aan en zie hier een overzicht van al je aankomende plannen met datum, tijd, locatie en aantal gasten."
                : `Plan een ${eventTypes.find((t) => t.value === selectedType)?.label.toLowerCase()} event om het hier te zien.`}
            </p>
            <Link href={selectedType === "all" ? "/create" : `/create?type=${selectedType}`}>
              <Button className="bg-primary hover:bg-primary-hover text-white btn-pop">
                <Plus className="w-4 h-4 mr-2" />
                {selectedType === "all"
                  ? "Event aanmaken"
                  : `${eventTypes.find((t) => t.value === selectedType)?.emoji} ${eventTypes.find((t) => t.value === selectedType)?.label} plannen`}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-1">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Jouw Agenda</h2>
            <p className="text-card">
              {selectedType === "all"
                ? "Aankomende events waar je bij bent"
                : `Je ${eventTypes.find((t) => t.value === selectedType)?.label.toLowerCase()} events`}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="hover:text-primary-hover font-medium flex items-center gap-2 btn-pop text-white"
          >
            Bekijk alles
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const confirmedGuests = (event.guests || []).filter((g) => g.status === "yes").length
            const eventDate = new Date(event.date)

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="border border-border rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer bg-card">
                  <div className="flex items-center gap-6">
                    {/* Date badge */}
                    <div className="flex-shrink-0 text-white rounded-xl p-4 text-center min-w-[80px] bg-popover-foreground">
                      <div className="text-2xl font-bold text-card">{format(eventDate, "d", { locale: nl })}</div>
                      <div className="text-xs uppercase text-card">{format(eventDate, "MMM", { locale: nl })}</div>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-foreground" />
                          <span className="text-foreground">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-foreground" />
                          <span className="truncate max-w-[200px] text-foreground">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-foreground">
                          <Users className="w-4 h-4" />
                          <span>{confirmedGuests} gasten</span>
                        </div>
                      </div>
                    </div>

                    {/* Event type badge */}
                    <div className="flex-shrink-0 hidden md:block">
                      <span className="px-4 py-2 rounded-full bg-primary/10 text-sm font-medium capitalize text-foreground">
                        {event.type === "party"
                          ? "Feest"
                          : event.type === "vacation"
                            ? "Vakantie"
                            : event.type === "study"
                              ? "Studie"
                              : event.type === "business"
                                ? "Zakelijk"
                                : "Sport"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
