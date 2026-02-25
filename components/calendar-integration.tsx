"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Check
} from "lucide-react"

interface CalendarIntegrationProps {
  eventTitle: string
  eventDescription?: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventEndTime?: string
  primaryColor?: string
}

export function CalendarIntegration({ 
  eventTitle,
  eventDescription = "",
  eventDate,
  eventTime,
  eventLocation,
  eventEndTime,
  primaryColor = "#6366F1"
}: CalendarIntegrationProps) {
  const [showCalendar, setShowCalendar] = useState(true)
  const [addedTo, setAddedTo] = useState<string | null>(null)

  // Format date for calendar URLs (YYYYMMDDTHHmmss)
  const formatDateForCalendar = (date: string, time: string) => {
    const d = new Date(`${date}T${time}`)
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  // Calculate end time (default 3 hours after start)
  const getEndTime = () => {
    if (eventEndTime) {
      return formatDateForCalendar(eventDate, eventEndTime)
    }
    const startDate = new Date(`${eventDate}T${eventTime}`)
    startDate.setHours(startDate.getHours() + 3)
    return startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const startDateTime = formatDateForCalendar(eventDate, eventTime)
  const endDateTime = getEndTime()

  // Google Calendar URL
  const getGoogleCalendarUrl = () => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: eventTitle,
      dates: `${startDateTime}/${endDateTime}`,
      details: eventDescription,
      location: eventLocation,
      sf: "true",
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Outlook Calendar URL
  const getOutlookCalendarUrl = () => {
    const params = new URLSearchParams({
      subject: eventTitle,
      startdt: new Date(`${eventDate}T${eventTime}`).toISOString(),
      enddt: eventEndTime 
        ? new Date(`${eventDate}T${eventEndTime}`).toISOString()
        : new Date(new Date(`${eventDate}T${eventTime}`).getTime() + 3 * 60 * 60 * 1000).toISOString(),
      body: eventDescription,
      location: eventLocation,
      path: "/calendar/action/compose",
      rru: "addevent",
    })
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  // Generate ICS file content
  const generateICSContent = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Plannify//Event//NL
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription.replace(/\n/g, "\\n")}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`
    return icsContent
  }

  // Download ICS file
  const downloadICS = () => {
    const content = generateICSContent()
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${eventTitle.replace(/\s+/g, "_")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setAddedTo("ics")
    setTimeout(() => setAddedTo(null), 2000)
  }

  const handleAddToCalendar = (type: "google" | "outlook") => {
    const url = type === "google" ? getGoogleCalendarUrl() : getOutlookCalendarUrl()
    window.open(url, "_blank")
    setAddedTo(type)
    setTimeout(() => setAddedTo(null), 2000)
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Toevoegen aan Kalender</h3>
            <p className="text-sm text-white/60">Google, Outlook of iCal</p>
          </div>
        </div>
        {showCalendar ? (
          <ChevronUp className="w-5 h-5 text-white/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60" />
        )}
      </button>

      {showCalendar && (
        <div className="p-4 space-y-3 bg-[#09091C]/50">
          {/* Google Calendar */}
          <button
            onClick={() => handleAddToCalendar("google")}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">Google Calendar</p>
              <p className="text-sm text-white/50">Voeg toe aan je Google agenda</p>
            </div>
            {addedTo === "google" ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <ExternalLink className="w-5 h-5 text-white/40" />
            )}
          </button>

          {/* Outlook Calendar */}
          <button
            onClick={() => handleAddToCalendar("outlook")}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0078D4] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V5.8l.1.1zm-6.88-1.13h-4.25q-.35 0-.6.25-.25.25-.25.6v3.66q0 .35.25.6.25.25.6.25h4.25q.35 0 .6-.25.25-.25.25-.6V11.76q0-.35-.25-.6-.25-.25-.6-.25z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">Outlook Calendar</p>
              <p className="text-sm text-white/50">Voeg toe aan je Outlook agenda</p>
            </div>
            {addedTo === "outlook" ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <ExternalLink className="w-5 h-5 text-white/40" />
            )}
          </button>

          {/* Download ICS */}
          <button
            onClick={downloadICS}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-white">Download .ics bestand</p>
              <p className="text-sm text-white/50">Voor Apple Calendar en anderen</p>
            </div>
            {addedTo === "ics" ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Download className="w-5 h-5 text-white/40" />
            )}
          </button>

          <p className="text-xs text-white/40 text-center pt-2">
            Klik om het event direct aan je agenda toe te voegen
          </p>
        </div>
      )}
    </Card>
  )
}
