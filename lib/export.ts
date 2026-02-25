import type { Event, Guest } from "./types"

export function exportGuestsToCSV(event: Event): void {
  const headers = ["Naam", "Email", "Status", "Plus One", "Gereageerd Op"]

  const rows = event.guests.map((guest) => [
    guest.name,
    guest.email || "",
    getStatusText(guest.status),
    guest.plusOne ? "Ja" : "Nee",
    guest.respondedAt ? new Date(guest.respondedAt).toLocaleString("nl-NL") : "",
  ])

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${event.title}-gastenlijst.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToCalendar(event: Event): void {
  const startDate = new Date(`${event.date}T${event.time}`)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000) // 3 hours duration

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Plannify//Event//NL",
    "BEGIN:VEVENT",
    `UID:${event.id}@plannify.app`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    `ORGANIZER:CN=${event.hostName}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${event.title}.ics`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getStatusText(status: Guest["status"]): string {
  switch (status) {
    case "yes":
      return "Komt"
    case "maybe":
      return "Misschien"
    case "no":
      return "Komt niet"
    default:
      return "Geen reactie"
  }
}
