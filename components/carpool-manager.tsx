"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Users, MapPin, Clock } from "lucide-react"
import type { Event, CarpoolOffer } from "@/lib/types"
import { updateEvent } from "@/lib/storage"

interface CarpoolManagerProps {
  event: Event
  onUpdate: (event: Event) => void
}

export function CarpoolManager({ event, onUpdate }: CarpoolManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newOffer, setNewOffer] = useState({
    driverName: "",
    availableSeats: 3,
    departureLocation: "",
    departureTime: "",
  })

  const carpoolOffers = event.carpoolOffers || []

  const handleAddOffer = () => {
    const offer: CarpoolOffer = {
      id: `carpool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      driverId: event.hostId,
      driverName: newOffer.driverName,
      availableSeats: newOffer.availableSeats,
      departureLocation: newOffer.departureLocation,
      departureTime: newOffer.departureTime,
      passengers: [],
    }

    const updatedEvent = {
      ...event,
      carpoolOffers: [...carpoolOffers, offer],
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
    setShowAddForm(false)
    setNewOffer({ driverName: "", availableSeats: 3, departureLocation: "", departureTime: "" })
  }

  const transportationStats = event.guests.reduce(
    (acc, guest) => {
      const transport = guest.preferences?.transportation || "unknown"
      acc[transport] = (acc[transport] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Car className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Carpool & Vervoer</h3>
      </div>

      {/* Transportation Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <div className="text-2xl mb-1">🚗</div>
          <div className="text-sm font-medium">{transportationStats.car || 0} Auto</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <div className="text-2xl mb-1">🚙</div>
          <div className="text-sm font-medium">{transportationStats.carpool || 0} Meerijden</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <div className="text-2xl mb-1">🚲</div>
          <div className="text-sm font-medium">{transportationStats.bike || 0} Fiets</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <div className="text-2xl mb-1">🚶</div>
          <div className="text-sm font-medium">{transportationStats.walk || 0} Lopen</div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <div className="text-2xl mb-1">🚌</div>
          <div className="text-sm font-medium">{transportationStats["public-transport"] || 0} OV</div>
        </div>
      </div>

      {/* Carpool Offers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Beschikbare Carpools</h4>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Annuleren" : "+ Carpool Aanbieden"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="p-4 bg-muted/30">
            <div className="space-y-3">
              <div>
                <Label htmlFor="driverName">Naam Bestuurder</Label>
                <Input
                  id="driverName"
                  value={newOffer.driverName}
                  onChange={(e) => setNewOffer({ ...newOffer, driverName: e.target.value })}
                  placeholder="Jouw naam"
                />
              </div>
              <div>
                <Label htmlFor="seats">Beschikbare Plekken</Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="8"
                  value={newOffer.availableSeats}
                  onChange={(e) => setNewOffer({ ...newOffer, availableSeats: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="departure">Vertreklocatie</Label>
                <Input
                  id="departure"
                  value={newOffer.departureLocation}
                  onChange={(e) => setNewOffer({ ...newOffer, departureLocation: e.target.value })}
                  placeholder="Bijv. Centraal Station"
                />
              </div>
              <div>
                <Label htmlFor="time">Vertrektijd</Label>
                <Input
                  id="time"
                  type="time"
                  value={newOffer.departureTime}
                  onChange={(e) => setNewOffer({ ...newOffer, departureTime: e.target.value })}
                />
              </div>
              <Button onClick={handleAddOffer} className="w-full" disabled={!newOffer.driverName}>
                Carpool Toevoegen
              </Button>
            </div>
          </Card>
        )}

        {carpoolOffers.length > 0 ? (
          <div className="space-y-3">
            {carpoolOffers.map((offer) => (
              <Card key={offer.id} className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{offer.driverName}</span>
                    </div>
                    {offer.departureLocation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {offer.departureLocation}
                      </div>
                    )}
                    {offer.departureTime && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {offer.departureTime}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {offer.availableSeats - offer.passengers.length}/{offer.availableSeats}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nog geen carpools beschikbaar</p>
          </div>
        )}
      </div>
    </Card>
  )
}
