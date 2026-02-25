import type { Event, Guest } from "./types"
import { EVENT_TYPES } from "./types"
export { EVENT_TYPES }

const EVENTS_KEY = "plannify_events"
const HOST_KEY = "plannify_host_id"

export function getHostId(): string {
  if (typeof window === "undefined") return ""

  let hostId = localStorage.getItem(HOST_KEY)
  if (!hostId) {
    hostId = `host_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(HOST_KEY, hostId)
  }
  return hostId
}

export function getAllEvents(): Event[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(EVENTS_KEY)
  if (!data) return []

  try {
    const events = JSON.parse(data)
    return events.map((e: any) => ({
      ...e,
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
      guests: e.guests.map((g: any) => ({
        ...g,
        respondedAt: g.respondedAt ? new Date(g.respondedAt) : undefined,
      })),
    }))
  } catch {
    return []
  }
}

export function getEvent(id: string): Event | null {
  const events = getAllEvents()
  return events.find((e) => e.id === id) || null
}

export const getEventById = getEvent

export function getHostEvents(hostId: string): Event[] {
  const events = getAllEvents()
  return events.filter((e) => e.hostId === hostId)
}

export function getPublicEvents(): Event[] {
  const events = getAllEvents()
  return events.filter((e) => e.privacy === "public")
}

export function saveEvent(event: Event): void {
  const events = getAllEvents()
  const index = events.findIndex((e) => e.id === event.id)

  if (index >= 0) {
    events[index] = { ...event, updatedAt: new Date() }
  } else {
    events.push(event)
  }

  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function deleteEvent(id: string): void {
  const events = getAllEvents()
  const filtered = events.filter((e) => e.id !== id)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered))
}

export function addGuest(eventId: string, guest: Guest): void {
  const event = getEvent(eventId)
  if (!event) return

  event.guests.push(guest)
  saveEvent(event)
}

export function updateGuestStatus(eventId: string, guestId: string, status: Guest["status"]): void {
  const event = getEvent(eventId)
  if (!event) return

  const guest = event.guests.find((g) => g.id === guestId)
  if (guest) {
    guest.status = status
    guest.respondedAt = new Date()
    saveEvent(event)
  }
}

export function updateEvent(eventId: string, updatedEvent: Event): void {
  const events = getAllEvents()
  const index = events.findIndex((e) => e.id === eventId)

  if (index >= 0) {
    events[index] = { ...updatedEvent, updatedAt: new Date() }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  }
}
