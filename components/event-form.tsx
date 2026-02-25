"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Music, Camera, Upload, Plus, Share2, Copy, CheckCircle2, Sparkles, MapPin, ShoppingCart, X, Gift, Link, Minus } from "lucide-react"
import { saveEvent } from "@/lib/storage"
import { EVENT_TYPES } from "@/lib/types"
import type { EventType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ParkingTransportMap } from "./parking-transport-map"

interface EventFormProps {
  initialType?: EventType
  onComplete?: () => void // Added onComplete prop
}

const COVER_PHOTOS = [
  "/party-celebration-colorful-balloons.jpg",
  "/birthday-cake-celebration.png",
  "/music-festival-concert-crowd.jpg",
  "/dinner-party-table-food.jpg",
  "/beach-party-sunset.png",
  "/house-party-living-room.jpg",
  "/joyful-wedding-celebration.png",
  "/christmas-party-decorations.jpg",
  "/halloween-party-spooky.jpg",
  "/garden-bbq-party.jpg",
  "/tropical-theme-party.png",
  "/neon-lights-party.jpg",
]

const CATEGORIES = {
  season: {
    label: "Seizoen",
    icon: "❄️",
    types: ["newyear", "christmas", "halloween", "carnival", "kingsday", "easter", "summer"] as EventType[],
  },
  theme: {
    label: "Thema",
    icon: "🎨",
    types: [
      "blackwhite",
      "retro",
      "pajama",
      "masquerade",
      "casino",
      "tropical",
      "festival",
      "silentdisco",
    ] as EventType[],
  },
  party: {
    label: "Feest",
    icon: "🎉",
    types: [
      "party",
      "birthday",
      "sweet16",
      "babyshower",
      "genderreveal",
      "housewarming",
      "engagement",
      "bachelor",
      "wedding",
      "anniversary",
    ] as EventType[],
  },
  other: {
    label: "Anders",
    icon: "➕",
    types: [
      "gamenight",
      "movienight",
      "reunion",
      "surprise",
      "picnic",
      "vacation",
      "vrijmibo",
      "teamouting",
      "lunch",
      "productlaunch",
      "networking",
      "businessparty",
      "opening",
    ] as EventType[],
  },
}

const MUSIC_GENRES = ["Pop", "Rock", "Hip-Hop", "EDM", "Jazz", "Klassiek", "R&B", "Latin", "Techno", "House"]
const DRESSCODES = ["Casual", "Smart Casual", "Formeel", "Black Tie", "Wit", "Zwart", "Kleurrijk", "Thema"]
const BRING_SUGGESTIONS = [
  "Drankje",
  "Hapje",
  "Eigen drank",
  "Eigen eten",
  "Slaapzak",
  "Zwemkleding",
  "Handdoek",
  "Spelletjes",
  "Cadeautje",
  "Niets, alles wordt verzorgd",
]

const ENTERTAINMENT_SUGGESTIONS = [
  "DJ",
  "Live band",
  "Karaoke",
  "Spelletjes",
  "Fotobooth",
  "Magician",
  "Stand-up comedy",
  "Quiz",
  "Dance performance",
  "Live muziek",
]

const CATEGORY_KEY_MAP: Record<string, keyof typeof CATEGORIES> = {
  Seizoen: "season",
  Thema: "theme",
  Feest: "party",
  Anders: "other",
}

export function EventForm({ initialType, onComplete }: EventFormProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<EventType>(initialType || "party")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [postcode, setPostcode] = useState("")
  const [huisnummer, setHuisnummer] = useState("")
  const [addressLoading, setAddressLoading] = useState(false)
  const [streetName, setStreetName] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [coverPhoto, setCoverPhoto] = useState(COVER_PHOTOS[0])
  const [parkingAvailable, setParkingAvailable] = useState<boolean | undefined>(undefined)
  const [parkingDetails, setParkingDetails] = useState("")
  const [distanceToBusStop, setDistanceToBusStop] = useState("")
  const [busStopName, setBusStopName] = useState("")
  const [distanceToStation, setDistanceToStation] = useState("")
  const [stationName, setStationName] = useState("")

  const handleCoverPhotoClick = (photo: string) => {
    console.log("[v0] Cover photo selected:", photo)
    setCoverPhoto(photo)
  }

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [musicGenres, setMusicGenres] = useState<string[]>([])
  const [spotifyPlaylist, setSpotifyPlaylist] = useState("")
  const [dresscodes, setDresscodes] = useState<string[]>([])
  const [bringItems, setBringItems] = useState<string[]>([])
  const [entertainmentOptions, setEntertainmentOptions] = useState<string[]>([])
  
  // Benodigdheden (Supplies)
  const [supplies, setSupplies] = useState<Array<{ id: string; name: string; quantity: number; price?: number }>>([])
  const [newSupplyName, setNewSupplyName] = useState("")
  const [newSupplyQuantity, setNewSupplyQuantity] = useState(1)
  const [newSupplyPrice, setNewSupplyPrice] = useState("")
  
  // Voorbereiden (Preparation tasks)
  const [prepTasks, setPrepTasks] = useState<Array<{ id: string; task: string; quantity: number; deadline?: string; notes?: string }>>([])
  const [newPrepTask, setNewPrepTask] = useState("")
  const [newPrepQuantity, setNewPrepQuantity] = useState(1)
  const [newPrepDeadline, setNewPrepDeadline] = useState("")
  const [newPrepNotes, setNewPrepNotes] = useState("")

  // Verlanglijst (Wishlist)
  const [wishlistItems, setWishlistItems] = useState<Array<{ id: string; name: string; price?: number; link?: string; photo?: string }>>([])
  const [newWishlistName, setNewWishlistName] = useState("")
  const [newWishlistPrice, setNewWishlistPrice] = useState("")
  const [newWishlistLink, setNewWishlistLink] = useState("")
  const [newWishlistPhoto, setNewWishlistPhoto] = useState("")

  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false)
  const [dresscodeDropdownOpen, setDresscodeDropdownOpen] = useState(false)
  const [bringItemsDropdownOpen, setBringItemsDropdownOpen] = useState(false)
  const [entertainmentDropdownOpen, setEntertainmentDropdownOpen] = useState(false)

  const [animation, setAnimation] = useState<"fade-in" | "slide-in" | "bounce-in" | "none">("fade-in")
  const [textStyle, setTextStyle] = useState<"gradient" | "shadow" | "outline" | "none">("gradient")
  const [font, setFont] = useState<"poppins" | "playfair" | "dancing" | "bebas">("poppins")
  const [textColor, setTextColor] = useState<string>("#ffffff") // Changed default to hex color
  const [titleSize, setTitleSize] = useState<"small" | "medium" | "large">("large")
  const [descSize, setDescSize] = useState<"small" | "medium" | "large">("medium")
  const [descPosition, setDescPosition] = useState({ x: 0, y: 0 })
  const [stickers, setStickers] = useState<Array<{ id: string; emoji: string; x: number; y: number }>>([])
  const [photoStickers, setPhotoStickers] = useState<Array<{ id: string; url: string; x: number; y: number }>>([])
  const [dragging, setDragging] = useState<"title" | "desc" | string | null>(null)
  const [extraTexts, setExtraTexts] = useState<
    Array<{
      id: string
      text: string
      position: { x: number; y: number }
      size: "small" | "medium" | "large"
    }>
  >([])
  const { toast } = useToast()

  const [showTitle, setShowTitle] = useState(true)
  const [showDescription, setShowDescription] = useState(true)

  const [eventCreated, setEventCreated] = useState(false)
  const [eventLink, setEventLink] = useState("")
  const [createdEventId, setCreatedEventId] = useState<string | null>(null) // To store the created event ID

  const [titlePosition, setTitlePosition] = useState({ x: 0, y: 0 }) // Declare titlePosition
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null) // State for uploaded photo

  const [activeTab, setActiveTab] = useState<"animatie" | "stijl" | "font" | "positie" | "stickers">("animatie")

  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [selectedCategoryForDropdown, setSelectedCategoryForDropdown] = useState<string | null>(null)
  const [selectedEventData, setSelectedEventData] = useState(EVENT_TYPES[initialType || "party"])

  // const currentTheme = EVENT_TYPES[selectedType]?.theme || EVENT_TYPES.party.theme

  const handleCategorySelect = (category: string, type: EventType) => {
    setSelectedCategory(category)
  }

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type)
    setSelectedCategory(null)
    const eventData = EVENT_TYPES[type]
    if (eventData) {
      setSelectedEventData(eventData)
    }
    setTypeDropdownOpen(false)
  }

  const handleAddSticker = (emoji: string) => {
    const newSticker = {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 0,
      y: 0,
    }
    setStickers([...stickers, newSticker])
  }

  const handleAddPhoto = (url: string) => {
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url,
      x: 0,
      y: 0,
    }
    setPhotoStickers([...photoStickers, newPhoto])
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, element: "title" | "desc" | string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(element)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return

    const target = e.currentTarget as HTMLElement
    if (!target) return

    const rect = target.getBoundingClientRect()
    let clientX: number
    let clientY: number

    if ("touches" in e) {
      if (!e.touches[0]) return
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    requestAnimationFrame(() => {
      const x = ((clientX - rect.left) / rect.width) * 100 - 50
      const y = ((clientY - rect.top) / rect.height) * 100 - 50

      if (dragging === "title") {
        setTitlePosition({ x, y })
      } else if (dragging === "desc") {
        setDescPosition({ x, y })
      } else if (dragging.startsWith("photo-")) {
        setPhotoStickers((prev) => prev.map((photo) => (photo.id === dragging ? { ...photo, x, y } : photo)))
      } else if (dragging.startsWith("text-")) {
        setExtraTexts((prev) => prev.map((text) => (text.id === dragging ? { ...text, position: { x, y } } : text)))
      } else {
        setStickers((prev) => prev.map((sticker) => (sticker.id === dragging ? { ...sticker, x, y } : sticker)))
      }
    })
  }

  const handleDragEnd = () => {
    setDragging(null)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || "Mijn Event",
          text: description || "Kom naar mijn event!",
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link gekopieerd!",
        description: "De link is naar je klembord gekopieerd.",
        variant: "default",
      })
    }
  }

  const handlePostcodeLookup = async () => {
    console.log("[v0] Starting postcode lookup", { postcode, huisnummer })

    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase()

    if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(cleanPostcode) || !huisnummer) {
      console.log("[v0] Invalid postcode format or missing house number")
      toast({
        title: "Ongeldige invoer",
        description: "Vul een geldige postcode (bijv. 1234AB) en huisnummer in.",
        variant: "destructive",
      })
      return
    }

    setAddressLoading(true)

    try {
      // Using pdok.nl - free Dutch government postcode API
      const response = await fetch(
        `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${cleanPostcode}+${huisnummer}&rows=1`,
      )

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        throw new Error("Address not found")
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (!data.response?.docs?.[0]) {
        throw new Error("No address found")
      }

      const addressData = data.response.docs[0]
      const street = addressData.straatnaam || ""
      const city = addressData.woonplaatsnaam || ""

      console.log("[v0] Parsed address:", { street, city })

      setStreetName(street)

      // Set the address fields
      const fullAddress = `${street} ${huisnummer}, ${cleanPostcode} ${city}`
      setAddress(fullAddress)
      setLocation(city)

      toast({
        title: "Adres gevonden!",
        description: fullAddress,
        variant: "default",
      })
    } catch (error) {
      console.log("[v0] Error fetching address:", error)
      setStreetName("")
      toast({
        title: "Adres niet gevonden",
        description: "Controleer of de postcode en huisnummer correct zijn.",
        variant: "destructive",
      })
    } finally {
      setAddressLoading(false)
    }
  }

  // Auto-lookup when both postcode and huisnummer are filled
  const handlePostcodeChange = (value: string) => {
    setPostcode(value)
    const cleanPostcode = value.replace(/\s/g, "").toUpperCase()
    console.log("[v0] Postcode changed:", { value, cleanPostcode, huisnummer })
    if (/^[1-9][0-9]{3}[A-Z]{2}$/.test(cleanPostcode) && huisnummer) {
      console.log("[v0] Triggering auto-lookup from postcode change")
      handlePostcodeLookup()
    }
  }

  const handleHuisnummerChange = (value: string) => {
    setHuisnummer(value)
    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase()
    console.log("[v0] Huisnummer changed:", { value, postcode: cleanPostcode })
    if (/^[1-9][0-9]{3}[A-Z]{2}$/.test(cleanPostcode) && value) {
      console.log("[v0] Triggering auto-lookup from huisnummer change")
      handlePostcodeLookup()
    }
  }

  const handleSubmit = async () => {
    if (!title || !date || !time || !location) {
      toast({
        title: "Vul a.u.b. alle vereiste velden in",
        description: "Titel, datum, tijd en locatie zijn verplicht.",
        variant: "destructive",
      })
      return
    }

    const event = {
      id: `event_${Date.now()}`,
      title,
      description,
      date,
      time,
      location,
      address, // Include address
      eventType: selectedType,
      theme: EVENT_TYPES[selectedType].theme,
      coverImage: coverPhoto,
      hostName: organizer || "Anoniem",
      hostId: "user_123",
      privacy: "link-only" as const,
      guests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      partyFields: {
        musicGenre: musicGenres, // Use the array state
        spotifyPlaylistUrl: spotifyPlaylist,
        dresscode: dresscodes, // Use the array state
        bringYourOwn: bringItems, // Use the array state
        entertainment: entertainmentOptions, // Use the array state
      },
      invitationCustomization: {
        titleAnimation: animation,
        titleStyle: textStyle,
        titleFont: font,
      },
      // Adding parking and transport information to the event object
      parkingAvailable: parkingAvailable,
      parkingDetails: parkingDetails,
      transportInfo: {
        distanceToBusStop: distanceToBusStop,
        busStopName: busStopName,
        distanceToStation: distanceToStation,
        stationName: stationName,
      },
    }

    await saveEvent(event)

    const link = `${window.location.origin}/events/${event.id}`
    setEventLink(link)
    setEventCreated(true)
    setCreatedEventId(event.id) // Store the created event ID

    toast({
      title: "Uitnodiging gemaakt!",
      description: "Je kunt nu de link delen met je gasten.",
      variant: "default",
    })

    if (onComplete) {
      onComplete() // Call onComplete if provided
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventLink)
    toast({
      title: "Link gekopieerd!",
      description: "De event link is naar je klembord gekopieerd.",
      variant: "default",
    })
  }

  const handleShareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title || "Mijn Event",
          text: description || "Kom naar mijn event!",
          url: eventLink,
        })
        .catch(() => {})
    } else {
      handleCopyLink()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUploadedPhotos((prev) => [...prev, result])
        setUploadedPhoto(result) // Set uploadedPhoto state
        setCoverPhoto(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryClick = (categoryLabel: string) => {
    if (selectedCategoryForDropdown === categoryLabel) {
      setSelectedCategoryForDropdown(null)
      setCategoryDropdownOpen(false)
    } else {
      setSelectedCategoryForDropdown(categoryLabel)
      setCategoryDropdownOpen(true)
    }
  }

  const getCategoryFromType = (eventType: any): string | null => {
    if (!eventType) return null
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (cat.types.includes(eventType)) {
        return cat.label
      }
    }
    return null
  }

  const handleTextResize = (e: React.WheelEvent, element: "title" | "desc" | string) => {
    e.preventDefault()
    e.stopPropagation()

    const delta = e.deltaY > 0 ? -1 : 1 // Scroll down = smaller, scroll up = larger

    if (element === "title") {
      setTitleSize((prev) => {
        if (delta > 0) {
          return prev === "small" ? "medium" : prev === "medium" ? "large" : "large"
        } else {
          return prev === "large" ? "medium" : prev === "medium" ? "small" : "small"
        }
      })
    } else if (element === "desc") {
      setDescSize((prev) => {
        if (delta > 0) {
          return prev === "small" ? "medium" : prev === "medium" ? "large" : "large"
        } else {
          return prev === "large" ? "medium" : prev === "medium" ? "small" : "small"
        }
      })
    } else {
      setExtraTexts((prev) =>
        prev.map((text) =>
          text.id === element
            ? {
                ...text,
                size:
                  delta > 0
                    ? text.size === "small"
                      ? "medium"
                      : text.size === "medium"
                        ? "large"
                        : "large"
                    : text.size === "large"
                      ? "medium"
                      : text.size === "medium"
                        ? "small"
                        : "small",
              }
            : text,
        ),
      )
    }
  }

  const addExtraText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      text: "Nieuwe tekst",
      position: { x: 0, y: -20 },
      size: "medium" as const,
    }
    setExtraTexts([...extraTexts, newText])
  }

  const updateExtraText = (id: string, updates: Partial<(typeof extraTexts)[0]>) => {
    setExtraTexts(extraTexts.map((text) => (text.id === id ? { ...text, ...updates } : text)))
  }

  const removeExtraText = (id: string) => {
    setExtraTexts(extraTexts.filter((text) => text.id !== id))
  }

  // Updated color options
  const colorOptions = [
    { name: "Wit", value: "#ffffff" },
    { name: "Zwart", value: "#000000" },
    { name: "Paars", value: "#9b59b6" },
    { name: "Roze", value: "#e91e63" },
    { name: "Blauw", value: "#3b82f6" },
    { name: "Geel", value: "#fbbf24" },
    { name: "Groen", value: "#10b981" },
    { name: "Rood", value: "#ef4444" },
    { name: "Oranje", value: "#f97316" },
    { name: "Turquoise", value: "#06b6d4" },
  ]

  const transportInfo = {
    parkingAvailable,
    parkingDetails,
    bushalteDistance: distanceToBusStop,
    bushalteName: busStopName,
    stationDistance: distanceToStation,
    stationName: stationName,
    location: `${address || location}`,
  }

  return (
    <div className="min-h-screen bg-white">
      <form className="max-w-7xl mx-auto space-y-6 p-4 bg-foreground">
        <div className="rounded-2xl p-6 shadow-lg space-y-6 border border-gray-200 bg-white">
          <Label className="text-2xl font-bold flex items-center gap-2 text-[#0A1A2F]">
            <Sparkles className="h-6 w-6 text-[#2070FF]" />
            Type Feest
          </Label>

          <div className="relative">
            {/* Main Dropdown Button */}
            <button
              type="button"
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              className="w-full p-4 rounded-xl border-2 border-[#2070FF] bg-white hover:bg-gray-50 transition-all flex items-center justify-between text-[#0A1A2F]"
            >
              <div className="flex items-center gap-3">
                {selectedEventData && (
                  <>
                    <span className="text-3xl">{selectedEventData.emoji}</span>
                    <span className="font-semibold text-lg">{selectedEventData.label}</span>
                  </>
                )}
                {!selectedEventData && <span className="text-gray-400">Kies een event type...</span>}
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${typeDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {typeDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2070FF] rounded-xl shadow-2xl z-[200] max-h-[400px] overflow-y-auto">
                {Object.entries(CATEGORIES).map(([key, category]) => {
                  const categoryKey = key as keyof typeof CATEGORIES

                  return (
                    <div key={key} className="border-b border-gray-200 last:border-b-0">
                      {/* Category Header */}
                      <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 sticky top-0">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-[#0A1A2F] font-bold text-sm uppercase tracking-wide">
                          {category.label}
                        </span>
                      </div>

                      {/* Event Types */}
                      <div className="py-1">
                        {CATEGORIES[categoryKey].types.map((type) => {
                          const typeData = EVENT_TYPES[type]
                          if (!typeData) return null

                          const isSelected = selectedType === type

                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleTypeSelect(type)}
                              className={`w-full px-6 py-3 text-left transition-colors flex items-center gap-3 hover:bg-blue-50 ${
                                isSelected ? "bg-[#2070FF]/10" : ""
                              }`}
                            >
                              <span className="text-2xl">{typeData.emoji}</span>
                              <span className="text-[#0A1A2F] font-medium">{typeData.label}</span>
                              {isSelected && <CheckCircle2 className="ml-auto w-5 h-5 text-[#2070FF]" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Event Details */}
            <div
              className="rounded-3xl p-6 shadow-lg space-y-4 backdrop-blur-md border-2 relative z-10 transition-all duration-500"
              style={{
                backgroundColor: `white`,
                borderColor: `#e5e7eb`,
              }}
            >
              <Label className="text-lg font-semibold flex items-center gap-2 text-[#0A1A2F]">
                <Calendar className="h-5 w-5 text-[#2070FF]" />
                Event Details
              </Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700">Event Naam</Label>
                  <Input
                    className="border-gray-300 bg-white text-[#0A1A2F] placeholder:text-gray-500 focus:ring-[#2070FF] focus:border-[#2070FF]"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bijv. Sarah's Feest 🎉"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700">Datum</Label>
                    <Input
                      type="date"
                      className="border-gray-300 bg-white text-[#0A1A2F] placeholder:text-gray-500 focus:ring-[#2070FF] focus:border-[#2070FF]"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Tijd</Label>
                    <Input
                      type="time"
                      className="border-gray-300 bg-white text-[#0A1A2F] placeholder:text-gray-500 focus:ring-[#2070FF] focus:border-[#2070FF]"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
                {/* Location Section */}
                <div
                  className="rounded-3xl p-6 shadow-lg space-y-4 backdrop-blur-md border-2 relative z-10 transition-all duration-500"
                  style={{
                    backgroundColor: `white`,
                    borderColor: `#e5e7eb`,
                  }}
                >
                  <Label className="text-2xl font-bold flex items-center gap-2 text-[#0A1A2F]">
                    <svg className="h-6 w-6 text-[#2070FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Locatie
                  </Label>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postcode" className="text-[#0A1A2F] font-semibold">
                          Postcode *
                        </Label>
                        <Input
                          id="postcode"
                          placeholder="1234AB"
                          value={postcode}
                          onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
                          className="rounded-xl border-2 border-[#2070FF]/20 focus:border-[#2070FF] transition-all p-3 bg-white/50"
                          maxLength={7}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="huisnummer" className="text-[#0A1A2F] font-semibold">
                          Huisnummer *
                        </Label>
                        <Input
                          id="huisnummer"
                          placeholder="123"
                          value={huisnummer}
                          onChange={(e) => handleHuisnummerChange(e.target.value)}
                          className="rounded-xl border-2 border-[#2070FF]/20 focus:border-[#2070FF] transition-all p-3 bg-white/50"
                        />
                      </div>
                    </div>

                    {addressLoading && (
                      <div className="flex items-center gap-2 text-[#2070FF]">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2070FF] border-t-transparent" />
                        <span className="text-sm">Adres ophalen...</span>
                      </div>
                    )}

                    {streetName && !addressLoading && (
                      <div className="flex items-center gap-2 p-3 bg-[#2070FF]/10 rounded-xl border border-[#2070FF]/30">
                        <MapPin className="h-5 w-5 text-[#2070FF]" />
                        <div>
                          <p className="font-semibold text-[#0A1A2F]">
                            {streetName} {huisnummer}
                          </p>
                          <p className="text-sm text-[#0A1A2F]/60">
                            {postcode} {location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[#0A1A2F] font-semibold">
                      Volledig Adres
                    </Label>
                    <Input
                      id="address"
                      placeholder="Straatnaam 123, 1234AB Plaats"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-xl border-2 border-[#2070FF]/20 focus:border-[#2070FF] transition-all p-3 bg-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-[#0A1A2F] font-semibold">
                      Locatienaam / Plaats *
                    </Label>
                    <Input
                      id="location"
                      placeholder="bijv. Amsterdam of Mijn Huis"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="rounded-xl border-2 border-[#2070FF]/20 focus:border-[#2070FF] transition-all p-3 bg-white/50"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700">Organisator</Label>
                  <Input
                    className="border-gray-300 bg-white text-[#0A1A2F] placeholder:text-gray-500 focus:ring-[#2070FF] focus:border-[#2070FF]"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Bijv. Sarah Johnson"
                  />
                </div>

                {/* Parking & Transport Section - Replace with new component */}
                <ParkingTransportMap
                  location={address || location || "Amsterdam"} // Pass full address
                  transportInfo={transportInfo}
                  isEditable={true}
                  onToggleParking={(enabled) => setParkingAvailable(enabled)}
                />
              </div>
            </div>

            {/* Party Details */}
            <div
              className="rounded-3xl p-6 shadow-lg space-y-4 backdrop-blur-md border-2 relative z-30 transition-all duration-500"
              style={{
                backgroundColor: `white`,
                borderColor: `#e5e7eb`,
              }}
            >
              <Label className="text-lg font-semibold flex items-center gap-2 text-[#0A1A2F]">
                <Music className="h-5 w-5 text-[#2070FF]" />
                Details
              </Label>

              {/* Muziek Genre */}
              <div className="relative z-40">
                <Label className="text-gray-700">Muziek Genre (meerdere keuzes mogelijk)</Label>
                <button
                  type="button"
                  onClick={() => setMusicDropdownOpen(!musicDropdownOpen)}
                  className="w-full mt-2 p-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center justify-between text-[#0A1A2F] focus:outline-none focus:ring-2 focus:ring-[#2070FF]"
                >
                  <span className="text-gray-400">
                    {musicGenres.length > 0 ? `${musicGenres.length} geselecteerd` : "Selecteer muziek genres..."}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${musicDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {musicDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2070FF] rounded-xl shadow-2xl z-[100] max-h-[250px] overflow-y-auto">
                    {MUSIC_GENRES.map((genre) => {
                      const isSelected = musicGenres.includes(genre)
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setMusicGenres(musicGenres.filter((g) => g !== genre))
                            } else {
                              setMusicGenres([...musicGenres, genre])
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            isSelected ? "bg-[#2070FF]/10" : ""
                          }`}
                        >
                          <span className="text-[#0A1A2F]">{genre}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2070FF]" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {musicGenres.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-[#2070FF] text-sm font-semibold">Geselecteerd ({musicGenres.length}):</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {musicGenres.map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] text-[#0A1A2F] text-sm font-medium shadow-lg transition-all hover:shadow-xl"
                        >
                          {genre}
                          <button
                            type="button"
                            onClick={() => setMusicGenres(musicGenres.filter((g) => g !== genre))}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dresscode */}
              <div className="relative z-30">
                <Label className="text-gray-700">Dresscode (meerdere keuzes mogelijk)</Label>
                <button
                  type="button"
                  onClick={() => setDresscodeDropdownOpen(!dresscodeDropdownOpen)}
                  className="w-full mt-2 p-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center justify-between text-[#0A1A2F] focus:outline-none focus:ring-2 focus:ring-[#2070FF]"
                >
                  <span className="text-gray-400">
                    {dresscodes.length > 0 ? `${dresscodes.length} geselecteerd` : "Selecteer dresscodes..."}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${dresscodeDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dresscodeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2070FF] rounded-xl shadow-2xl z-[90] max-h-[250px] overflow-y-auto">
                    {DRESSCODES.map((code) => {
                      const isSelected = dresscodes.includes(code)
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setDresscodes(dresscodes.filter((d) => d !== code))
                            } else {
                              setDresscodes([...dresscodes, code])
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            isSelected ? "bg-[#2070FF]/10" : ""
                          }`}
                        >
                          <span className="text-[#0A1A2F]">{code}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2070FF]" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {dresscodes.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-[#2070FF] text-sm font-semibold">Geselecteerd ({dresscodes.length}):</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dresscodes.map((code) => (
                        <span
                          key={code}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] text-[#0A1A2F] text-sm font-medium shadow-lg transition-all hover:shadow-xl"
                        >
                          {code}
                          <button
                            type="button"
                            onClick={() => setDresscodes(dresscodes.filter((d) => d !== code))}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wat moeten gasten meenemen */}
              <div className="relative z-20">
                <Label className="text-gray-700">Wat moeten gasten meenemen? (meerdere keuzes mogelijk)</Label>
                <button
                  type="button"
                  onClick={() => setBringItemsDropdownOpen(!bringItemsDropdownOpen)}
                  className="w-full mt-2 p-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center justify-between text-[#0A1A2F] focus:outline-none focus:ring-2 focus:ring-[#2070FF]"
                >
                  <span className="text-gray-400">
                    {bringItems.length > 0 ? `${bringItems.length} geselecteerd` : "Selecteer items..."}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${bringItemsDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {bringItemsDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2070FF] rounded-xl shadow-2xl z-[80] max-h-[250px] overflow-y-auto">
                    {BRING_SUGGESTIONS.map((item) => {
                      const isSelected = bringItems.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setBringItems(bringItems.filter((i) => i !== item))
                            } else {
                              setBringItems([...bringItems, item])
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            isSelected ? "bg-[#2070FF]/10" : ""
                          }`}
                        >
                          <span className="text-[#0A1A2F]">{item}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2070FF]" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {bringItems.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-[#2070FF] text-sm font-semibold">Geselecteerd ({bringItems.length}):</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bringItems.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] text-[#0A1A2F] text-sm font-medium shadow-lg transition-all hover:shadow-xl"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => setBringItems(bringItems.filter((i) => i !== item))}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Entertainment */}
              <div className="relative z-10">
                <Label className="text-gray-700">Entertainment (meerdere keuzes mogelijk)</Label>
                <button
                  type="button"
                  onClick={() => setEntertainmentDropdownOpen(!entertainmentDropdownOpen)}
                  className="w-full mt-2 p-3 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center justify-between text-[#0A1A2F] focus:outline-none focus:ring-2 focus:ring-[#2070FF]"
                >
                  <span className="text-gray-400">
                    {entertainmentOptions.length > 0
                      ? `${entertainmentOptions.length} geselecteerd`
                      : "Selecteer entertainment..."}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${entertainmentDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {entertainmentDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#2070FF] rounded-xl shadow-2xl z-[70] max-h-[250px] overflow-y-auto">
                    {ENTERTAINMENT_SUGGESTIONS.map((ent) => {
                      const isSelected = entertainmentOptions.includes(ent)
                      return (
                        <button
                          key={ent}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setEntertainmentOptions(entertainmentOptions.filter((e) => e !== ent))
                            } else {
                              setEntertainmentOptions([...entertainmentOptions, ent])
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            isSelected ? "bg-[#2070FF]/10" : ""
                          }`}
                        >
                          <span className="text-[#0A1A2F]">{ent}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2070FF]" />}
                        </button>
                      )
                    })}
                  </div>
                )}

                {entertainmentOptions.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-[#2070FF] text-sm font-semibold">
                      Geselecteerd ({entertainmentOptions.length}):
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {entertainmentOptions.map((ent) => (
                        <span
                          key={ent}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] text-[#0A1A2F] text-sm font-medium shadow-lg transition-all hover:shadow-xl"
                        >
                          {ent}
                          <button
                            type="button"
                            onClick={() => setEntertainmentOptions(entertainmentOptions.filter((e) => e !== ent))}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Benodigdheden (Supplies) - Optional */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Label className="text-gray-700 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-[#2070FF]" />
                  Benodigdheden (optioneel)
                </Label>
                
                {/* Suggesties */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Bier", icon: "🍺" },
                    { name: "Wijn", icon: "🍷" },
                    { name: "Frisdrank", icon: "🥤" },
                    { name: "Chips", icon: "🥔" },
                    { name: "Nootjes", icon: "🥜" },
                    { name: "Taart", icon: "🎂" },
                    { name: "Pizza", icon: "🍕" },
                    { name: "IJsblokjes", icon: "🧊" },
                    { name: "Servetten", icon: "🧻" },
                    { name: "Bekers", icon: "🥤" },
                    { name: "Borden", icon: "🍽️" },
                    { name: "Slingers", icon: "🎊" },
                    { name: "Ballonnen", icon: "🎈" },
                  ]
                    .filter((suggestion) => !supplies.some((s) => s.name.toLowerCase() === suggestion.name.toLowerCase()))
                    .map((suggestion) => (
                      <button
                        key={suggestion.name}
                        type="button"
                        onClick={() => {
                          setSupplies([
                            ...supplies,
                            {
                              id: Date.now().toString(),
                              name: suggestion.name,
                              quantity: 1,
                            },
                          ])
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-[#2070FF]/10 hover:border-[#2070FF]/30 border border-gray-200 rounded-full text-gray-700 hover:text-[#2070FF] transition-all"
                      >
                        <span>{suggestion.icon}</span>
                        <span>{suggestion.name}</span>
                      </button>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <Input
                    placeholder="Item naam"
                    value={newSupplyName}
                    onChange={(e) => setNewSupplyName(e.target.value)}
                    className="col-span-5 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                  />
                  <Input
                    type="number"
                    placeholder="Aantal"
                    min={1}
                    value={newSupplyQuantity}
                    onChange={(e) => setNewSupplyQuantity(Number(e.target.value))}
                    className="col-span-2 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                  />
                  <Input
                    type="text"
                    placeholder="Prijs (optioneel)"
                    value={newSupplyPrice}
                    onChange={(e) => setNewSupplyPrice(e.target.value)}
                    className="col-span-3 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newSupplyName.trim()) {
                        setSupplies([
                          ...supplies,
                          {
                            id: Date.now().toString(),
                            name: newSupplyName.trim(),
                            quantity: newSupplyQuantity,
                            price: newSupplyPrice ? Number.parseFloat(newSupplyPrice) : undefined,
                          },
                        ])
                        setNewSupplyName("")
                        setNewSupplyQuantity(1)
                        setNewSupplyPrice("")
                      }
                    }}
                    className="col-span-2 bg-[#2070FF] hover:bg-[#2070FF]/90 text-white rounded-xl"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {supplies.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {supplies.map((supply) => (
                      <div
                        key={supply.id}
                        className="flex items-center justify-between p-3 bg-[#2070FF]/5 rounded-xl border border-[#2070FF]/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#0A1A2F]">{supply.name}</span>
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                            <button
                              type="button"
                              onClick={() => {
                                if (supply.quantity > 1) {
                                  setSupplies(supplies.map((s) => 
                                    s.id === supply.id ? { ...s, quantity: s.quantity - 1 } : s
                                  ))
                                }
                              }}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#2070FF] hover:bg-gray-50 rounded-l-lg transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-[#0A1A2F]">{supply.quantity}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSupplies(supplies.map((s) => 
                                  s.id === supply.id ? { ...s, quantity: s.quantity + 1 } : s
                                ))
                              }}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#2070FF] hover:bg-gray-50 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {supply.price && (
                            <span className="text-sm text-[#2070FF] font-semibold">{"\u20AC"}{supply.price.toFixed(2)}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSupplies(supplies.filter((s) => s.id !== supply.id))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {supplies.some((s) => s.price) && (
                      <div className="text-right text-sm font-semibold text-[#2070FF]">
                        Totaal: {"\u20AC"}{supplies.reduce((sum, s) => sum + (s.price || 0) * s.quantity, 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Voorbereiden (Preparation) - Optional */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Label className="text-gray-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2070FF]" />
                  Voorbereiden (optioneel)
                </Label>
                
                {/* Suggesties */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { task: "Boodschappen doen", icon: "🛒" },
                    { task: "Huis opruimen", icon: "🧹" },
                    { task: "Tafels dekken", icon: "🍽️" },
                    { task: "Muziek playlist maken", icon: "🎵" },
                    { task: "Decoratie ophangen", icon: "🎊" },
                    { task: "Drankjes koud zetten", icon: "🧊" },
                    { task: "Eten voorbereiden", icon: "🍳" },
                    { task: "Stoelen klaarzetten", icon: "🪑" },
                    { task: "Gasten bevestigen", icon: "📱" },
                    { task: "Verlichting regelen", icon: "💡" },
                    { task: "Parkeren regelen", icon: "🚗" },
                    { task: "Taart bestellen", icon: "🎂" },
                  ]
                    .filter((suggestion) => !prepTasks.some((p) => p.task.toLowerCase() === suggestion.task.toLowerCase()))
                    .map((suggestion) => (
                      <button
                        key={suggestion.task}
                        type="button"
                        onClick={() => {
                          setPrepTasks([
                            ...prepTasks,
                            {
                              id: Date.now().toString(),
                              task: suggestion.task,
                              quantity: 1,
                            },
                          ])
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-[#2070FF]/10 hover:border-[#2070FF]/30 border border-gray-200 rounded-full text-gray-700 hover:text-[#2070FF] transition-all"
                      >
                        <span>{suggestion.icon}</span>
                        <span>{suggestion.task}</span>
                      </button>
                    ))}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      placeholder="Wat moet er gebeuren?"
                      value={newPrepTask}
                      onChange={(e) => setNewPrepTask(e.target.value)}
                      className="col-span-5 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Input
                      type="number"
                      placeholder="Aantal"
                      min={1}
                      value={newPrepQuantity}
                      onChange={(e) => setNewPrepQuantity(Number(e.target.value))}
                      className="col-span-2 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Input
                      type="date"
                      placeholder="Deadline"
                      value={newPrepDeadline}
                      onChange={(e) => setNewPrepDeadline(e.target.value)}
                      className="col-span-3 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newPrepTask.trim()) {
                          setPrepTasks([
                            ...prepTasks,
                            {
                              id: Date.now().toString(),
                              task: newPrepTask.trim(),
                              quantity: newPrepQuantity,
                              deadline: newPrepDeadline || undefined,
                              notes: newPrepNotes || undefined,
                            },
                          ])
                          setNewPrepTask("")
                          setNewPrepQuantity(1)
                          setNewPrepDeadline("")
                          setNewPrepNotes("")
                        }
                      }}
                      className="col-span-2 bg-[#2070FF] hover:bg-[#2070FF]/90 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Notitie toevoegen (optioneel)"
                    value={newPrepNotes}
                    onChange={(e) => setNewPrepNotes(e.target.value)}
                    className="rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                  />
                </div>
                {prepTasks.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {prepTasks.map((prep) => (
                      <div
                        key={prep.id}
                        className="p-3 bg-[#2070FF]/5 rounded-xl border border-[#2070FF]/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#0A1A2F]">{prep.task}</span>
                            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">x{prep.quantity}</span>
                            {prep.deadline && (
                              <span className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(prep.deadline).toLocaleDateString("nl-NL", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrepTasks(prepTasks.filter((p) => p.id !== prep.id))}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {prep.notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-white/50 px-3 py-2 rounded-lg italic">
                            {prep.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verlanglijst (Wishlist) - Optional */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Label className="text-gray-700 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[#2070FF]" />
                  Verlanglijst (optioneel)
                </Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Naam"
                      value={newWishlistName}
                      onChange={(e) => setNewWishlistName(e.target.value)}
                      className="rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Input
                      type="text"
                      placeholder="Prijs (optioneel)"
                      value={newWishlistPrice}
                      onChange={(e) => setNewWishlistPrice(e.target.value)}
                      className="rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      type="url"
                      placeholder="Link (optioneel)"
                      value={newWishlistLink}
                      onChange={(e) => setNewWishlistLink(e.target.value)}
                      className="col-span-5 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Input
                      type="url"
                      placeholder="Foto URL (optioneel)"
                      value={newWishlistPhoto}
                      onChange={(e) => setNewWishlistPhoto(e.target.value)}
                      className="col-span-5 rounded-xl border-2 border-gray-300 bg-white text-[#0A1A2F]"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newWishlistName.trim()) {
                          setWishlistItems([
                            ...wishlistItems,
                            {
                              id: Date.now().toString(),
                              name: newWishlistName.trim(),
                              price: newWishlistPrice ? Number.parseFloat(newWishlistPrice) : undefined,
                              link: newWishlistLink || undefined,
                              photo: newWishlistPhoto || undefined,
                            },
                          ])
                          setNewWishlistName("")
                          setNewWishlistPrice("")
                          setNewWishlistLink("")
                          setNewWishlistPhoto("")
                        }
                      }}
                      className="col-span-2 bg-[#2070FF] hover:bg-[#2070FF]/90 text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {wishlistItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative p-3 bg-gradient-to-br from-[#2070FF]/5 to-purple-500/5 rounded-xl border border-[#2070FF]/20 group"
                      >
                        <button
                          type="button"
                          onClick={() => setWishlistItems(wishlistItems.filter((w) => w.id !== item.id))}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex gap-3">
                          {item.photo ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img src={item.photo || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-[#2070FF]/20 to-purple-500/20 flex items-center justify-center">
                              <Gift className="h-6 w-6 text-[#2070FF]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#0A1A2F] truncate">{item.name}</h4>
                            {item.price && (
                              <p className="text-sm text-[#2070FF] font-semibold">{"\u20AC"}{item.price.toFixed(2)}</p>
                            )}
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 hover:text-[#2070FF] flex items-center gap-1 mt-1"
                              >
                                <Link className="h-3 w-3" />
                                Bekijk product
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Photo */}
            <div
              className="rounded-3xl p-6 shadow-lg backdrop-blur-md border-2 relative z-5 transition-all duration-500"
              style={{
                backgroundColor: `white`,
                borderColor: `#e5e7eb`,
              }}
            >
              <Label className="text-lg font-semibold flex items-center gap-2 text-[#0A1A2F]">
                <Camera className="h-5 w-5 text-[#2070FF]" />
                Cover Foto
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <label
                  htmlFor="cover-upload"
                  className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#2070FF]/50 cursor-pointer flex items-center justify-center bg-white hover:bg-gray-50 transition-all"
                >
                  <div className="text-center text-gray-400">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Upload foto</span>
                  </div>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {uploadedPhoto && (
                  <button
                    key="uploaded"
                    type="button"
                    onClick={() => handleCoverPhotoClick(uploadedPhoto)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all p-0 cursor-pointer ${
                      coverPhoto === uploadedPhoto
                        ? "border-[#2070FF] ring-4 ring-[#2070FF]/30 shadow-[0_0_20px_rgba(32,112,255,0.6)]"
                        : "border-gray-300 hover:border-[#2070FF]/50"
                    }`}
                  >
                    <img
                      src={uploadedPhoto || "/placeholder.svg"}
                      alt="Uploaded cover"
                      className="w-full h-full object-cover pointer-events-none"
                      loading="eager"
                    />
                    {coverPhoto === uploadedPhoto && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">✓</span>
                      </div>
                    )}
                  </button>
                )}
                {COVER_PHOTOS.map((photo) => (
                  <button
                    key={photo}
                    type="button"
                    onClick={() => handleCoverPhotoClick(photo)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all p-0 cursor-pointer ${
                      coverPhoto === photo
                        ? "border-[#2070FF] ring-4 ring-[#2070FF]/30 shadow-[0_0_20px_rgba(32,112,255,0.6)]"
                        : "border-gray-300 hover:border-[#2070FF]/50"
                    }`}
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover pointer-events-none"
                      loading="eager"
                    />
                    {coverPhoto === photo && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">Kies een template of upload je eigen foto (max 5MB)</p>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div
              className="rounded-3xl p-6 shadow-lg bg-blue-50/30 border-2 border-[#2070FF]/20"
              style={{
                backgroundColor: `white`,
                borderColor: `#e5e7eb`,
              }}
            >
              <Label className="font-semibold mb-3 block text-[#0A1A2F] text-lg">Live Preview</Label>
              <div
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl cursor-move select-none touch-none bg-gray-800"
                style={{
                  backgroundImage: coverPhoto ? `url(${coverPhoto})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: coverPhoto ? "transparent" : "#1f2937",
                }}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {console.log("[v0] Cover photo in preview:", coverPhoto)}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                {/* Title */}
                {showTitle && (
                  <div
                    className={`absolute cursor-move touch-none group ${animation !== "none" ? `animate-${animation}` : ""}`}
                    style={{
                      left: `${50 + titlePosition.x}%`,
                      top: `${30 + titlePosition.y}%`, // Adjusted top position
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleDragStart(e, "title")}
                    onTouchStart={(e) => handleDragStart(e, "title")}
                  >
                    <h1
                      className={`font-bold mb-2 font-${font} whitespace-nowrap ${
                        titleSize === "small" ? "text-xl" : titleSize === "medium" ? "text-2xl" : "text-3xl"
                      } ${textStyle === "gradient" ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" : ""} ${textStyle === "shadow" ? "drop-shadow-lg" : ""} ${textStyle === "outline" ? "text-outline" : ""}`}
                      style={{ color: textStyle === "gradient" ? undefined : textColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setTitle(e.currentTarget.textContent || "")}
                      onWheel={(e) => handleTextResize(e, "title")}
                    >
                      {selectedEventData?.emoji} {title || "Mijn Feest"}
                    </h1>
                    <button
                      onClick={() => setShowTitle(false)}
                      className="absolute -top-6 -right-6 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Description */}
                {showDescription && (
                  <div
                    className={`absolute cursor-move touch-none group ${animation !== "none" ? `animate-${animation}` : ""}`}
                    style={{
                      left: `${50 + descPosition.x}%`,
                      top: `${70 + descPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                      maxWidth: "80%",
                    }}
                    onMouseDown={(e) => handleDragStart(e, "desc")}
                    onTouchStart={(e) => handleDragStart(e, "desc")}
                  >
                    <p
                      className={`font-${font} text-center max-w-md ${
                        descSize === "small" ? "text-xs" : descSize === "medium" ? "text-sm" : "text-base"
                      } ${textStyle === "gradient" ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" : ""} ${textStyle === "shadow" ? "drop-shadow-lg" : ""} ${textStyle === "outline" ? "text-outline" : ""}`}
                      style={{ color: textStyle === "gradient" ? undefined : textColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setDescription(e.currentTarget.textContent || "")}
                      onWheel={(e) => handleTextResize(e, "desc")}
                    >
                      {description || "Klik om te bewerken"}
                    </p>
                    <button
                      onClick={() => setShowDescription(false)}
                      className="absolute -top-6 -right-6 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Extra Text Fields */}
                {extraTexts.map((txt) => (
                  <div
                    key={txt.id}
                    className={`absolute cursor-move touch-none group ${animation !== "none" ? `animate-${animation}` : ""}`}
                    style={{
                      left: `${50 + txt.position.x}%`,
                      top: `${50 + txt.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleDragStart(e, `text-${txt.id}`)}
                    onTouchStart={(e) => handleDragStart(e, `text-${txt.id}`)}
                  >
                    <p
                      className={`font-${font} text-sm px-2 py-1 ${txt.size === "small" ? "text-xs" : txt.size === "medium" ? "text-sm" : "text-base"}`}
                      style={{ color: textStyle === "gradient" ? undefined : textColor }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        setExtraTexts((prev) =>
                          prev.map((t) => (t.id === txt.id ? { ...t, text: e.currentTarget.textContent || "" } : t)),
                        )
                      }}
                    >
                      {txt.text}
                    </p>
                    <button
                      onClick={() => removeExtraText(txt.id)}
                      className="absolute -top-6 -right-6 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Stickers */}
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="absolute text-5xl cursor-move touch-none"
                    style={{
                      left: `${50 + sticker.x}%`,
                      top: `${50 + sticker.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleDragStart(e, sticker.id)}
                    onTouchStart={(e) => handleDragStart(e, sticker.id)}
                  >
                    {sticker.emoji}
                  </div>
                ))}

                {/* Photo Stickers */}
                {photoStickers.map((photo) => (
                  <div
                    key={photo.id}
                    className="absolute w-24 h-24 cursor-move touch-none"
                    style={{
                      left: `${50 + photo.x}%`,
                      top: `${50 + photo.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleDragStart(e, photo.id)}
                    onTouchStart={(e) => handleDragStart(e, photo.id)}
                  >
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt="Sticker"
                      className="w-full h-full object-cover rounded-lg border-2 border-white shadow-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Styling Tabs Section */}
            <div className="mt-6 rounded-3xl p-6 shadow-lg border-2 border-[#2070FF]/20 bg-card">
              <h3 className="text-2xl font-bold mb-4 text-[#0A1A2F] flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#2070FF]" />
                Uitnodiging Designer
              </h3>
              <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3">
                {(["animatie", "stijl", "font", "positie", "stickers"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] text-white shadow-[0_0_15px_rgba(32,112,255,0.5)]"
                        : "text-gray-600 hover:bg-white"
                    }`}
                  >
                    {tab === "animatie" && "Animatie"}
                    {tab === "stijl" && "Stijl"}
                    {tab === "font" && "Font"}
                    {tab === "positie" && "Positie"}
                    {tab === "stickers" && "Stickers"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {/* Animatie Tab */}
                {activeTab === "animatie" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Titel Animatie</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAnimation("none")}
                        className={`p-8 rounded-2xl border-2 transition-all tracking-normal leading-7 ${
                          animation === "none"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold mb-4 text-[#0A1A2F] text-xl">ABC</div>
                          <div className="text-sm text-gray-400">Geen</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setAnimation("fade-in")}
                        className={`p-8 rounded-2xl border-2 transition-all tracking-normal ${
                          animation === "fade-in"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold mb-4 text-[#0A1A2F] animate-fade-in text-2xl">ABC</div>
                          <div className="text-sm text-gray-400">Fade In</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setAnimation("slide-in")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          animation === "slide-in"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold mb-4 text-[#0A1A2F] animate-slide-in text-2xl">ABC</div>
                          <div className="text-sm text-gray-400">Slide In</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setAnimation("bounce-in")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          animation === "bounce-in"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold mb-4 text-[#0A1A2F] animate-bounce-in text-xl">ABC</div>
                          <div className="text-sm text-gray-400">Bounce</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stijl Tab */}
                {activeTab === "stijl" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Tekststijl</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTextStyle("none")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          textStyle === "none"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F]">ABC</div>
                          <div className="text-sm text-gray-400">Normaal</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setTextStyle("gradient")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          textStyle === "gradient"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ABC
                          </div>
                          <div className="text-sm text-gray-400">Gradient</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setTextStyle("shadow")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          textStyle === "shadow"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F] drop-shadow-lg">ABC</div>
                          <div className="text-sm text-gray-400">Schaduw</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setTextStyle("outline")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          textStyle === "outline"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className="text-5xl font-bold mb-4 text-[#0A1A2F]"
                            style={{
                              textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                            }}
                          >
                            ABC
                          </div>
                          <div className="text-sm text-gray-400">Omtrek</div>
                        </div>
                      </button>
                    </div>

                    {/* Color Picker */}
                    <div className="mt-6">
                      <Label className="text-gray-700 text-lg mb-3 block">Tekstkleur</Label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setTextColor(color.value)}
                            className={`w-12 h-12 rounded-full border-2 transition-all ${
                              textColor === color.value
                                ? "border-[#2070FF] ring-4 ring-[#2070FF]/30 scale-110"
                                : "border-gray-300 hover:border-[#2070FF]/50"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Font Tab */}
                {activeTab === "font" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Lettertype</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFont("poppins")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          font === "poppins"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F] font-poppins">ABC</div>
                          <div className="text-sm text-gray-400">Poppins</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setFont("playfair")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          font === "playfair"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F] font-playfair">ABC</div>
                          <div className="text-sm text-gray-400">Playfair</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setFont("dancing")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          font === "dancing"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F] font-dancing">ABC</div>
                          <div className="text-sm text-gray-400">Dancing</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setFont("bebas")}
                        className={`p-8 rounded-2xl border-2 transition-all ${
                          font === "bebas"
                            ? "border-[#2070FF] bg-[#2070FF]/10 shadow-[0_0_20px_rgba(32,112,255,0.5)]"
                            : "border-gray-300 bg-white hover:border-[#2070FF]/50"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-4 text-[#0A1A2F] font-bebas">ABC</div>
                          <div className="text-sm text-gray-400">Bebas</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Positie Tab */}
                {activeTab === "positie" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Tekstgrootte</h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-24 text-gray-600 font-medium">Titel:</span>
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            onClick={() =>
                              setTitleSize(
                                titleSize === "large" ? "medium" : titleSize === "medium" ? "small" : "small",
                              )
                            }
                            disabled={titleSize === "small"}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0A1A2F] font-bold text-xl transition-all"
                          >
                            -
                          </Button>
                          <span className="flex-1 text-center text-[#0A1A2F] font-semibold">
                            {titleSize === "small" ? "Klein" : titleSize === "medium" ? "Normaal" : "Groot"}
                          </span>
                          <Button
                            onClick={() =>
                              setTitleSize(
                                titleSize === "small" ? "medium" : titleSize === "medium" ? "large" : "large",
                              )
                            }
                            disabled={titleSize === "large"}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0A1A2F] font-bold text-xl transition-all"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-24 text-gray-600 font-medium">Beschrijving:</span>
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            onClick={() =>
                              setDescSize(descSize === "large" ? "medium" : descSize === "medium" ? "small" : "small")
                            }
                            disabled={descSize === "small"}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0A1A2F] font-bold text-xl transition-all"
                          >
                            -
                          </Button>
                          <span className="flex-1 text-center text-[#0A1A2F] font-semibold">
                            {descSize === "small" ? "Klein" : descSize === "medium" ? "Normaal" : "Groot"}
                          </span>
                          <Button
                            onClick={() =>
                              setDescSize(descSize === "small" ? "medium" : descSize === "medium" ? "large" : "large")
                            }
                            disabled={descSize === "large"}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#0A1A2F] font-bold text-xl transition-all"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-gray-400 text-sm">
                        Tip: Sleep tekst in de uitnodiging om de positie aan te passen
                      </p>
                    </div>
                  </div>
                )}

                {/* Stickers Tab */}
                {activeTab === "stickers" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">Emoticons</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {["🎉", "🎊", "🎈", "🎁", "🍾", "🥳", "✨", "🎆"].map((emoji) => (
                          <button
                            key={emoji}
                            className="p-6 rounded-2xl border-2 border-gray-300 hover:border-[#2070FF]/50 hover:bg-gray-50 transition-all text-5xl hover:scale-110"
                            onClick={() => handleAddSticker(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={addExtraText}
                        className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#0ea875] hover:to-[#047857] text-white h-12 text-lg rounded-full shadow-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Voeg Tekst Toe
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="space-y-4 pt-8 pb-8">
          <Button
            onClick={handleSubmit}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-[#2070FF] to-[#06B6D4] hover:from-[#1E62E5] hover:to-[#0891B2] text-white shadow-lg transition-all"
            disabled={!selectedEventData}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Maak Uitnodiging
          </Button>

          {createdEventId && (
            <div className="rounded-3xl p-6 shadow-lg border-2 border-gray-200 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#0A1A2F] mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-semibold">Uitnodiging Gemaakt!</h3>
              </div>

              <div>
                <Label className="text-gray-700 mb-2 block">Alleen met link (Aanbevolen)</Label>
                <p className="text-gray-500 text-sm mb-3">
                  Alleen mensen met de link kunnen het event zien en reageren
                </p>

                <div className="flex gap-2">
                  <Input value={eventLink} readOnly className="bg-gray-100 border-gray-300 text-[#0A1A2F] flex-1" />
                  <Button
                    onClick={handleCopyLink}
                    className="bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] hover:from-[#1E62E5] hover:to-[#71C3F8] text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Kopieer
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleShareLink}
                  className="flex-1 bg-gradient-to-r from-[#FF3EB5] to-[#E5389F] hover:from-[#d936a2] hover:to-[#cc3196] text-white font-semibold rounded-full shadow-lg"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Deel Link
                </Button>
                <Button
                  onClick={() => router.push(`/events/${createdEventId}`)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-[#0A1A2F] hover:bg-gray-50"
                >
                  Bekijk Event
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Event Created Modal */}
        {eventCreated && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className="rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 transition-all duration-500"
              style={{
                backgroundColor: `white`,
                borderColor: `#2070FF`,
              }}
            >
              <div className="text-center space-y-6">
                <div className="text-6xl mx-auto w-fit">🎉</div>
                <h2 className="text-3xl font-bold text-[#0A1A2F]">Event Gemaakt!</h2>
                <p className="text-gray-600">Je kunt nu de link delen met je gasten.</p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCopyLink}
                    className="flex-1 bg-gradient-to-r from-[#2070FF] to-[#7DD3FC] hover:from-[#1E62E5] hover:to-[#71C3F8] text-white font-semibold rounded-full shadow-lg"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Kopieer Link
                  </Button>
                </div>
                <Button
                  onClick={() => router.push(`/events/${createdEventId}`)}
                  variant="outline"
                  className="w-full border-gray-300 text-[#0A1A2F] hover:bg-gray-50"
                >
                  Bekijk Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
