"use client"

import type React from "react"
import { CheckCircle2 } from "lucide-react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Check,
  HelpCircle,
  X,
  Share2,
  Trash2,
  Download,
  UserPlus,
  Camera,
  Upload,
  ImageIcon,
  Music,
  ShoppingCart,
  Gift,
  Shirt,
  Dice5,
  ChevronDown,
  Plus,
  Sparkles,
} from "lucide-react"
import type { Event } from "@/lib/types"
import { getEvent, deleteEvent, saveEvent } from "@/lib/storage"
import { GuestList } from "@/components/guest-list"
import { ShareDialog } from "@/components/share-dialog"
import { CostCalculator } from "@/components/cost-calculator"
import { AIAssistant } from "@/components/ai-assistant"
import { exportGuestsToCSV, exportToCalendar } from "@/lib/export"
import { AfterMovieGenerator } from "@/components/aftermovie-generator"
import { DatePickerPoll } from "@/components/date-picker-poll"
import { ShoppingList } from "@/components/shopping-list"
import { GuestApprovalPanel } from "@/components/guest-approval-panel"
import { InvitationDesigner } from "@/components/invitation-designer"
import { Mail } from "lucide-react"
import { InvitePeopleSection } from "@/components/invite-people-section" // Import InvitePeopleSection

interface EventManagementProps {
  event: Event
}

interface ModuleConfig {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}

const AVAILABLE_MODULES: ModuleConfig[] = [
  { id: "invitation", label: "Uitnodiging maken", description: "Ontwerp een mooie uitnodiging met tekst, stickers en animaties", icon: <Mail className="w-5 h-5" />, color: "text-indigo-500" },
  { id: "music", label: "Muziek / Playlist", description: "Spotify playlist of muziekgenre toevoegen", icon: <Music className="w-5 h-5" />, color: "text-green-500" },
  { id: "shopping", label: "Boodschappenlijst", description: "Items die meegenomen moeten worden", icon: <ShoppingCart className="w-5 h-5" />, color: "text-orange-500" },
  { id: "wishlist", label: "Verlanglijstje", description: "Cadeautips voor gasten", icon: <Gift className="w-5 h-5" />, color: "text-pink-500" },
  { id: "dresscode", label: "Dresscode", description: "Kledingvoorschriften instellen", icon: <Shirt className="w-5 h-5" />, color: "text-purple-500" },
  { id: "secretsanta", label: "Lootjes trekken", description: "Secret Santa of cadeauloting", icon: <Dice5 className="w-5 h-5" />, color: "text-red-500" },
  { id: "photos", label: "Fotoalbum", description: "Foto's uploaden en aftermovie maken", icon: <Camera className="w-5 h-5" />, color: "text-blue-500" },
  { id: "costs", label: "Kosten delen", description: "Uitgaven bijhouden en verdelen", icon: <ShoppingCart className="w-5 h-5" />, color: "text-emerald-500" },
]

const DRESSCODE_OPTIONS = ["Casual", "Smart Casual", "Formeel", "Black Tie", "Wit", "Zwart", "Kleurrijk", "Thema"]

export function EventManagement({ event: initialEvent }: EventManagementProps) {
  const router = useRouter()
  const [event, setEvent] = useState<Event>(() => {
    if (!initialEvent) {
      return {} as Event
    }
    return {
      ...initialEvent,
      guests: Array.isArray(initialEvent.guests) ? initialEvent.guests : [],
      photos: Array.isArray(initialEvent.photos) ? initialEvent.photos : [],
      costs: Array.isArray(initialEvent.costs) ? initialEvent.costs : [],
    }
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [showAfterMovie, setShowAfterMovie] = useState(false)
  const [showModuleSelector, setShowModuleSelector] = useState(false)
  const [activeModules, setActiveModules] = useState<string[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  // Module-specific state
  const [invitationCustomization, setInvitationCustomization] = useState(
    event.invitationCustomization || {
      titleAnimation: "none" as const,
      titleStyle: "none" as const,
      titleFont: "none" as const,
      titlePosition: "center" as const,
      subtitleText: "",
      stickers: [],
    }
  )
  const [invitationTitle, setInvitationTitle] = useState(event.title)
  const [invitationCoverImage, setInvitationCoverImage] = useState(event.coverImage || "")
  const [spotifyUrl, setSpotifyUrl] = useState(event.partyFields?.spotifyPlaylistUrl || "")
  const [selectedDresscode, setSelectedDresscode] = useState<string[]>(
    event.partyFields?.dresscode ? (Array.isArray(event.partyFields.dresscode) ? event.partyFields.dresscode : [event.partyFields.dresscode]) : []
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEvent = getEvent(event.id)
      if (updatedEvent) {
        setEvent({
          ...updatedEvent,
          guests: Array.isArray(updatedEvent.guests) ? updatedEvent.guests : [],
          photos: Array.isArray(updatedEvent.photos) ? updatedEvent.photos : [],
          costs: Array.isArray(updatedEvent.costs) ? updatedEvent.costs : [],
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [event.id])

  const handleDelete = () => {
    deleteEvent(event.id)
    router.push("/dashboard")
  }

  const handleExportCSV = () => {
    exportGuestsToCSV(event)
    setShowExportMenu(false)
  }

  const handleExportCalendar = () => {
    exportToCalendar(event)
    setShowExportMenu(false)
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

  const toggleModule = (moduleId: string) => {
    if (activeModules.includes(moduleId)) {
      setActiveModules(activeModules.filter((m) => m !== moduleId))
      setExpandedModules(expandedModules.filter((m) => m !== moduleId))
    } else {
      setActiveModules([...activeModules, moduleId])
      setExpandedModules([...expandedModules, moduleId])
      setShowModuleSelector(false)
    }
  }

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules(
      expandedModules.includes(moduleId)
        ? expandedModules.filter((m) => m !== moduleId)
        : [...expandedModules, moduleId]
    )
  }

  const handleSaveInvitation = () => {
    const updatedEvent = {
      ...event,
      invitationCustomization,
      title: invitationTitle,
      coverImage: invitationCoverImage,
    }
    saveEvent(updatedEvent)
    setEvent(updatedEvent)
  }

  const handleSaveSpotify = () => {
    const updatedEvent = {
      ...event,
      partyFields: { ...event.partyFields, spotifyPlaylistUrl: spotifyUrl },
    }
    saveEvent(updatedEvent)
    setEvent(updatedEvent)
  }

  const handleSaveDresscode = () => {
    const updatedEvent = {
      ...event,
      partyFields: { ...event.partyFields, dresscode: selectedDresscode.join(", ") },
    }
    saveEvent(updatedEvent)
    setEvent(updatedEvent)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhoto(true)

    try {
      const newPhotos: any[] = []
      let processedCount = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is te groot. Maximaal 5MB per foto toegestaan.`)
          continue
        }

        const reader = new FileReader()

        reader.onload = (readEvent) => {
          const base64String = readEvent.target?.result as string

          newPhotos.push({
            id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: base64String,
            uploadedBy: "Host",
            uploadedAt: new Date(),
          })

          processedCount++

          if (processedCount === files.length) {
            const updatedPhotos = [...(event.photos || []), ...newPhotos]
            const updatedEvent = { ...event, photos: updatedPhotos }

            const allEvents = JSON.parse(localStorage.getItem("plannify_events") || "[]")
            const eventIndex = allEvents.findIndex((e: any) => e.id === event.id)
            if (eventIndex !== -1) {
              allEvents[eventIndex] = updatedEvent
              localStorage.setItem("plannify_events", JSON.stringify(allEvents))
            }

            setEvent(updatedEvent)
            setUploadingPhoto(false)
          }
        }

        reader.onerror = () => {
          processedCount++
          if (processedCount === files.length) {
            setUploadingPhoto(false)
          }
        }

        reader.readAsDataURL(file)
      }
    } catch (error) {
      alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
      setUploadingPhoto(false)
    }
  }

  const guests = Array.isArray(event.guests) ? event.guests : []

  const guestCounts = {
    yes: guests.filter((g) => g.status === "yes").length,
    maybe: guests.filter((g) => g.status === "maybe").length,
    no: guests.filter((g) => g.status === "no").length,
  }

  const totalResponded = guestCounts.yes + guestCounts.maybe + guestCounts.no
  const totalWithPlusOnes = guests.filter((g) => g.status === "yes").reduce((acc, g) => acc + (g.plusOne ? 2 : 1), 0)
  const responseRate = guests.length > 0 ? Math.round((totalResponded / guests.length) * 100) : 0

  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case "invitation":
        return (
          <div className="space-y-4">
            <InvitationDesigner
              title={invitationTitle}
              coverImage={invitationCoverImage}
              customization={invitationCustomization}
              onCustomizationChange={setInvitationCustomization}
              onTitleChange={setInvitationTitle}
              onCoverImageChange={setInvitationCoverImage}
              eventType={event.eventType}
              eventDate={event.date}
              eventTime={event.time}
              eventLocation={event.location}
              dresscode={selectedDresscode}
            />
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSaveInvitation}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              >
                Uitnodiging opslaan
              </Button>
              <Button
                onClick={() => {
                  handleSaveInvitation()
                  const eventUrl = typeof window !== "undefined"
                    ? `${window.location.origin}/events/${event.id}`
                    : ""
                  if (eventUrl) {
                    const text = `Je bent uitgenodigd voor ${invitationTitle}!\n\n${eventUrl}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
                  }
                }}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl gap-2"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        )
      case "music":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Spotify Playlist URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
                />
                <Button onClick={handleSaveSpotify} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5">
                  Opslaan
                </Button>
              </div>
            </div>
            {spotifyUrl && (
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src={spotifyUrl.replace("/playlist/", "/embed/playlist/")}
                  width="100%"
                  height="152"
                  allow="encrypted-media"
                  className="rounded-xl"
                />
              </div>
            )}
          </div>
        )

      case "shopping":
        return <ShoppingList event={event} isHost={true} />

      case "wishlist":
        return (
          <div className="text-center py-8 text-gray-400">
            <Gift className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Verlanglijstje wordt binnenkort beschikbaar</p>
            <p className="text-xs text-gray-500 mt-1">Gasten kunnen hier cadeautips bekijken</p>
          </div>
        )

      case "dresscode":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Selecteer een of meerdere dresscodes - verschijnt direct op de uitnodiging</p>
            <div className="flex flex-wrap gap-2">
              {DRESSCODE_OPTIONS.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    const newDresscode = selectedDresscode.includes(code)
                      ? selectedDresscode.filter((d) => d !== code)
                      : [...selectedDresscode, code]
                    setSelectedDresscode(newDresscode)
                    // Direct opslaan zodat het gelijk op de uitnodiging verschijnt
                    const updatedEvent = {
                      ...event,
                      partyFields: {
                        ...event.partyFields,
                        dresscode: newDresscode,
                      },
                    }
                    saveEvent(updatedEvent)
                    setEvent(updatedEvent)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDresscode.includes(code)
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            {selectedDresscode.length > 0 && (
              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm text-purple-300">Dresscode wordt getoond op de uitnodiging: <strong>{selectedDresscode.join(", ")}</strong></span>
              </div>
            )}
          </div>
        )

      case "secretsanta":
        return (
          <div className="text-center py-8">
            <Link href="/secret-santa">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2">
                <Dice5 className="w-4 h-4" />
                Ga naar Lootjes Trekken
              </Button>
            </Link>
            <p className="text-xs text-gray-500 mt-3">Organiseer een Secret Santa voor dit event</p>
          </div>
        )

      case "photos":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{event.photos?.length || 0} foto{"'"}s geupload</p>
              <label htmlFor="photo-upload-module" className="cursor-pointer">
                <Button variant="outline" className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl" disabled={uploadingPhoto} asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    {uploadingPhoto ? "Uploaden..." : "Upload"}
                  </span>
                </Button>
              </label>
              <input
                id="photo-upload-module"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </div>

            {event.photos && event.photos.length > 0 ? (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {event.photos.slice(0, 8).map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt="Event foto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setShowAfterMovie(true)}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Camera className="w-4 h-4" />
                  Genereer Aftermovie
                </Button>
              </>
            ) : (
              <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">
                <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Nog geen foto{"'"}s</p>
              </div>
            )}
          </div>
        )

      case "costs":
        return <CostCalculator event={event} onUpdate={setEvent} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#09091C]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#09091C]/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-white/20 text-white hover:bg-white/10"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delen</span>
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              {showExportMenu && (
                <Card className="absolute right-0 mt-2 w-48 p-2 shadow-lg z-50 bg-[#1B1B47] border-white/10">
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-sm"
                  >
                    Gastenlijst (CSV)
                  </button>
                  <button
                    onClick={handleExportCalendar}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-sm"
                  >
                    Agenda (ICS)
                  </button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-[10px] font-semibold text-[#2070FF]/70 uppercase text-card">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Event Header Card */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="h-48">
              <img
                src={event.coverImage || "/placeholder.svg?height=200&width=800"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09091C] via-[#09091C]/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
              {event.description && <p className="text-white/60 mt-1">{event.description}</p>}
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-[#1B1B47]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4 bg-[#2070FF]/10 border border-[#2070FF]/20 rounded-xl p-4">
              <div className="w-14 h-14 rounded-xl bg-[#2070FF]/20 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-[#2070FF] leading-none text-card">{new Date(event.date).getDate()}</span>
                <span className="text-[10px] font-semibold text-[#2070FF]/70 uppercase text-card">{new Date(event.date).toLocaleDateString("nl-NL", { month: "short" })}</span>
              </div>
              <div>
                <p className="text-xs text-white/50">Datum</p>
                <p className="font-bold text-white text-lg leading-tight">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <p className="text-xs text-white/50">Tijd</p>
                  <p className="text-base font-semibold text-white">{event.time} uur</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/50">Locatie</p>
                  <p className="text-base font-semibold text-white truncate">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensen Uitnodigen */}
          <InvitePeopleSection event={event} />

          {event.dateOptions && event.dateOptions.length > 0 && <DatePickerPoll event={event} isHost={true} />}
          <GuestApprovalPanel event={event} onUpdate={setEvent} />

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">{guestCounts.yes}</p>
              <p className="text-xs text-white/50">Komt</p>
            </div>
            <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                <HelpCircle className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">{guestCounts.maybe}</p>
              <p className="text-xs text-white/50">Misschien</p>
            </div>
            <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                <X className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white">{guestCounts.no}</p>
              <p className="text-xs text-white/50">Komt niet</p>
            </div>
            <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{totalWithPlusOnes}</p>
              <p className="text-xs text-white/50">Totaal</p>
            </div>
          </div>

          {/* Guest List */}
          <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Gastenlijst</h2>
              <span className="text-sm text-card">
                {totalResponded}/{guests.length} gereageerd ({responseRate}%)
              </span>
            </div>
            <GuestList guests={guests} />
          </div>

          {/* Active Modules */}
          {activeModules.map((moduleId) => {
            const config = AVAILABLE_MODULES.find((m) => m.id === moduleId)
            if (!config) return null
            const isExpanded = expandedModules.includes(moduleId)

            return (
              <div key={moduleId} className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleExpanded(moduleId)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={config.color}>{config.icon}</div>
                    <h3 className="text-lg font-semibold text-white">{config.label}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleModule(moduleId)
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Verwijder
                    </button>
                    <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    {renderModuleContent(moduleId)}
                  </div>
                )}
              </div>
            )
          })}

          {/* Wat wil je toevoegen? */}
          {AVAILABLE_MODULES.filter((m) => !activeModules.includes(m.id)).length > 0 && (
            <div className="bg-gradient-to-br from-[#2070FF]/10 to-[#06B6D4]/10 border border-[#2070FF]/20 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-1">Wat wil je toevoegen?</h3>
              <p className="text-sm text-white/50 mb-4">Maak je event compleet met extra opties</p>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_MODULES.filter((m) => !activeModules.includes(m.id)).map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1B1B47] border-2 border-white/15 hover:border-[#2070FF] hover:bg-[#2070FF]/10 transition-all text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${module.color}`}>
                      {module.icon}
                    </div>
                    <p className="font-semibold text-white text-sm">{module.label}</p>
                    <p className="text-xs text-white/50 leading-tight">{module.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {AVAILABLE_MODULES.filter((m) => !activeModules.includes(m.id)).length === 0 && (
            <div className="bg-[#1B1B47]/50 border border-white/10 rounded-2xl p-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
              <p className="text-white font-medium">Alles toegevoegd</p>
              <p className="text-sm text-white/50">Je hebt alle beschikbare opties al ingeschakeld</p>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-[#1B1B47]/50 border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 text-red-400">Danger Zone</h3>
            {!showDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4" />
                Event Verwijderen
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-white/60">
                  Weet je zeker dat je dit event wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Annuleren
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    Ja, verwijder event
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Share Dialog */}
      <ShareDialog event={event} open={showShareDialog} onOpenChange={setShowShareDialog} />

      {/* AfterMovie Generator */}
      <AfterMovieGenerator event={event} open={showAfterMovie} onClose={() => setShowAfterMovie(false)} />

      <AIAssistant event={event} context="manage" />
    </div>
  )
}
