"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, UserCheck, AlertCircle } from "lucide-react"
import type { Event } from "@/lib/types"
import { updateEvent } from "@/lib/storage"

interface GuestApprovalPanelProps {
  event: Event
  onUpdate: (event: Event) => void
}

export function GuestApprovalPanel({ event, onUpdate }: GuestApprovalPanelProps) {
  const pendingGuests = event.guests.filter(
    (g) =>
      g.status === "yes" &&
      (g.approved === undefined || g.approved === false || (g.plusOne && g.plusOneApproved === undefined)),
  )

  const approvedCount = event.guests.filter((g) => g.approved && g.status === "yes").length
  const maxGuests = event.maxGuests || Number.POSITIVE_INFINITY

  const handleApproveGuest = (guestId: string) => {
    const updatedGuests = event.guests.map((guest) => {
      if (guest.id === guestId) {
        return {
          ...guest,
          approved: true,
          plusOneApproved: guest.plusOne ? true : guest.plusOneApproved,
        }
      }
      return guest
    })

    const updatedEvent = {
      ...event,
      guests: updatedGuests,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const handleDeclineGuest = (guestId: string) => {
    const updatedGuests = event.guests.map((guest) => {
      if (guest.id === guestId) {
        return {
          ...guest,
          status: "no" as const,
          approved: false,
        }
      }
      return guest
    })

    const updatedEvent = {
      ...event,
      guests: updatedGuests,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const handleApprovePlusOne = (guestId: string) => {
    const updatedGuests = event.guests.map((guest) => {
      if (guest.id === guestId) {
        return {
          ...guest,
          plusOneApproved: true,
        }
      }
      return guest
    })

    const updatedEvent = {
      ...event,
      guests: updatedGuests,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const handleDeclinePlusOne = (guestId: string) => {
    const updatedGuests = event.guests.map((guest) => {
      if (guest.id === guestId) {
        return {
          ...guest,
          plusOne: false,
          plusOneApproved: false,
        }
      }
      return guest
    })

    const updatedEvent = {
      ...event,
      guests: updatedGuests,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  if (!event.requireApproval && pendingGuests.length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-sky-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Goedkeuring vereist</h3>
        </div>
        {event.maxGuests && (
          <div className="text-sm text-muted-foreground">
            {approvedCount} / {event.maxGuests} plekken bezet
          </div>
        )}
      </div>

      {event.maxGuests && approvedCount >= event.maxGuests && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <p className="text-sm text-orange-700">
            Maximum aantal gasten bereikt. Nieuwe aanmeldingen worden automatisch op de wachtlijst geplaatst.
          </p>
        </div>
      )}

      {pendingGuests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Geen aanvragen in afwachting</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingGuests.map((guest) => {
            const needsGuestApproval = guest.approved === undefined || guest.approved === false
            const needsPlusOneApproval = guest.plusOne && guest.plusOneApproved === undefined

            return (
              <Card key={guest.id} className="p-4 bg-muted/30">
                <div className="space-y-3">
                  {needsGuestApproval && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{guest.name}</p>
                        <p className="text-sm text-muted-foreground">{guest.email || "Geen email opgegeven"}</p>
                        {guest.respondedAt && (
                          <p className="text-xs text-muted-foreground">
                            Aangemeld op {new Date(guest.respondedAt).toLocaleDateString("nl-NL")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApproveGuest(guest.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Goedkeuren
                        </Button>
                        <Button onClick={() => handleDeclineGuest(guest.id)} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" />
                          Weigeren
                        </Button>
                      </div>
                    </div>
                  )}

                  {needsPlusOneApproval && guest.approved && (
                    <div className="flex items-center justify-between pl-6 border-l-2 border-primary/30">
                      <div className="flex-1">
                        <p className="font-medium text-sm">+1 Gast</p>
                        <p className="text-xs text-muted-foreground">{guest.plusOneName || "Naam niet opgegeven"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApprovePlusOne(guest.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDeclinePlusOne(guest.id)} variant="outline" size="sm">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Card>
  )
}
