"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Car, 
  Bus, 
  Bike, 
  Footprints, 
  Users, 
  MapPin, 
  Clock, 
  Navigation,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Plus,
  X
} from "lucide-react"

interface TransportOptionsProps {
  eventLocation: string
  eventDate: string
  eventTime: string
  primaryColor?: string
  onTransportSelect?: (transport: TransportSelection) => void
  initialSelection?: TransportSelection
}

interface TransportSelection {
  type: string
  departureTime?: string
  departureLocation?: string
  seats?: number
  routeInfo?: string
  notes?: string
}

interface CarpoolOffer {
  id: string
  driverName: string
  departureLocation: string
  departureTime: string
  availableSeats: number
  passengers: string[]
}

export function TransportOptions({ 
  eventLocation, 
  eventDate, 
  eventTime, 
  primaryColor = "#6366F1",
  onTransportSelect,
  initialSelection
}: TransportOptionsProps) {
  const [selectedTransport, setSelectedTransport] = useState<string>(initialSelection?.type || "")
  const [expanded, setExpanded] = useState(true)
  const [departureTime, setDepartureTime] = useState(initialSelection?.departureTime || "")
  const [departureLocation, setDepartureLocation] = useState(initialSelection?.departureLocation || "")
  const [availableSeats, setAvailableSeats] = useState(initialSelection?.seats || 0)
  const [notes, setNotes] = useState(initialSelection?.notes || "")
  
  // Mock carpool offers - in real app this would come from database
  const [carpoolOffers] = useState<CarpoolOffer[]>([
    {
      id: "1",
      driverName: "Jan",
      departureLocation: "Amsterdam Centraal",
      departureTime: "19:00",
      availableSeats: 3,
      passengers: ["Lisa"]
    },
    {
      id: "2", 
      driverName: "Emma",
      departureLocation: "Utrecht CS",
      departureTime: "18:30",
      availableSeats: 2,
      passengers: []
    }
  ])

  const transportOptions = [
    { 
      id: "car", 
      label: "Auto", 
      icon: Car, 
      color: "bg-blue-500",
      description: "Ik kom met de auto"
    },
    { 
      id: "carpool-driver", 
      label: "Carpool (bestuurder)", 
      icon: Car, 
      color: "bg-green-500",
      description: "Ik kan mensen meenemen"
    },
    { 
      id: "carpool-passenger", 
      label: "Carpool (meerijden)", 
      icon: Users, 
      color: "bg-teal-500",
      description: "Ik wil meerijden"
    },
    { 
      id: "uber", 
      label: "Uber / Taxi", 
      icon: Car, 
      color: "bg-black",
      description: "Ik neem een Uber of taxi"
    },
    { 
      id: "public-transport", 
      label: "Openbaar Vervoer", 
      icon: Bus, 
      color: "bg-orange-500",
      description: "Trein, bus of metro"
    },
    { 
      id: "bike", 
      label: "Fiets", 
      icon: Bike, 
      color: "bg-yellow-500",
      description: "Ik kom op de fiets"
    },
    { 
      id: "walk", 
      label: "Lopen", 
      icon: Footprints, 
      color: "bg-purple-500",
      description: "Ik kom lopend"
    },
    { 
      id: "other", 
      label: "Anders", 
      icon: Navigation, 
      color: "bg-gray-500",
      description: "Andere manier"
    },
  ]

  const handleSelect = (transportId: string) => {
    setSelectedTransport(transportId)
    if (onTransportSelect) {
      onTransportSelect({
        type: transportId,
        departureTime,
        departureLocation,
        seats: availableSeats,
        notes
      })
    }
  }

  const openGoogleMapsRoute = () => {
    const destination = encodeURIComponent(eventLocation)
    const origin = departureLocation ? encodeURIComponent(departureLocation) : ""
    let mode = "driving"
    
    if (selectedTransport === "public-transport") mode = "transit"
    else if (selectedTransport === "bike") mode = "bicycling"
    else if (selectedTransport === "walk") mode = "walking"
    
    const url = origin 
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${mode}`
    
    window.open(url, "_blank")
  }

  const open9292Route = () => {
    const destination = encodeURIComponent(eventLocation)
    const url = `https://9292.nl/reisadvies?naar=${destination}`
    window.open(url, "_blank")
  }

  const openUber = () => {
    const destination = encodeURIComponent(eventLocation)
    const url = `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${destination}`
    window.open(url, "_blank")
  }

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: `${primaryColor}20` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Navigation className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Hoe kom je?</h3>
            <p className="text-sm text-gray-500">
              {selectedTransport 
                ? transportOptions.find(t => t.id === selectedTransport)?.label 
                : "Selecteer je vervoer"}
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Transport Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {transportOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedTransport === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    isSelected 
                      ? "border-2 bg-opacity-10" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={isSelected ? { 
                    borderColor: primaryColor, 
                    backgroundColor: `${primaryColor}10` 
                  } : {}}
                >
                  <div 
                    className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${option.color}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-medium text-gray-700">{option.label}</div>
                </button>
              )
            })}
          </div>

          {/* Carpool Driver Options */}
          {selectedTransport === "carpool-driver" && (
            <div className="space-y-3 p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-800 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Carpool aanbieden
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-green-700">Vertreklocatie</Label>
                  <Input
                    value={departureLocation}
                    onChange={(e) => setDepartureLocation(e.target.value)}
                    placeholder="Bijv. Amsterdam CS"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-sm text-green-700">Vertrektijd</Label>
                  <Input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="mt-1 bg-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-green-700">Beschikbare plekken</Label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setAvailableSeats(num)}
                      className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                        availableSeats === num 
                          ? "border-green-500 bg-green-500 text-white" 
                          : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Carpool Passenger Options */}
          {selectedTransport === "carpool-passenger" && (
            <div className="space-y-3 p-4 bg-teal-50 rounded-xl">
              <h4 className="font-semibold text-teal-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Beschikbare carpools
              </h4>
              {carpoolOffers.length > 0 ? (
                <div className="space-y-2">
                  {carpoolOffers.map((offer) => (
                    <div 
                      key={offer.id}
                      className="p-3 bg-white rounded-lg border border-teal-200 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{offer.driverName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> {offer.departureLocation}
                          <Clock className="w-3 h-3 ml-2" /> {offer.departureTime}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-teal-600">
                          {offer.availableSeats - offer.passengers.length} plekken vrij
                        </div>
                        <Button size="sm" className="mt-1 bg-teal-500 hover:bg-teal-600 text-white">
                          Aanmelden
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-teal-600">Nog geen carpools beschikbaar</p>
              )}
              
              <div className="pt-2">
                <Label className="text-sm text-teal-700">Jouw vertreklocatie (voor matching)</Label>
                <Input
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  placeholder="Waar vertrek je?"
                  className="mt-1 bg-white"
                />
              </div>
            </div>
          )}

          {/* Uber / Taxi Options */}
          {selectedTransport === "uber" && (
            <div className="space-y-3 p-4 bg-gray-900 rounded-xl">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Car className="w-4 h-4" />
                Uber / Taxi
              </h4>
              <Button 
                onClick={openUber}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Uber app
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Bestemming: {eventLocation}
              </p>
            </div>
          )}

          {/* Public Transport Options */}
          {selectedTransport === "public-transport" && (
            <div className="space-y-3 p-4 bg-orange-50 rounded-xl">
              <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                <Bus className="w-4 h-4" />
                Openbaar Vervoer
              </h4>
              <div>
                <Label className="text-sm text-orange-700">Vertreklocatie</Label>
                <Input
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  placeholder="Waar vertrek je?"
                  className="mt-1 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={open9292Route}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  9292.nl
                </Button>
                <Button 
                  onClick={openGoogleMapsRoute}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Maps
                </Button>
              </div>
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <div className="text-sm text-gray-600">
                  <strong>Tip:</strong> Vertrek ruim op tijd! Event start om {eventTime}
                </div>
              </div>
            </div>
          )}

          {/* Bike Options */}
          {selectedTransport === "bike" && (
            <div className="space-y-3 p-4 bg-yellow-50 rounded-xl">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Met de fiets
              </h4>
              <div>
                <Label className="text-sm text-yellow-700">Vertreklocatie</Label>
                <Input
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  placeholder="Waar vertrek je?"
                  className="mt-1 bg-white"
                />
              </div>
              <Button 
                onClick={openGoogleMapsRoute}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Bekijk fietsroute
              </Button>
            </div>
          )}

          {/* Walk Options */}
          {selectedTransport === "walk" && (
            <div className="space-y-3 p-4 bg-purple-50 rounded-xl">
              <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                <Footprints className="w-4 h-4" />
                Lopend
              </h4>
              <div>
                <Label className="text-sm text-purple-700">Vertreklocatie</Label>
                <Input
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  placeholder="Waar vertrek je?"
                  className="mt-1 bg-white"
                />
              </div>
              <Button 
                onClick={openGoogleMapsRoute}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Bekijk wandelroute
              </Button>
            </div>
          )}

          {/* Other Options */}
          {selectedTransport === "other" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Anders
              </h4>
              <div>
                <Label className="text-sm text-gray-700">Hoe kom je?</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bijv. scooter, boot, etc."
                  className="mt-1 bg-white"
                />
              </div>
            </div>
          )}

          {/* Departure Time for all options */}
          {selectedTransport && selectedTransport !== "carpool-driver" && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-700">Geschatte vertrektijd</Label>
                  <Input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
