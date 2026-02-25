import { notFound } from "next/navigation"
import { getEvent } from "@/lib/storage"
import { EventManagement } from "@/components/event-management"

export default async function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEvent(id)

  if (!event) {
    notFound()
  }

  return <EventManagement event={event} />
}
