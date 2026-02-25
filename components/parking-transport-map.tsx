"use client"

import { useState, useEffect } from "react"
import { MapPin, Car, Bus, Train, User } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TransportInfo {
  parkingAvailable?: boolean
  parkingDetails?: string
  bushalteDistance?: string
  bushalteName?: string
  stationDistance?: string
  stationName?: string
}

interface ParkingTransportMapProps {
  location: string
  transportInfo: TransportInfo
  isEditable?: boolean
  onToggleParking?: (enabled: boolean) => void
}

export function ParkingTransportMap({
  location,
  transportInfo,
  isEditable = false,
  onToggleParking,
}: ParkingTransportMapProps) {
  const [viewAsVisitor, setViewAsVisitor] = useState(false)
  const [parkingEnabled, setParkingEnabled] = useState(transportInfo.parkingAvailable || false)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    if (location) {
      console.log("[v0] Location changed, reloading map:", location)
      setMapKey((prev) => prev + 1)
    }
  }, [location])

  const handleParkingToggle = (checked: boolean) => {
    setParkingEnabled(checked)
    onToggleParking?.(checked)
  }

  const calculateWalkingTime = (distance: string) => {
    const meters = Number.parseInt(distance)
    if (isNaN(meters)) return "? min"
    const minutes = Math.round((meters / 1000) * 12)
    return { minutes: `${minutes} min`, distance: `${meters} m` }
  }

  const buildMapUrl = () => {
    const encodedLocation = encodeURIComponent(location)

    // If there's a bus stop, show directions from event to bus stop
    if (transportInfo.bushalteName && location) {
      const encodedBusStop = encodeURIComponent(transportInfo.bushalteName)
      return `https://maps.google.com/maps?saddr=${encodedLocation}&daddr=${encodedBusStop}&dirflg=w&output=embed`
    }

    // Otherwise just show the location
    return `https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  return (
    <div className="space-y-4 bg-white rounded-3xl p-6 border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#0A1A2F]">Parkeren & Vervoer</h3>
        {isEditable && (
          <div className="flex items-center gap-2">
            <Label htmlFor="visitor-view" className="text-sm text-gray-600">
              Bekijk als bezoeker
            </Label>
            <Switch
              id="visitor-view"
              checked={viewAsVisitor}
              onCheckedChange={setViewAsVisitor}
              className="data-[state=checked]:bg-[#00BCD4]"
            />
          </div>
        )}
      </div>

      {/* Parking Toggle */}
      {isEditable && (
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-lg font-semibold text-[#0A1A2F]">Parkeren mogelijk?</span>
          <Switch
            checked={parkingEnabled}
            onCheckedChange={handleParkingToggle}
            className="data-[state=checked]:bg-[#00BCD4]"
          />
        </div>
      )}

      <p className="text-gray-600 text-sm">
        {transportInfo.bushalteName
          ? "De kaart toont de wandelroute van het event naar de dichtstbijzijnde bushalte."
          : "Klik op de kaart om parkeerplaatsen, bushaltes of stations toe te voegen."}
      </p>

      <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200 relative">
        <iframe
          key={mapKey}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={buildMapUrl()}
          allowFullScreen
          title="Event location map"
        ></iframe>

        {/* Address overlay badge */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 max-w-[calc(100%-2rem)] z-10">
          <MapPin className="w-5 h-5 text-[#2070FF] flex-shrink-0" />
          <span className="text-sm font-medium text-[#0A1A2F] truncate">{location}</span>
        </div>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parking Card */}
        {parkingEnabled && (
          <div className="rounded-2xl border-4 border-[#4CAF50] p-4 space-y-3 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-[#0A1A2F]">Parkeren</h4>
                <p className="text-sm text-gray-600">{transportInfo.parkingDetails || "Gratis parkeren op straat"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">1 min lopen (120 m)</span>
            </div>
          </div>
        )}

        {/* Bus Stop Card */}
        {transportInfo.bushalteName && (
          <div className="rounded-2xl border-4 border-[#FF9800] p-4 space-y-3 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FF9800] flex items-center justify-center flex-shrink-0">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-[#0A1A2F]">Bushalte</h4>
                <p className="text-sm text-gray-600">{transportInfo.bushalteName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {transportInfo.bushalteDistance
                  ? (() => {
                      const walkInfo = calculateWalkingTime(transportInfo.bushalteDistance)
                      return `${walkInfo.minutes} lopen (${walkInfo.distance})`
                    })()
                  : "2 min lopen (180 m)"}
              </span>
            </div>
          </div>
        )}

        {/* Station Cards */}
        {transportInfo.stationName && (
          <>
            <div className="rounded-2xl border-4 border-[#673AB7] p-4 space-y-3 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#673AB7] flex items-center justify-center flex-shrink-0">
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-[#0A1A2F]">Station</h4>
                  <p className="text-sm text-gray-600">{transportInfo.stationName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {transportInfo.stationDistance
                    ? (() => {
                        const walkInfo = calculateWalkingTime(transportInfo.stationDistance)
                        return `${walkInfo.minutes} lopen (${walkInfo.distance})`
                      })()
                    : "7 min lopen (550 m)"}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border-4 border-[#673AB7] p-4 space-y-3 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#673AB7] flex items-center justify-center flex-shrink-0">
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-[#0A1A2F]">Station</h4>
                  <p className="text-sm text-gray-600">{transportInfo.stationName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {transportInfo.stationDistance
                    ? (() => {
                        const walkInfo = calculateWalkingTime(transportInfo.stationDistance)
                        return `${walkInfo.minutes} lopen (${walkInfo.distance})`
                      })()
                    : "7 min lopen (550 m)"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mapbox Attribution */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
        <MapPin className="w-4 h-4 text-[#2070FF]" />
        <span>Kaartgegevens van: Mapbox</span>
      </div>
    </div>
  )
}
