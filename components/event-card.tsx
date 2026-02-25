import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Check, HelpCircle, X, Users } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventCardProps {
  event: Event
  isPast?: boolean
}

export function EventCard({ event, isPast = false }: EventCardProps) {
  const guestCounts = {
    yes: event.guests.filter((g) => g.status === "yes").length,
    maybe: event.guests.filter((g) => g.status === "maybe").length,
    no: event.guests.filter((g) => g.status === "no").length,
  }

  const totalResponded = guestCounts.yes + guestCounts.maybe + guestCounts.no
  const totalGuests = event.guests.length

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card
      className={`overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0EA5E9]/10 ${isPast ? "opacity-60" : ""}`}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.coverImage || "/placeholder.svg?height=192&width=400"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {isPast && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-xl text-white text-xs font-medium rounded-full border border-white/20">
            Afgelopen
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white line-clamp-2 tracking-tight">{event.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Event Details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Calendar className="w-4 h-4 text-[#0EA5E9]" />
            <span>
              {formatDate(event.date)} om {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <MapPin className="w-4 h-4 text-[#0EA5E9]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Guest Stats */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0EA5E9]" />
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-white">{guestCounts.yes}</span>{" "}
              {guestCounts.yes === 1 ? "gast" : "gasten"}
            </span>
          </div>

          {/* Response Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-6 h-6 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-[#0EA5E9]" />
              </div>
              <span className="font-semibold text-white">{guestCounts.yes}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="font-semibold text-slate-300">{guestCounts.maybe}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="font-semibold text-slate-300">{guestCounts.no}</span>
            </div>
          </div>

          {/* Progress Bar */}
          {totalResponded > 0 && (
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] transition-all shadow-lg shadow-[#0EA5E9]/50"
                style={{ width: `${(guestCounts.yes / totalResponded) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link href={`/events/${event.id}/manage`} className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Beheren
            </Button>
          </Link>
          <Link href={`/events/${event.id}`} className="flex-1">
            <Button className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-xl shadow-lg shadow-[#0EA5E9]/20 transition-all hover:-translate-y-0.5">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
