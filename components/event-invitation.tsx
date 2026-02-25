"use client"

import type React from "react"
import { OutfitInspiration } from "@/components/outfit-inspiration"
import { GiftTips } from "@/components/gift-tips"
import { PartyGame } from "@/components/party-game"
import { DatePickerPoll } from "@/components/date-picker-poll"
import { ParkingTransportMap } from "./parking-transport-map"
import { EventTasksShopping } from "@/components/event-tasks-shopping"
import { TikkieCostShopping } from "@/components/tikkie-cost-sharing"
import { SpotifyPlaylist } from "@/components/spotify-playlist"
import { CalendarIntegration } from "@/components/calendar-integration"
import { CountdownReminders } from "@/components/countdown-reminders"
import { EventChat } from "@/components/event-chat"
import { TransportOptions } from "@/components/transport-options"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  HelpCircle,
  UserPlus,
  Navigation,
  Wine,
  Gift,
  Briefcase,
  UtensilsCrossed,
  Music,
  CloudRain,
  Car,
  Upload,
  ImageIcon,
  Bus,
  Train,
} from "lucide-react"
import type { Event, Guest, RSVPStatus, GuestPreferences, Photo } from "@/lib/types"
import { addGuest, getEvent, updateEvent } from "@/lib/storage"
import { EVENT_TYPES } from "@/lib/types"

interface EventInvitationProps {
  event: Event
}

export function EventInvitation({ event: initialEvent }: EventInvitationProps) {
  const [event, setEvent] = useState(initialEvent)
  const [step, setStep] = useState<"rsvp" | "details" | "preferences" | "success">("rsvp")
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus | null>(null)
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState("")
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<GuestPreferences>({
    drinkPreference: "",
    contribution: "",
    role: "",
    dietaryRestrictions: "",
    needsRide: false,
    canDrive: false,
    availableSeats: 0,
    transportation: "",
    carpoolDepartureLocation: "",
    carpoolDepartureTime: "",
    transportationOther: "",
  })
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // CHANGE: Add fallback theme from EVENT_TYPES if event.theme is undefined
  const eventTheme = event.theme ||
    EVENT_TYPES[event.eventType]?.theme || {
      primaryColor: "#FF6B6B",
      accentColor: "#FFD93D",
      emoji: "🎉",
    }

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = new Date(`${event.date}T${event.time || "00:00"}`)
      const now = new Date()
      const difference = eventDateTime.getTime() - now.getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return null
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [event.date, event.time])

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEvent = getEvent(event.id)
      if (updatedEvent) {
        setEvent(updatedEvent)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [event.id])

  const handleStatusSelect = (status: RSVPStatus) => {
    setSelectedStatus(status)
    setStep("details")
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStatus === "yes") {
      setStep("preferences")
    } else {
      handleFinalSubmit()
    }
  }

  const handleFinalSubmit = async () => {
    if (!selectedStatus) return

    setLoading(true)

    try {
      const approvedCount = event.guests.filter((g) => g.approved && g.status === "yes").length
      const isApproved = !event.requireApproval || (event.maxGuests && approvedCount < event.maxGuests)

      const newGuest: Guest = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: guestName,
        email: guestEmail || undefined,
        status: selectedStatus,
        plusOne,
        plusOneName: plusOne && plusOneName ? plusOneName : undefined,
        approved: event.requireApproval ? isApproved : true,
        plusOneApproved: event.requireApproval && plusOne ? false : plusOne,
        respondedAt: new Date(),
        preferences: selectedStatus === "yes" ? preferences : undefined,
      }

      addGuest(event.id, newGuest)

      const updatedEvent = getEvent(event.id)
      if (updatedEvent) {
        setEvent(updatedEvent)
      }

      setStep("success")
    } catch (error) {
      console.error("[v0] Error submitting RSVP:", error)
      alert("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRouteLink = () => {
    const encodedLocation = encodeURIComponent(event.location)
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
  }

  const getSpotifyEmbedUrl = (url: string) => {
    const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/)
    if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`
    }
    return null
  }

  const guestCounts = {
    yes: event.guests.filter((g) => g.status === "yes").length,
    maybe: event.guests.filter((g) => g.status === "maybe").length,
    no: event.guests.filter((g) => g.status === "no").length,
  }

  const totalResponded = guestCounts.yes + guestCounts.maybe + guestCounts.no

  const carpoolStats = {
    needsRide: event.guests.filter((g) => g.status === "yes" && g.preferences?.needsRide).length,
    canDrive: event.guests.filter((g) => g.status === "yes" && g.preferences?.canDrive).length,
    totalSeats: event.guests
      .filter((g) => g.status === "yes" && g.preferences?.canDrive)
      .reduce((sum, g) => sum + (g.preferences?.availableSeats || 0), 0),
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Foto is te groot. Maximaal 5MB toegestaan.")
      return
    }

    setUploadingPhoto(true)

    try {
      const reader = new FileReader()

      reader.onload = (event) => {
        const base64String = event.target?.result as string

        const newPhoto: Photo = {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: base64String,
          uploadedBy: guestName || "Anoniem",
          uploadedAt: new Date(),
        }

        const updatedPhotos = [...(event.photos || []), newPhoto]
        const updatedEvent = { ...event, photos: updatedPhotos }

        updateEvent(event.id, updatedEvent)
        setEvent(updatedEvent)
        setUploadingPhoto(false)
      }

      reader.onerror = () => {
        console.error("[v0] Error reading file")
        alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
        setUploadingPhoto(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
      alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
      setUploadingPhoto(false)
    }
  }

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case "fade-in":
        return "animate-fade-in"
      case "slide-in":
        return "animate-slide-in"
      case "bounce":
        return "animate-bounce-in"
      case "typewriter":
        return "animate-typewriter"
      case "glow":
        return "animate-glow"
      default:
        return ""
    }
  }

  const getStyleClass = (style?: string) => {
    switch (style) {
      case "gradient":
        return "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
      case "shadow":
        return "drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
      case "outline":
        return "text-stroke"
      case "glow":
        return "text-glow"
      case "3d":
        return "text-3d"
      default:
        return ""
    }
  }

  const getFontClass = (font?: string) => {
    switch (font) {
      case "poppins":
        return "font-sans"
      case "playfair":
        return "font-serif"
      case "dancing":
        return "font-cursive"
      case "bebas":
        return "font-display"
      default:
        return "font-sans"
    }
  }

  const getPositionClass = (position?: string) => {
    switch (position) {
      case "top":
        return "items-start pt-12"
      case "center":
        return "items-center"
      case "bottom":
        return "items-end pb-12"
      default:
        return "items-center"
    }
  }

  const getStickerSize = (size: number) => {
    switch (size) {
      case 1:
        return "text-3xl"
      case 2:
        return "text-5xl"
      case 3:
        return "text-7xl"
      default:
        return "text-5xl"
    }
  }

  const getThemeColor = () => {
    return eventTheme.primaryColor
  }

  return (
    <div
      className={`min-h-screen theme- bg-sky-700${event.eventType}`}
      style={{
        background: `linear-gradient(135deg, ${eventTheme.primaryColor}10 0%, ${eventTheme.accentColor}10 100%)`,
      }}
    >
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img
          src={event.coverImage || "/placeholder.svg?height=400&width=800"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {event.invitationCustomization ? (
          <div
            className={`absolute inset-0 flex flex-col justify-center ${getPositionClass(event.invitationCustomization.titlePosition)} px-8`}
          >
            <h1
              className={`text-4xl md:text-6xl font-bold text-center ${getAnimationClass(event.invitationCustomization.titleAnimation)} ${getStyleClass(event.invitationCustomization.titleStyle)} ${getFontClass(event.invitationCustomization.titleFont)}`}
              style={{ color: event.invitationCustomization.titleColor || "white" }}
            >
              {event.invitationCustomization.invitationTitle || event.title}
            </h1>
            {event.invitationCustomization.subtitleText && (
              <p
                className={`text-xl md:text-2xl text-center mt-4 ${getAnimationClass(event.invitationCustomization.subtitleAnimation)}`}
                style={{ color: event.invitationCustomization.titleColor || "white", opacity: 0.9 }}
              >
                {event.invitationCustomization.subtitleText}
              </p>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-8 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              {event.title}
            </h1>
          </div>
        )}

        {event.invitationCustomization?.stickers?.map((sticker) => (
          <div
            key={sticker.id}
            className={`absolute pointer-events-none ${getStickerSize(sticker.size)} drop-shadow-lg`}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
              zIndex: 10,
            }}
          >
            {sticker.emoji}
          </div>
        ))}

        <div
          className="absolute top-4 right-4 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
          style={{ backgroundColor: `${eventTheme.primaryColor}20`, border: `2px solid ${eventTheme.primaryColor}` }}
        >
          <span className="text-2xl">{eventTheme.emoji}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="max-w-2xl mx-auto">
          {timeLeft && (
            <Card
              className="p-6 mb-6 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${eventTheme.primaryColor}15 0%, ${eventTheme.accentColor}15 100%)`,
              }}
            >
              <h3 className="text-center text-sm font-semibold text-muted-foreground mb-3">EVENT BEGINT OVER</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">Dagen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Uren</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minuten</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Seconden</div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-8 mb-6 shadow-lg">
            <div className="space-y-3 mb-6">
              {event.dateOptions && event.dateOptions.length > 0 ? (
                <div className="mb-6">
                  <DatePickerPoll event={event} guestName={guestName} isHost={false} />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="text-lg">{formatDate(event.date)}</span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-lg">{event.time}</span>
                  </div>
                </>
              )}

              <div
                className="space-y-3 p-4 bg-muted/30 rounded-lg border-2"
                style={{ borderColor: `${eventTheme.primaryColor}40` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-white" />
                    <div>
                      <p className="font-semibold text-foreground">{event.location}</p>
                      <p className="text-sm text-muted-foreground">Klik op de kaart voor routebeschrijving</p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.open(getRouteLink(), "_blank")}
                    style={{ backgroundColor: eventTheme.primaryColor }}
                    className="text-white"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Navigeer
                  </Button>
                </div>

                <div
                  className="w-full h-64 rounded-lg overflow-hidden border-2 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderColor: eventTheme.primaryColor }}
                  onClick={() => window.open(getRouteLink(), "_blank")}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, pointerEvents: "none" }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(event.location)}&zoom=15`}
                    allowFullScreen
                  ></iframe>
                </div>

                {event.eventType === "party" && (
                  <div className="flex items-start gap-2 p-3 bg-background rounded-md">
                    <Car className="w-4 h-4 mt-0.5 text-white" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Parkeren</p>
                      <p className="text-xs text-muted-foreground">
                        Tip: Gebruik de carpool optie hieronder of check Google Maps voor parkeerplaatsen in de buurt
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CHANGE: Added transport info section with visual distances */}
              {event.transportInfo &&
                (event.transportInfo.distanceToBusStop || event.transportInfo.distanceToStation) && (
                  <div
                    className="space-y-3 p-4 bg-muted/30 rounded-lg border-2"
                    style={{ borderColor: `${eventTheme.primaryColor}40` }}
                  >
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Navigation className="w-5 h-5" style={{ color: eventTheme.primaryColor }} />
                      Openbaar Vervoer
                    </h4>

                    <div className="space-y-3">
                      {event.transportInfo.distanceToBusStop && event.transportInfo.busStopName && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${eventTheme.primaryColor}20` }}
                            >
                              <Bus className="w-5 h-5" style={{ color: eventTheme.primaryColor }} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{event.transportInfo.busStopName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-1 bg-gray-200 rounded-full flex-1 max-w-[100px]">
                                  <div
                                    className="h-1 rounded-full"
                                    style={{
                                      width: `${Math.min(Number.parseInt(event.transportInfo.distanceToBusStop) / 10, 100)}%`,
                                      backgroundColor: eventTheme.primaryColor,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {event.transportInfo.distanceToBusStop}m lopen
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="w-full h-48 rounded-lg overflow-hidden border-2"
                            style={{ borderColor: eventTheme.primaryColor }}
                          >
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(event.transportInfo.busStopName)}&destination=${encodeURIComponent(event.location)}&mode=walking`}
                              allowFullScreen
                            ></iframe>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            Wandelroute van bushalte naar evenement locatie
                          </p>
                        </div>
                      )}

                      {event.transportInfo.distanceToStation && event.transportInfo.stationName && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${eventTheme.accentColor}20` }}
                            >
                              <Train className="w-5 h-5" style={{ color: eventTheme.accentColor }} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{event.transportInfo.stationName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="h-1 bg-gray-200 rounded-full flex-1 max-w-[100px]">
                                  <div
                                    className="h-1 rounded-full"
                                    style={{
                                      width: `${Math.min(Number.parseInt(event.transportInfo.distanceToStation) / 20, 100)}%`,
                                      backgroundColor: eventTheme.accentColor,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {event.transportInfo.distanceToStation}m lopen
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="w-full h-48 rounded-lg overflow-hidden border-2"
                            style={{ borderColor: eventTheme.accentColor }}
                          >
                            <iframe
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              style={{ border: 0 }}
                              src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(event.transportInfo.stationName)}&destination=${encodeURIComponent(event.location)}&mode=walking`}
                              allowFullScreen
                            ></iframe>
                          </div>
                          <p className="text-xs text-center text-muted-foreground">
                            Wandelroute van station naar evenement locatie
                          </p>
                        </div>
                      )}

                      {event.transportInfo.parkingAvailable && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${eventTheme.primaryColor}20` }}
                            >
                              <Car className="w-5 h-5" style={{ color: eventTheme.primaryColor }} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">Parkeren mogelijk</p>
                              {event.transportInfo.parkingDetails && (
                                <p className="text-sm text-muted-foreground">{event.transportInfo.parkingDetails}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-border">
                              <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=parking+near+${encodeURIComponent(event.location)}&zoom=15`}
                                allowFullScreen
                              ></iframe>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                              Parkeerplaatsen in de buurt van de evenement locatie
                            </p>
                          </div>
                          {/* </CHANGE> */}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {/* </CHANGE> */}

              {/* Transport & Parking Section - Replace old implementation */}
              {event.transportInfo &&
                (event.transportInfo.parkingAvailable ||
                  event.transportInfo.bushalteDistance ||
                  event.transportInfo.stationDistance) && (
                  <div className="mb-8">
                    <ParkingTransportMap
                      location={event.location}
                      transportInfo={event.transportInfo}
                      isEditable={false}
                    />
                    {/* </CHANGE> */}
                  </div>
                )}

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">Weerbericht</p>
                  <p className="text-xs text-blue-700">Verwacht: Zonnig, 22°C</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Users className="w-5 h-5 text-white" />
                <span className="text-lg">
                  Georganiseerd door <span className="font-semibold text-foreground">{event.hostName}</span>
                </span>
              </div>
            </div>

            {event.description && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}

            {event.eventType === "party" && event.partyFields && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wine className="w-5 h-5 text-white" />
                  Feest Details
                </h3>

                {event.partyFields.musicGenre && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Music className="w-5 h-5 mt-0.5 text-white" />
                    <div>
                      <p className="text-sm font-medium">Muziek</p>
                      <p className="text-sm text-muted-foreground">{event.partyFields.musicGenre}</p>
                    </div>
                  </div>
                )}

                {event.partyFields.dresscode && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Briefcase className="w-5 h-5 mt-0.5 text-white" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Dresscode</p>
                        <p className="text-sm text-muted-foreground">{event.partyFields.dresscode}</p>
                      </div>
                    </div>
                    {event.partyFields.outfitInspirationEnabled && (
                      <OutfitInspiration dresscode={event.partyFields.dresscode} />
                    )}
                  </div>
                )}

                {event.partyFields.bringYourOwn && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 mt-0.5 text-white" />
                    <div>
                      <p className="text-sm font-medium">Meenemen</p>
                      <p className="text-sm text-muted-foreground">{event.partyFields.bringYourOwn}</p>
                    </div>
                  </div>
                )}

                {event.partyFields.entertainment && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Gift className="w-5 h-5 mt-0.5 text-white" />
                    <div>
                      <p className="text-sm font-medium">Entertainment</p>
                      <p className="text-sm text-muted-foreground">{event.partyFields.entertainment}</p>
                    </div>
                  </div>
                )}

                {event.partyFields.giftTipsEnabled && (
                  <GiftTips eventType="party" customTips={event.partyFields.customGiftTips} />
                )}

                {event.partyFields.partyGameEnabled && (
                  <div className="mt-4">
                    <PartyGame eventType={event.eventType} />
                  </div>
                )}
              </div>
            )}

            {event.photos && event.photos.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-5 h-5 text-white" />
                  <h3 className="font-semibold text-lg">Foto's ({event.photos.length})</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {event.photos.slice(0, 6).map((photo) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt="Event foto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {event.photos.length > 6 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    +{event.photos.length - 6} meer foto's
                  </p>
                )}
              </div>
            )}

            <div className="mb-6">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <div
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors"
                  style={{ borderColor: eventTheme.primaryColor }}
                >
                  <Upload className="w-5 h-5 text-white" />
                  <span className="font-medium text-white">{uploadingPhoto ? "Uploaden..." : "Upload een foto"}</span>
                </div>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </div>

            {event.eventType === "party" && totalResponded > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">Carpool</h3>
                </div>
                <div className="space-y-1 text-sm text-green-700">
                  <p>
                    {carpoolStats.canDrive} {carpoolStats.canDrive === 1 ? "persoon kan" : "mensen kunnen"} rijden
                    {carpoolStats.totalSeats > 0 && ` (${carpoolStats.totalSeats} plekken beschikbaar)`}
                  </p>
                  {carpoolStats.needsRide > 0 && (
                    <p>
                      {carpoolStats.needsRide} {carpoolStats.needsRide === 1 ? "persoon zoekt" : "mensen zoeken"} een
                      lift
                    </p>
                  )}
                </div>
              </div>
            )}

            {totalResponded > 0 && (
              <div
                className="flex items-center gap-4 p-4 rounded-lg border-2"
                style={{
                  backgroundColor: `${eventTheme.primaryColor}10`,
                  borderColor: `${eventTheme.primaryColor}40`,
                }}
              >
                <Users className="w-5 h-5 text-white" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {guestCounts.yes} {guestCounts.yes === 1 ? "persoon komt" : "mensen komen"}
                  </p>
                  {guestCounts.maybe > 0 && (
                    <p className="text-sm text-muted-foreground">{guestCounts.maybe} misschien</p>
                  )}
                </div>
              </div>
            )}
          </Card>

          {step === "rsvp" && (
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Kom je ook?</h2>

              <div className="space-y-3">
                <Button
                  onClick={() => handleStatusSelect("yes")}
                  className="w-full py-6 text-lg text-white hover:opacity-90"
                  style={{ backgroundColor: eventTheme.primaryColor }}
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Ja, ik kom!
                </Button>

                <Button
                  onClick={() => handleStatusSelect("maybe")}
                  variant="outline"
                  className="w-full py-6 text-lg hover:opacity-90"
                  size="lg"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Misschien
                </Button>

                <Button
                  onClick={() => handleStatusSelect("no")}
                  variant="outline"
                  className="w-full py-6 text-lg hover:opacity-90"
                  size="lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Nee, helaas niet
                </Button>
              </div>
            </Card>
          )}

          {step === "details" && (
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Bijna klaar!</h2>

              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg">
                    Je naam *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Bijv. Jan Jansen"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="py-6 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Email (optioneel)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voor herinneringen"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="py-6 text-lg"
                  />
                  <p className="text-sm text-muted-foreground">We sturen je een herinnering 24u voor het event</p>
                </div>

                {selectedStatus === "yes" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <input
                        type="checkbox"
                        id="plusOne"
                        checked={plusOne}
                        onChange={(e) => setPlusOne(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <Label htmlFor="plusOne" className="text-lg cursor-pointer flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Ik breng iemand mee (+1)
                      </Label>
                    </div>

                    {plusOne && (
                      <div className="ml-8 space-y-2">
                        <Label htmlFor="plusOneName">Naam van je +1</Label>
                        <Input
                          id="plusOneName"
                          placeholder="Bijv. Maria Jansen"
                          value={plusOneName}
                          onChange={(e) => setPlusOneName(e.target.value)}
                          className="py-6"
                        />
                        {event.requireApproval && (
                          <p className="text-sm text-muted-foreground">De organisator moet je +1 goedkeuren</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("rsvp")}
                    className="flex-1 py-6 hover:opacity-90"
                    disabled={loading}
                  >
                    Terug
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-6 text-white hover:opacity-90"
                    style={{ backgroundColor: eventTheme.primaryColor }}
                    disabled={loading}
                  >
                    {selectedStatus === "yes" ? "Volgende" : "Bevestigen"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {step === "preferences" && (
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Nog een paar vragen</h2>
              <p className="text-muted-foreground mb-6">Help de organisator met de planning</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleFinalSubmit()
                }}
                className="space-y-6"
              >
                {/* CHANGE: Added prominent transportation section at the top */}
                <div className="space-y-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Hoe kom je naar het feest? *
                  </Label>

                  <div className="space-y-3">
                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setPreferences({ ...preferences, transportation: "car", canDrive: false })}
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="car"
                        checked={preferences.transportation === "car"}
                        onChange={(e) => setPreferences({ ...preferences, transportation: "car", canDrive: false })}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🚗 Met eigen auto (alleen)</Label>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setPreferences({ ...preferences, transportation: "carpool-driver", canDrive: true })
                      }
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="carpool-driver"
                        checked={preferences.transportation === "carpool-driver"}
                        onChange={(e) =>
                          setPreferences({ ...preferences, transportation: "carpool-driver", canDrive: true })
                        }
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🚙 Met auto - ik kan anderen meenemen</Label>
                    </div>

                    {preferences.transportation === "carpool-driver" && (
                      <div className="ml-8 space-y-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <Label htmlFor="seats">Hoeveel mensen kun je meenemen? *</Label>
                          <Input
                            id="seats"
                            type="number"
                            min="1"
                            max="8"
                            value={preferences.availableSeats || ""}
                            onChange={(e) =>
                              setPreferences({ ...preferences, availableSeats: Number.parseInt(e.target.value) || 0 })
                            }
                            className="w-32"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="departureLocation">Waar vertrek je? *</Label>
                          <Input
                            id="departureLocation"
                            placeholder="Bijv. Amsterdam Centraal, Postcode 1012AB"
                            value={preferences.carpoolDepartureLocation || ""}
                            onChange={(e) =>
                              setPreferences({ ...preferences, carpoolDepartureLocation: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="departureTime">Hoe laat vertrek je? *</Label>
                          <Input
                            id="departureTime"
                            type="time"
                            value={preferences.carpoolDepartureTime || ""}
                            onChange={(e) => setPreferences({ ...preferences, carpoolDepartureTime: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setPreferences({ ...preferences, transportation: "carpool-passenger", needsRide: true })
                      }
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="carpool-passenger"
                        checked={preferences.transportation === "carpool-passenger"}
                        onChange={(e) =>
                          setPreferences({ ...preferences, transportation: "carpool-passenger", needsRide: true })
                        }
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🙋 Ik zoek een lift (carpool)</Label>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setPreferences({ ...preferences, transportation: "bike" })}
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="bike"
                        checked={preferences.transportation === "bike"}
                        onChange={(e) => setPreferences({ ...preferences, transportation: "bike" })}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🚴 Met de fiets</Label>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setPreferences({ ...preferences, transportation: "walk" })}
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="walk"
                        checked={preferences.transportation === "walk"}
                        onChange={(e) => setPreferences({ ...preferences, transportation: "walk" })}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🚶 Lopend</Label>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setPreferences({ ...preferences, transportation: "public-transport" })}
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="public-transport"
                        checked={preferences.transportation === "public-transport"}
                        onChange={(e) => setPreferences({ ...preferences, transportation: "public-transport" })}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">🚆 Openbaar vervoer</Label>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted/50"
                      onClick={() => setPreferences({ ...preferences, transportation: "other" })}
                    >
                      <input
                        type="radio"
                        name="transportation"
                        value="other"
                        checked={preferences.transportation === "other"}
                        onChange={(e) => setPreferences({ ...preferences, transportation: "other" })}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1">❓ Anders</Label>
                    </div>

                    {preferences.transportation === "other" && (
                      <div className="ml-8">
                        <Input
                          placeholder="Hoe kom je dan?"
                          value={preferences.transportationOther || ""}
                          onChange={(e) => setPreferences({ ...preferences, transportationOther: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drink" className="text-lg flex items-center gap-2">
                    <Wine className="w-4 h-4" />
                    Wat drink je graag?
                  </Label>
                  <Input
                    id="drink"
                    placeholder="Bijv. Bier, Wijn, Fris, Geen alcohol"
                    value={preferences.drinkPreference}
                    onChange={(e) => setPreferences({ ...preferences, drinkPreference: e.target.value })}
                    className="py-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary" className="text-lg flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    Dieetwensen
                  </Label>
                  <Input
                    id="dietary"
                    placeholder="Bijv. Vegetarisch, Veganistisch, Glutenvrij"
                    value={preferences.dietaryRestrictions}
                    onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value })}
                    className="py-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contribution" className="text-lg flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Wat breng je mee?
                  </Label>
                  <Input
                    id="contribution"
                    placeholder="Bijv. Chips, Salades, Muziek"
                    value={preferences.contribution}
                    onChange={(e) => setPreferences({ ...preferences, contribution: e.target.value })}
                    className="py-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-lg flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Wil je helpen?
                  </Label>
                  <Input
                    id="role"
                    placeholder="Bijv. DJ, Opruimen, Decoratie"
                    value={preferences.role}
                    onChange={(e) => setPreferences({ ...preferences, role: e.target.value })}
                    className="py-6"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="flex-1 py-6 hover:opacity-90"
                    disabled={loading}
                  >
                    Terug
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 py-6 text-white hover:opacity-90"
                    style={{ backgroundColor: eventTheme.primaryColor }}
                    disabled={loading}
                  >
                    {loading ? "Bezig..." : "Bevestigen"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {step === "success" && (
            <Card className="p-8 shadow-lg text-center border-2" style={{ borderColor: eventTheme.primaryColor }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${eventTheme.primaryColor}20` }}
              >
                <Check className="w-8 h-8" style={{ color: eventTheme.primaryColor }} />
              </div>

              <h2 className="text-3xl font-bold mb-3">
                {selectedStatus === "yes" && "Gelukt! Tot dan!"}
                {selectedStatus === "maybe" && "Bedankt voor je reactie!"}
                {selectedStatus === "no" && "Jammer dat je er niet bij kunt zijn"}
              </h2>

              <p className="text-lg text-muted-foreground mb-6">
                {selectedStatus === "yes" &&
                  `We hebben je aanmelding ontvangen${plusOne ? " (inclusief +1)" : ""}. ${event.requireApproval ? "De organisator moet je aanmelding nog goedkeuren." : "Je ontvangt een herinnering 24u voor het event."}`}
                {selectedStatus === "maybe" && "We houden je op de hoogte. Je kunt je antwoord altijd nog aanpassen."}
                {selectedStatus === "no" && "Bedankt voor het laten weten. Hopelijk tot de volgende keer!"}
              </p>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Event details:</p>
                <p className="font-semibold">{event.title}</p>
                <p className="text-muted-foreground">
                  {formatDate(event.date)} om {event.time}
                </p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>

              <Button
                onClick={() => {
                  setStep("rsvp")
                  setSelectedStatus(null)
                  setGuestName("")
                  setGuestEmail("")
                  setPlusOne(false)
                  setPlusOneName("")
                  setPreferences({
                    drinkPreference: "",
                    contribution: "",
                    role: "",
                    dietaryRestrictions: "",
                    needsRide: false,
                    canDrive: false,
                    availableSeats: 0,
                    transportation: "",
                    carpoolDepartureLocation: "",
                    carpoolDepartureTime: "",
                    transportationOther: "",
                  })
                }}
                variant="outline"
                className="mt-6 hover:opacity-90"
              >
                Antwoord wijzigen
              </Button>
            </Card>
          )}

          {/* New Feature Components - Show after RSVP */}
          {step === "success" && selectedStatus === "yes" && (
            <div className="space-y-4 mt-6">
              {/* Countdown Timer */}
              <CountdownReminders
                eventTitle={event.title}
                eventDate={event.date}
                eventTime={event.time}
                isHost={false}
                primaryColor={eventTheme.primaryColor}
              />

              {/* Transport Options */}
              <TransportOptions
                eventLocation={event.location}
                eventDate={event.date}
                eventTime={event.time}
                primaryColor={eventTheme.primaryColor}
              />

              {/* Calendar Integration */}
              <CalendarIntegration
                eventTitle={event.title}
                eventDescription={event.description}
                eventDate={event.date}
                eventTime={event.time}
                eventLocation={event.location}
                primaryColor={eventTheme.primaryColor}
              />

              {/* Spotify Playlist */}
              {event.partyFields?.spotifyPlaylistUrl && (
                <SpotifyPlaylist
                  eventId={event.id}
                  playlistUrl={event.partyFields.spotifyPlaylistUrl}
                  isHost={false}
                  primaryColor={eventTheme.primaryColor}
                />
              )}

              {/* Tasks & Shopping List */}
              <EventTasksShopping
                eventId={event.id}
                guests={event.guests.filter(g => g.status === "yes").map(g => g.name)}
                isHost={false}
                primaryColor={eventTheme.primaryColor}
              />

              {/* Cost Sharing */}
              <TikkieCostShopping
                eventId={event.id}
                guests={event.guests.filter(g => g.status === "yes").map(g => g.name)}
                isHost={false}
                primaryColor={eventTheme.primaryColor}
                hostName={event.hostName}
              />
            </div>
          )}
        </div>
      </div>

      {/* Event Chat - Show after successful RSVP with "yes" */}
      {step === "success" && selectedStatus === "yes" && guestName && (
        <EventChat
          eventId={event.id}
          currentUserName={guestName}
          isHost={false}
          primaryColor={eventTheme.primaryColor}
        />
      )}
    </div>
  )
}
