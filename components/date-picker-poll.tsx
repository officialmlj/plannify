"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, Users, X } from "lucide-react"
import type { Event } from "@/lib/types"
import { updateEvent, getEvent } from "@/lib/storage"

interface DateOption {
  id: string
  date: string
  time: string
  votes: string[] // guest names who voted for this date
}

interface DatePickerPollProps {
  event: Event
  guestName?: string
  isHost?: boolean
}

export function DatePickerPoll({ event, guestName, isHost = false }: DatePickerPollProps) {
  const [dateOptions, setDateOptions] = useState<DateOption[]>(event.dateOptions || [])
  const [showAddDate, setShowAddDate] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [myVotes, setMyVotes] = useState<string[]>([])

  useEffect(() => {
    // Load guest's previous votes
    if (guestName) {
      const votedDateIds = dateOptions.filter((option) => option.votes.includes(guestName)).map((option) => option.id)
      setMyVotes(votedDateIds)
    }
  }, [guestName, dateOptions])

  // Refresh date options
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEvent = getEvent(event.id)
      if (updatedEvent && updatedEvent.dateOptions) {
        setDateOptions(updatedEvent.dateOptions)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [event.id])

  const handleAddDateOption = () => {
    if (!newDate || !newTime) return

    const newOption: DateOption = {
      id: `date_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: newDate,
      time: newTime,
      votes: [],
    }

    const updatedOptions = [...dateOptions, newOption]
    setDateOptions(updatedOptions)

    const updatedEvent = {
      ...event,
      dateOptions: updatedOptions,
    }
    updateEvent(event.id, updatedEvent)

    setNewDate("")
    setNewTime("")
    setShowAddDate(false)
  }

  const handleVote = (dateId: string) => {
    if (!guestName) return

    const updatedOptions = dateOptions.map((option) => {
      if (option.id === dateId) {
        const hasVoted = option.votes.includes(guestName)
        return {
          ...option,
          votes: hasVoted ? option.votes.filter((v) => v !== guestName) : [...option.votes, guestName],
        }
      }
      return option
    })

    setDateOptions(updatedOptions)

    const updatedEvent = {
      ...event,
      dateOptions: updatedOptions,
    }
    updateEvent(event.id, updatedEvent)

    // Update local state
    if (myVotes.includes(dateId)) {
      setMyVotes(myVotes.filter((id) => id !== dateId))
    } else {
      setMyVotes([...myVotes, dateId])
    }
  }

  const handleRemoveDateOption = (dateId: string) => {
    const updatedOptions = dateOptions.filter((option) => option.id !== dateId)
    setDateOptions(updatedOptions)

    const updatedEvent = {
      ...event,
      dateOptions: updatedOptions,
    }
    updateEvent(event.id, updatedEvent)
  }

  const handleConfirmDate = (dateId: string) => {
    const selectedOption = dateOptions.find((option) => option.id === dateId)
    if (!selectedOption) return

    const updatedEvent = {
      ...event,
      date: selectedOption.date,
      time: selectedOption.time,
      dateOptions: undefined, // Remove date options once confirmed
    }
    updateEvent(event.id, updatedEvent)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const getMostPopular = () => {
    if (dateOptions.length === 0) return null
    return dateOptions.reduce((prev, current) => (current.votes.length > prev.votes.length ? current : prev))
  }

  const mostPopular = getMostPopular()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Stem op een datum
          </h3>
          <p className="text-sm text-muted-foreground">Kies de datum(s) die voor jou werken</p>
        </div>
        {isHost && (
          <Button onClick={() => setShowAddDate(!showAddDate)} variant="outline" size="sm">
            {showAddDate ? <X className="w-4 h-4" /> : "Datum toevoegen"}
          </Button>
        )}
      </div>

      {showAddDate && isHost && (
        <Card className="p-4 mb-4 bg-muted/50">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Datum</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tijd</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background"
                />
              </div>
            </div>
            <Button onClick={handleAddDateOption} className="w-full" disabled={!newDate || !newTime}>
              Optie toevoegen
            </Button>
          </div>
        </Card>
      )}

      {dateOptions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Geen datumopties beschikbaar</p>
          {isHost && <p className="text-sm">Voeg datumopties toe zodat gasten kunnen stemmen</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {dateOptions
            .sort((a, b) => b.votes.length - a.votes.length)
            .map((option) => {
              const isPopular = mostPopular?.id === option.id && option.votes.length > 0
              const hasVoted = myVotes.includes(option.id)

              return (
                <Card
                  key={option.id}
                  className={`p-4 transition-all ${
                    hasVoted ? "ring-2 ring-primary bg-primary/5" : ""
                  } ${isPopular ? "border-green-500 border-2" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{formatDate(option.date)}</p>
                        {isPopular && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Populairste</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">om {option.time}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {option.votes.length} {option.votes.length === 1 ? "stem" : "stemmen"}
                        </span>
                      </div>
                      {option.votes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            {option.votes.slice(0, 3).join(", ")}
                            {option.votes.length > 3 && ` +${option.votes.length - 3} anderen`}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {guestName && (
                        <Button
                          onClick={() => handleVote(option.id)}
                          variant={hasVoted ? "default" : "outline"}
                          size="sm"
                        >
                          {hasVoted ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Gestemd
                            </>
                          ) : (
                            "Stem"
                          )}
                        </Button>
                      )}
                      {isHost && (
                        <>
                          <Button
                            onClick={() => handleConfirmDate(option.id)}
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Bevestig
                          </Button>
                          <Button onClick={() => handleRemoveDateOption(option.id)} variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
      )}

      {!isHost && !guestName && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">RSVP om te stemmen op een datum</p>
        </div>
      )}
    </Card>
  )
}
