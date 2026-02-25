export type RSVPStatus = "yes" | "maybe" | "no" | "pending"

export type EventType =
  | "party"
  | "birthday"
  | "sweet16"
  | "babyshower"
  | "genderreveal"
  | "housewarming"
  | "engagement"
  | "bachelor"
  | "wedding"
  | "anniversary"
  | "newyear"
  | "christmas"
  | "halloween"
  | "carnival"
  | "kingsday"
  | "easter"
  | "summer"
  | "gamenight"
  | "movienight"
  | "reunion"
  | "surprise"
  | "picnic"
  | "vacation"
  | "vrijmibo"
  | "teamouting"
  | "lunch"
  | "productlaunch"
  | "networking"
  | "businessparty"
  | "opening"
  | "blackwhite"
  | "retro"
  | "pajama"
  | "masquerade"
  | "casino"
  | "tropical"
  | "festival"
  | "silentdisco"
  | "intro"
  | "cantus"
  | "studenthouse"
  | "beerpong"
  | "afterexam"
  | "study"
  | "business"
  | "sport"

export interface EventTheme {
  primaryColor: string
  accentColor: string
  emoji: string
}

export const EVENT_TYPES: Record<EventType, { label: string; emoji: string; description: string; theme: EventTheme }> =
  {
    // Persoonlijke Feesten
    party: {
      label: "Feest",
      emoji: "🎉",
      description: "Algemeen feest of borrel",
      theme: { primaryColor: "#FF6B6B", accentColor: "#FFD93D", emoji: "🎉" },
    },
    birthday: {
      label: "Verjaardag",
      emoji: "🎂",
      description: "Verjaardag vieren",
      theme: { primaryColor: "#FF6B6B", accentColor: "#FFD93D", emoji: "🎂" },
    },
    sweet16: {
      label: "Sweet 16/18+",
      emoji: "🎊",
      description: "Speciale verjaardagsfeest",
      theme: { primaryColor: "#FF69B4", accentColor: "#FFB6C1", emoji: "🎊" },
    },
    babyshower: {
      label: "Babyshower",
      emoji: "👶",
      description: "Aankomende baby vieren",
      theme: { primaryColor: "#87CEEB", accentColor: "#B0E0E6", emoji: "👶" },
    },
    genderreveal: {
      label: "Gender Reveal",
      emoji: "🎈",
      description: "Geslacht bekend maken",
      theme: { primaryColor: "#FFB6C1", accentColor: "#87CEEB", emoji: "🎈" },
    },
    housewarming: {
      label: "Housewarming",
      emoji: "🏠",
      description: "Nieuwe woning vieren",
      theme: { primaryColor: "#FFA500", accentColor: "#FFD700", emoji: "🏠" },
    },
    engagement: {
      label: "Verloving",
      emoji: "💍",
      description: "Huwelijksaanzoek vieren",
      theme: { primaryColor: "#FFD700", accentColor: "#FFF8DC", emoji: "💍" },
    },
    bachelor: {
      label: "Vrijgezellenfeest",
      emoji: "🥳",
      description: "Laatste vrijgezellendag",
      theme: { primaryColor: "#FF1493", accentColor: "#FF69B4", emoji: "🥳" },
    },
    wedding: {
      label: "Bruiloft",
      emoji: "💒",
      description: "Trouwfeest",
      theme: { primaryColor: "#FFFFFF", accentColor: "#FFD700", emoji: "💒" },
    },
    anniversary: {
      label: "Jubileum",
      emoji: "💝",
      description: "Verjaardag van relatie",
      theme: { primaryColor: "#FF1493", accentColor: "#FFB6C1", emoji: "💝" },
    },

    // Seizoensgebonden & Feestdagen
    newyear: {
      label: "Oud & Nieuw",
      emoji: "🎆",
      description: "Nieuwjaarsfeest",
      theme: { primaryColor: "#FFD700", accentColor: "#FFA500", emoji: "🎆" },
    },
    christmas: {
      label: "Kerstfeest",
      emoji: "🎄",
      description: "Kerstviering",
      theme: { primaryColor: "#DC143C", accentColor: "#228B22", emoji: "🎄" },
    },
    halloween: {
      label: "Halloween",
      emoji: "🎃",
      description: "Halloween party",
      theme: { primaryColor: "#FF8C00", accentColor: "#000000", emoji: "🎃" },
    },
    carnival: {
      label: "Carnaval",
      emoji: "🎭",
      description: "Carnavalsfeest",
      theme: { primaryColor: "#FF1493", accentColor: "#FFD700", emoji: "🎭" },
    },
    kingsday: {
      label: "Koningsdag",
      emoji: "👑",
      description: "Koningsdag vieren",
      theme: { primaryColor: "#FF8C00", accentColor: "#FFA500", emoji: "👑" },
    },
    easter: {
      label: "Pasen",
      emoji: "🐰",
      description: "Paasbrunch of borrel",
      theme: { primaryColor: "#FFB6C1", accentColor: "#87CEEB", emoji: "🐰" },
    },
    summer: {
      label: "Zomerfeest",
      emoji: "☀️",
      description: "BBQ of zomerfeest",
      theme: { primaryColor: "#FFD700", accentColor: "#FF6347", emoji: "☀️" },
    },

    // Vrienden- & Familiefeesten
    gamenight: {
      label: "Game Night",
      emoji: "🎮",
      description: "Spelletjesavond",
      theme: { primaryColor: "#6C5CE7", accentColor: "#A29BFE", emoji: "🎮" },
    },
    movienight: {
      label: "Filmavond",
      emoji: "🎬",
      description: "Films kijken samen",
      theme: { primaryColor: "#2C3E50", accentColor: "#E74C3C", emoji: "🎬" },
    },
    reunion: {
      label: "Reünie",
      emoji: "🤝",
      description: "Elkaar weer ontmoeten",
      theme: { primaryColor: "#3498DB", accentColor: "#9B59B6", emoji: "🤝" },
    },
    surprise: {
      label: "Surprise Party",
      emoji: "🎁",
      description: "Verrassingsfeest",
      theme: { primaryColor: "#FF6B6B", accentColor: "#FFD93D", emoji: "🎁" },
    },
    picnic: {
      label: "Picknick",
      emoji: "🧺",
      description: "Picknick in het park",
      theme: { primaryColor: "#32CD32", accentColor: "#90EE90", emoji: "🧺" },
    },

    // Reizen
    vacation: {
      label: "Vakantie",
      emoji: "🏖️",
      description: "Reizen en uitstapjes",
      theme: { primaryColor: "#4ECDC4", accentColor: "#95E1D3", emoji: "🏖️" },
    },

    // Zakelijke & Netwerk Feesten
    vrijmibo: {
      label: "VrijMiBo",
      emoji: "🍻",
      description: "Vrijdagmiddagborrel",
      theme: { primaryColor: "#FFA500", accentColor: "#FFD700", emoji: "🍻" },
    },
    teamouting: {
      label: "Teamuitje",
      emoji: "🚀",
      description: "Team building",
      theme: { primaryColor: "#3498DB", accentColor: "#2ECC71", emoji: "🚀" },
    },
    lunch: {
      label: "Lunch/Diner",
      emoji: "🍽️",
      description: "Zakelijke lunch of diner",
      theme: { primaryColor: "#E67E22", accentColor: "#F39C12", emoji: "🍽️" },
    },
    productlaunch: {
      label: "Product Launch",
      emoji: "🚀",
      description: "Product lancering",
      theme: { primaryColor: "#9B59B6", accentColor: "#8E44AD", emoji: "🚀" },
    },
    networking: {
      label: "Netwerkborrel",
      emoji: "🤝",
      description: "Netwerken",
      theme: { primaryColor: "#34495E", accentColor: "#7F8C8D", emoji: "🤝" },
    },
    businessparty: {
      label: "Kerstborrel",
      emoji: "🎄",
      description: "Jaarafsluiter",
      theme: { primaryColor: "#C0392B", accentColor: "#27AE60", emoji: "🎄" },
    },
    opening: {
      label: "Opening",
      emoji: "🎊",
      description: "Openingsfeest",
      theme: { primaryColor: "#E74C3C", accentColor: "#F39C12", emoji: "🎊" },
    },

    // Themafeesten
    blackwhite: {
      label: "Black & White",
      emoji: "⚫",
      description: "Zwart-wit feest",
      theme: { primaryColor: "#000000", accentColor: "#FFFFFF", emoji: "⚫" },
    },
    retro: {
      label: "90's/00's Party",
      emoji: "📼",
      description: "Retro feest",
      theme: { primaryColor: "#FF1493", accentColor: "#00CED1", emoji: "📼" },
    },
    pajama: {
      label: "Pyjamafeest",
      emoji: "🛌",
      description: "In pyjama feesten",
      theme: { primaryColor: "#87CEEB", accentColor: "#FFB6C1", emoji: "🛌" },
    },
    masquerade: {
      label: "Masquerade",
      emoji: "🎭",
      description: "Gemaskerd bal",
      theme: { primaryColor: "#4B0082", accentColor: "#FFD700", emoji: "🎭" },
    },
    casino: {
      label: "Casino Night",
      emoji: "🎰",
      description: "Casino avond",
      theme: { primaryColor: "#C0392B", accentColor: "#F1C40F", emoji: "🎰" },
    },
    tropical: {
      label: "Tropical Party",
      emoji: "🌴",
      description: "Tropisch feest",
      theme: { primaryColor: "#16A085", accentColor: "#F39C12", emoji: "🌴" },
    },
    festival: {
      label: "Festival",
      emoji: "🎪",
      description: "Festival stijl feest",
      theme: { primaryColor: "#E74C3C", accentColor: "#F39C12", emoji: "🎪" },
    },
    silentdisco: {
      label: "Silent Disco",
      emoji: "🎧",
      description: "Koptelefoon feest",
      theme: { primaryColor: "#9B59B6", accentColor: "#3498DB", emoji: "🎧" },
    },

    // Studentenfeesten
    intro: {
      label: "Introweek",
      emoji: "🎓",
      description: "Introductie feest",
      theme: { primaryColor: "#E67E22", accentColor: "#F39C12", emoji: "🎓" },
    },
    cantus: {
      label: "Cantus",
      emoji: "🍺",
      description: "Studentencantus",
      theme: { primaryColor: "#C0392B", accentColor: "#F1C40F", emoji: "🍺" },
    },
    studenthouse: {
      label: "Huisfeest",
      emoji: "🏠",
      description: "Studentenhuisfeest",
      theme: { primaryColor: "#9B59B6", accentColor: "#E74C3C", emoji: "🏠" },
    },
    beerpong: {
      label: "Bierpong",
      emoji: "🏓",
      description: "Bierpong toernooi",
      theme: { primaryColor: "#F39C12", accentColor: "#E67E22", emoji: "🏓" },
    },
    afterexam: {
      label: "After Exam",
      emoji: "📚",
      description: "Na het tentamen",
      theme: { primaryColor: "#27AE60", accentColor: "#2ECC71", emoji: "📚" },
    },

    // Bestaande categorieën
    study: {
      label: "Studiesessie",
      emoji: "📚",
      description: "Leren en samenwerken",
      theme: { primaryColor: "#6C5CE7", accentColor: "#A29BFE", emoji: "📚" },
    },
    business: {
      label: "Zakelijk",
      emoji: "💼",
      description: "Meetings en netwerken",
      theme: { primaryColor: "#2D3436", accentColor: "#636E72", emoji: "💼" },
    },
    sport: {
      label: "Sportsessie",
      emoji: "⚽",
      description: "Trainen en sporten",
      theme: { primaryColor: "#FF6B35", accentColor: "#FFA500", emoji: "⚽" },
    },
  }

export interface GuestPreferences {
  drinkPreference?: string
  contribution?: string
  role?: string
  dietaryRestrictions?: string
  transportation?: "car" | "carpool-driver" | "carpool-passenger" | "bike" | "walk" | "public-transport" | "other"
  transportationOther?: string
  needsRide?: boolean
  canDrive?: boolean
  availableSeats?: number
  carpoolDepartureLocation?: string
  carpoolDepartureTime?: string
  bringsGuest?: boolean
  guestCount?: number
}

export interface Guest {
  id: string
  name: string
  email?: string
  status: RSVPStatus
  plusOne: boolean
  plusOneName?: string // Name of the plus one guest
  plusOneApproved?: boolean // Whether host approved the plus one
  approved?: boolean // Whether host approved this guest (for invite-only events)
  respondedAt?: Date
  preferences?: GuestPreferences
}

export interface Photo {
  id: string
  url: string
  uploadedBy: string
  uploadedAt: Date
}

export interface DateOption {
  id: string
  date: string
  time: string
  votes: string[]
}

export interface ShoppingItem {
  id: string
  category: "drinks" | "snacks" | "food" | "other"
  description: string
  quantity?: string
  claimedBy?: string
  claimedByName?: string
  completed: boolean
}

export interface PartySpecificFields {
  musicGenre?: string
  dresscode?: string
  bringYourOwn?: string
  entertainment?: string
  spotifyPlaylistUrl?: string
  outfitInspirationEnabled?: boolean
  giftTipsEnabled?: boolean
  customGiftTips?: string[]
  partyGameEnabled?: boolean
}

export interface VacationSpecificFields {
  destination?: string
  accommodation?: string
  budget?: string
  activities?: string
  transportation?: string
}

export interface StudySpecificFields {
  subject?: string
  materials?: string
  studyGoals?: string
  onlineOrPhysical?: "online" | "physical"
  meetingLink?: string
}

export interface BusinessSpecificFields {
  agenda?: string
  meetingType?: string
  presentationRequired?: boolean
  minutesRequired?: boolean
  meetingLink?: string
}

export interface SportSpecificFields {
  sportType?: string
  trainingGoal?: string
  skillLevel?: string
  equipment?: string
  maxParticipants?: number
}

export interface InvitationSticker {
  id: string
  emoji: string
  x: number
  y: number
  size: number
  rotation: number
}

export interface InvitationCustomization {
  invitationTitle?: string
  titleAnimation?: "fade-in" | "slide-in" | "bounce" | "typewriter" | "glow" | "none"
  titleStyle?: "gradient" | "shadow" | "outline" | "glow" | "3d" | "none"
  titleFont?: "poppins" | "playfair" | "dancing" | "bebas" | "none"
  titleColor?: string
  titleSize?: number
  titleX?: number
  titleY?: number
  titlePosition?: "top" | "center" | "bottom"
  subtitleText?: string
  subtitleAnimation?: "fade-in" | "slide-in" | "bounce" | "none"
  stickers?: InvitationSticker[]
}

export interface CostItem {
  id: string
  description: string
  amount: number
  paidBy: string
}

export interface CarpoolOffer {
  id: string
  driverId: string
  driverName: string
  availableSeats: number
  departureLocation?: string
  departureTime?: string
  passengers: string[]
}

export interface PreparationItem {
  id: string
  category: "drinks" | "food" | "supplies" | "decoration" | "music" | "carpool" | "cleanup"
  description: string
  completed: boolean
  claimedBy?: string
  claimedByName?: string
}

export interface ThemeCustomization {
  mode: "light" | "dark" | "custom"
  customColor?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  parkingAvailable?: boolean
  parkingDetails?: string
  distanceToBusStop?: number // in meters
  busStopName?: string
  distanceToStation?: number // in meters
  stationName?: string
  coverImage?: string
  privacy: "public" | "link-only" | "private"
  hostId: string
  hostName: string
  guests: Guest[]
  createdAt: Date
  updatedAt: Date
  eventType: EventType
  theme: EventTheme
  spotifyPlaylistUrl?: string
  photos?: Photo[]
  partyFields?: PartySpecificFields
  vacationFields?: VacationSpecificFields
  studyFields?: StudySpecificFields
  businessFields?: BusinessSpecificFields
  sportFields?: SportSpecificFields
  costs?: CostItem[]
  invitationCustomization?: InvitationCustomization
  carpoolOffers?: CarpoolOffer[]
  preparationList?: PreparationItem[]
  themeCustomization?: ThemeCustomization
  dateOptions?: DateOption[]
  shoppingList?: ShoppingItem[]
  requireApproval?: boolean // Whether host must approve RSVPs
  maxGuests?: number // Maximum number of guests allowed
}
