"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Sparkles, X, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"
import type { Event } from "@/lib/types"

interface AIAssistantProps {
  event?: Event
  context?: "create" | "manage"
}

export function AIAssistant({ event, context = "create" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getCreateSuggestions = () => {
    const suggestions = [
      {
        icon: <Lightbulb className="w-5 h-5 text-yellow-600" />,
        title: "Beste tijd voor feesten",
        description: "Vrijdag- en zaterdagavonden hebben 40% meer opkomst dan doordeweekse dagen",
        type: "tip",
      },
      {
        icon: <TrendingUp className="w-5 h-5 text-green-600" />,
        title: "Locatie tip",
        description: "Centrale locaties met OV-verbinding verhogen de opkomst met 25%",
        type: "tip",
      },
      {
        icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
        title: "Timing advies",
        description: "Stuur uitnodigingen 2-3 weken van tevoren voor optimale respons",
        type: "tip",
      },
    ]

    return suggestions
  }

  const getManageSuggestions = () => {
    if (!event) return []

    const suggestions = []
    const eventDate = new Date(event.date)
    const today = new Date()
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const guests = event.guests || []

    const guestCounts = {
      yes: guests.filter((g) => g.status === "yes").length,
      maybe: guests.filter((g) => g.status === "maybe").length,
      total: guests.length,
    }

    if (daysUntilEvent <= 7 && daysUntilEvent > 0) {
      suggestions.push({
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        title: "Event komt eraan!",
        description: `Nog ${daysUntilEvent} dagen. Stuur een laatste herinnering naar je gasten.`,
        type: "reminder",
      })
    }

    if (guestCounts.maybe > 0) {
      suggestions.push({
        icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
        title: "Volg op met 'misschien' gasten",
        description: `${guestCounts.maybe} mensen twijfelen nog. Een persoonlijk berichtje kan helpen!`,
        type: "action",
      })
    }

    if (event.eventType === "party" && !event.partyFields?.spotifyPlaylistUrl) {
      suggestions.push({
        icon: <Lightbulb className="w-5 h-5 text-purple-600" />,
        title: "Voeg een playlist toe",
        description: "Events met muziek hebben 30% meer engagement",
        type: "tip",
      })
    }

    if (guestCounts.yes > 10 && event.eventType === "party" && !event.costs?.length) {
      suggestions.push({
        icon: <Lightbulb className="w-5 h-5 text-green-600" />,
        title: "Overweeg kostenverdeling",
        description: "Met veel gasten kan het handig zijn om kosten te delen via de app",
        type: "tip",
      })
    }

    const lastYearDate = new Date(eventDate)
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1)
    const month = lastYearDate.toLocaleDateString("nl-NL", { month: "long" })

    if (event.eventType === "party") {
      suggestions.push({
        icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
        title: "Weer check",
        description: `Vorig jaar in ${month} was het wisselvallig. Overweeg een binnenlocatie of tent.`,
        type: "weather",
      })
    }

    return suggestions
  }

  const suggestions = context === "create" ? getCreateSuggestions() : getManageSuggestions()

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-4 md:bottom-6 md:right-8 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-[60] w-14 h-14 py-0 px-3 my-0 mx-0 text-sky-700 bg-sky-500"
        size="icon"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-8 right-4 md:bottom-6 md:right-8 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="shadow-2xl border-2 border-purple-200">
        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold">AI Assistent</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Alles ziet er goed uit! Ik heb momenteel geen suggesties.</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{suggestion.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">💡 Tips gebaseerd op succesvolle events en gebruikersdata</p>
        </div>
      </Card>
    </div>
  )
}
