import { notFound } from "next/navigation"
import { getEvent } from "@/lib/storage"
import { EventInvitationTabs } from "@/components/event-invitation-tabs"
import { EVENT_TYPES } from "@/lib/types"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const event = getEvent(id)

  if (!event) {
    return {
      title: "Event niet gevonden",
      description: "Dit event bestaat niet of is verwijderd.",
    }
  }

  const eventType = EVENT_TYPES[event.eventType]
  const eventDate = new Date(event.date).toLocaleDateString("nl-NL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const description = `${eventType.emoji} ${event.description}\n\n📅 ${eventDate} om ${event.time}\n📍 ${event.location}\n\nGeorganiseerd door ${event.hostName}`

  return {
    title: `${event.title} - Plannify`,
    description: description,
    openGraph: {
      title: event.title,
      description: description,
      type: "website",
      url: `https://plannify.app/events/${id}`,
      images: event.coverImage
        ? [
            {
              url: event.coverImage,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : [],
      siteName: "Plannify",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: description,
      images: event.coverImage ? [event.coverImage] : [],
    },
  }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEvent(id)

  if (!event) {
    notFound()
  }

  return <EventInvitationTabs event={event} />
}
