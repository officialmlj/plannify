"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Event, Guest, GuestPreferences } from "@/lib/types"
import { updateEvent } from "@/lib/storage"
import { Wine, Car, Users } from "lucide-react"

interface GuestResponseFormProps {
  event: Event
  guest: Guest
  onUpdate: (event: Event) => void
}

export function GuestResponseForm({ event, guest, onUpdate }: GuestResponseFormProps) {
  const [preferences, setPreferences] = useState<GuestPreferences>(guest.preferences || {})

  const handleSave = () => {
    const updatedGuests = event.guests.map((g) => (g.id === guest.id ? { ...g, preferences } : g))

    const updatedEvent = {
      ...event,
      guests: updatedGuests,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-xl font-bold">Jouw Voorkeuren</h3>

      {/* Drink Preference */}
      <div className="space-y-2">
        <Label htmlFor="drink" className="flex items-center gap-2">
          <Wine className="w-4 h-4" />
          Wat drink je graag?
        </Label>
        <Input
          id="drink"
          value={preferences.drinkPreference || ""}
          onChange={(e) => setPreferences({ ...preferences, drinkPreference: e.target.value })}
          placeholder="Bijv. Bier, Wijn, Fris"
        />
      </div>

      {/* Transportation */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Hoe kom je?
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { value: "car", label: "Auto", emoji: "🚗" },
            { value: "carpool", label: "Meerijden", emoji: "🚙" },
            { value: "bike", label: "Fiets", emoji: "🚲" },
            { value: "walk", label: "Lopen", emoji: "🚶" },
            { value: "public-transport", label: "OV", emoji: "🚌" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPreferences({ ...preferences, transportation: option.value as any })}
              className={`p-3 rounded-lg border-2 transition-all ${
                preferences.transportation === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Carpool Options */}
      {preferences.transportation === "car" && (
        <div className="space-y-2">
          <Label htmlFor="seats">Hoeveel plekken heb je beschikbaar?</Label>
          <Input
            id="seats"
            type="number"
            min="0"
            max="8"
            value={preferences.availableSeats || 0}
            onChange={(e) => setPreferences({ ...preferences, availableSeats: Number(e.target.value) })}
          />
        </div>
      )}

      {/* Brings Guest */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Neem je iemand mee?
        </Label>
        <div className="flex gap-4">
          <button
            onClick={() => setPreferences({ ...preferences, bringsGuest: false, guestCount: 0 })}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              !preferences.bringsGuest ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            Nee
          </button>
          <button
            onClick={() => setPreferences({ ...preferences, bringsGuest: true, guestCount: 1 })}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              preferences.bringsGuest ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            Ja
          </button>
        </div>
      </div>

      {preferences.bringsGuest && (
        <div className="space-y-2">
          <Label htmlFor="guestCount">Hoeveel personen?</Label>
          <Input
            id="guestCount"
            type="number"
            min="1"
            max="5"
            value={preferences.guestCount || 1}
            onChange={(e) => setPreferences({ ...preferences, guestCount: Number(e.target.value) })}
          />
        </div>
      )}

      {/* Contribution */}
      <div className="space-y-2">
        <Label htmlFor="contribution">Wat neem je mee? (optioneel)</Label>
        <Textarea
          id="contribution"
          value={preferences.contribution || ""}
          onChange={(e) => setPreferences({ ...preferences, contribution: e.target.value })}
          placeholder="Bijv. Chips, Drankjes, Muziek"
          rows={3}
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        Voorkeuren Opslaan
      </Button>
    </Card>
  )
}
