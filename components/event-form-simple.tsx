"use client"

import { useRef } from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Clock, Sparkles, CheckCircle2, Type, FileText } from "lucide-react"
import { saveEvent } from "@/lib/storage"
import { EVENT_TYPES } from "@/lib/types"
import type { EventType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const SIMPLE_TYPES: EventType[] = [
  "party", "birthday", "wedding", "babyshower",
  "newyear", "christmas", "halloween", "kingsday",
  "gamenight", "movienight", "vrijmibo", "surprise",
]

export function EventFormSimple() {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [postcode, setPostcode] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)
  const [selectedType, setSelectedType] = useState<EventType>("party")
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const typeRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Search addresses as user types in location via our server-side proxy
  useEffect(() => {
    const query = location.trim()
    if (query.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }
    // Don't search again if the user just selected a suggestion
    if (resolvedAddress && location === resolvedAddress) return

    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      setIsSearchingAddress(true)
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setAddressSuggestions(data)
            setShowSuggestions(true)
          } else {
            setShowSuggestions(false)
          }
        }
      } catch {
        // Aborted or failed — ignore
      } finally {
        setIsSearchingAddress(false)
      }
    }, 500)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [location, resolvedAddress])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Lookup address from postcode + house number via our server-side proxy
  const lookupAddress = useCallback(async (pc: string, nr: string) => {
    const cleanPostcode = pc.replace(/\s/g, "").toUpperCase()
    if (!/^\d{4}[A-Z]{2}$/.test(cleanPostcode) || !nr.trim()) {
      setResolvedAddress("")
      return
    }
    setIsLookingUp(true)
    try {
      const res = await fetch(`/api/geocode?postcode=${encodeURIComponent(cleanPostcode)}&number=${encodeURIComponent(nr.trim())}`)
      if (res.ok) {
        const data = await res.json()
        if (data.address) {
          setResolvedAddress(data.address)
          setLocation(data.address)
          setShowSuggestions(false)
        } else {
          setResolvedAddress("")
        }
      } else {
        setResolvedAddress("")
      }
    } catch {
      setResolvedAddress("")
    } finally {
      setIsLookingUp(false)
    }
  }, [])

  useEffect(() => {
    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase()
    if (/^\d{4}[A-Z]{2}$/.test(cleanPostcode) && houseNumber.trim()) {
      const timeout = setTimeout(() => {
        lookupAddress(postcode, houseNumber)
      }, 500)
      return () => clearTimeout(timeout)
    }
    if (!postcode && !houseNumber) {
      setResolvedAddress("")
    }
  }, [postcode, houseNumber, lookupAddress])

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: "Vul een titel in", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    // Gebruik standaardwaarden als velden niet ingevuld zijn
    const eventDate = date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const eventTime = time || "20:00"
    const eventLocation = location.trim() || "Nog te bepalen"

    const event = {
      id: `event_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      postcode: postcode.trim() || undefined,
      houseNumber: houseNumber.trim() || undefined,
      eventType: selectedType,
      theme: EVENT_TYPES[selectedType].theme,
      coverImage: "/party-celebration-colorful-balloons.jpg",
      hostName: "Organisator",
      hostId: `host_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      privacy: "link-only" as const,
      guests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      partyFields: {},
      invitationCustomization: {},
    }

    await saveEvent(event)

    toast({
      title: "Event aangemaakt!",
      description: "Je wordt doorgestuurd naar het beheerscherm.",
    })

    router.push(`/events/${event.id}/manage`)
  }

  const isValid = title.trim().length > 0

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2070FF] to-[#06B6D4] p-6 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Nieuw Event</h2>
          </div>
          <p className="text-white/80 text-sm">Vul de basis in, details voeg je daarna toe</p>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-5 -mt-4">
          {/* Event Type */}
          <div className="space-y-2" ref={typeRef}>
            <Label className="text-sm font-medium text-gray-700">Type event</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#2070FF] transition-all flex items-center justify-between text-[#0A1A2F]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{EVENT_TYPES[selectedType]?.emoji}</span>
                  <span className="font-medium text-sm">{EVENT_TYPES[selectedType]?.label}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${typeDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {typeDropdownOpen && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                  {SIMPLE_TYPES.map((type) => {
                    const typeData = EVENT_TYPES[type]
                    if (!typeData) return null
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedType(type)
                          setTypeDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-gray-50 last:border-b-0 ${
                          selectedType === type
                            ? "bg-[#2070FF]/5"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-xl">{typeData.emoji}</span>
                        <span className={`text-sm font-medium ${selectedType === type ? "text-[#2070FF]" : "text-[#0A1A2F]"}`}>
                          {typeData.label}
                        </span>
                        {selectedType === type && (
                          <CheckCircle2 className="ml-auto w-4 h-4 text-[#2070FF]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4 text-[#2070FF]" />
              Titel
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Verjaardag Lisa"
              className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2070FF]" />
              Korte omschrijving
              <span className="text-xs text-gray-400">(optioneel)</span>
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bijv. We vieren mijn 25e verjaardag!"
              className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2070FF]" />
                Datum
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2070FF]" />
                Tijd
              </Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2" ref={locationRef}>
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2070FF]" />
              Locatie
            </Label>
            <div className="relative">
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setResolvedAddress("")
                }}
                onFocus={() => {
                  if (addressSuggestions.length > 0) setShowSuggestions(true)
                }}
                placeholder="Begin te typen... bijv. Damrak, Amsterdam"
                className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all pr-10"
              />
              {isSearchingAddress && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-[#2070FF] rounded-full animate-spin block" />
                </div>
              )}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {addressSuggestions.map((suggestion, idx) => (
                    <button
                      key={`${suggestion.lat}-${suggestion.lon}-${idx}`}
                      type="button"
                      onClick={() => {
                        setLocation(suggestion.display_name)
                        setResolvedAddress(suggestion.display_name)
                        setShowSuggestions(false)
                        setAddressSuggestions([])
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#2070FF]/5 flex items-start gap-3 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-[#2070FF] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#0A1A2F] leading-snug">{suggestion.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Postcode (optioneel)"
                className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
              />
              <Input
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Huisnummer (optioneel)"
                className="rounded-xl border-gray-200 bg-gray-50 text-[#0A1A2F] h-12 focus:bg-white focus:border-[#2070FF] transition-all"
              />
            </div>
            {isLookingUp && (
              <div className="flex items-center gap-2 text-sm text-gray-400 px-1">
                <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#2070FF] rounded-full animate-spin" />
                Adres opzoeken...
              </div>
            )}
            {resolvedAddress && !isLookingUp && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resolvedAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#2070FF]/5 border border-[#2070FF]/20 rounded-xl px-4 py-3 hover:bg-[#2070FF]/10 hover:border-[#2070FF]/40 transition-all cursor-pointer group"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2070FF] flex-shrink-0" />
                <span className="text-sm text-[#0A1A2F] font-medium flex-1">{resolvedAddress}</span>
                <MapPin className="w-4 h-4 text-[#2070FF] opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            onClick={handleCreate}
            disabled={!isValid || isSubmitting}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2070FF] to-[#06B6D4] hover:from-[#1860E0] hover:to-[#05A3C0] text-white font-semibold text-lg shadow-lg shadow-[#2070FF]/25 disabled:opacity-40 disabled:shadow-none transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Event aanmaken...
              </span>
            ) : (
              "Event Aanmaken"
            )}
          </Button>

          {/* Helper text */}
          <p className="text-center text-xs text-gray-400">
            Na het aanmaken kun je extra details toevoegen zoals muziek, dresscode en meer
          </p>
        </div>
      </div>
    </div>
  )
}
