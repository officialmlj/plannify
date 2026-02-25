"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Sparkles } from "lucide-react"
import { getHostEvents, getHostId } from "@/lib/storage"
import type { Event } from "@/lib/types"
import { EventCard } from "@/components/event-card"

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hostId = getHostId()
    const hostEvents = getHostEvents(hostId)
    setEvents(hostEvents)
    setLoading(false)

    const interval = setInterval(() => {
      const updatedEvents = getHostEvents(hostId)
      setEvents(updatedEvents)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date())
  const pastEvents = events.filter((e) => new Date(e.date) < new Date())

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
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3f2caac9-0280-4ded-a48f-bcf263c686bd-kDjjlW3ttL9EEJnYxfWSGy85ay9DcT.png" alt="Plannify" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">Jouw Events</span>
            </div>
          </div>

          <Link href="/create">
            <Button className="bg-gradient-to-r from-[#2070FF] to-[#06B6D4] hover:opacity-90 text-white gap-2 rounded-lg px-4 shadow-lg">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nieuwe Event</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-[#0EA5E9] border-t-transparent rounded-full" />
            <p className="text-slate-300 mt-4">Events laden...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-[#0EA5E9]" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Geen aankomende events</h2>
            <p className="text-lg text-slate-300 mb-8 leading-7">
              Maak er een! Begin met het plannen van jouw eerste event
            </p>
            <Link href="/create">
              <Button
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white gap-2 rounded-xl px-6 py-6 text-lg shadow-lg shadow-[#0EA5E9]/30"
                size="lg"
              >
                <Plus className="w-6 h-6" />
                Maak je eerste event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {upcomingEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Aankomende Events</h2>
                  <span className="text-slate-300 text-sm">
                    {upcomingEvents.length} {upcomingEvents.length === 1 ? "event" : "events"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {upcomingEvents.map((event, index) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-400 tracking-tight">Afgelopen Events</h2>
                  <span className="text-slate-400 text-sm">
                    {pastEvents.length} {pastEvents.length === 1 ? "event" : "events"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {pastEvents.map((event, index) => (
                    <div key={event.id}>
                      <EventCard event={event} isPast />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
