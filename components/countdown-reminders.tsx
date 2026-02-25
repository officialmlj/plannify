"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Clock,
  Bell,
  BellRing,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
  Send
} from "lucide-react"

interface Reminder {
  id: string
  message: string
  sendAt: Date
  sent: boolean
  type: "email" | "push" | "whatsapp"
}

interface CountdownRemindersProps {
  eventTitle: string
  eventDate: string
  eventTime: string
  isHost?: boolean
  primaryColor?: string
  onSendReminder?: (reminder: Reminder) => void
}

export function CountdownReminders({ 
  eventTitle,
  eventDate,
  eventTime,
  isHost = true,
  primaryColor = "#6366F1",
  onSendReminder
}: CountdownRemindersProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  
  const [showReminders, setShowReminders] = useState(true)
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      message: "Vergeet niet: morgen is het feest!",
      sendAt: new Date(new Date(`${eventDate}T${eventTime}`).getTime() - 24 * 60 * 60 * 1000),
      sent: false,
      type: "whatsapp"
    },
    {
      id: "2",
      message: "Over 1 uur begint het feest!",
      sendAt: new Date(new Date(`${eventDate}T${eventTime}`).getTime() - 60 * 60 * 1000),
      sent: false,
      type: "push"
    }
  ])
  
  const [newReminderMessage, setNewReminderMessage] = useState("")
  const [newReminderTime, setNewReminderTime] = useState("1d") // 1d, 1h, 30m

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = new Date(`${eventDate}T${eventTime}`)
      const now = new Date()
      const difference = eventDateTime.getTime() - now.getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return null
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [eventDate, eventTime])

  const addReminder = () => {
    if (!newReminderMessage.trim()) return
    
    const eventDateTime = new Date(`${eventDate}T${eventTime}`)
    let sendAt: Date
    
    switch (newReminderTime) {
      case "1w":
        sendAt = new Date(eventDateTime.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "1d":
        sendAt = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000)
        break
      case "1h":
        sendAt = new Date(eventDateTime.getTime() - 60 * 60 * 1000)
        break
      case "30m":
        sendAt = new Date(eventDateTime.getTime() - 30 * 60 * 1000)
        break
      default:
        sendAt = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000)
    }

    const reminder: Reminder = {
      id: `reminder-${Date.now()}`,
      message: newReminderMessage,
      sendAt,
      sent: false,
      type: "whatsapp"
    }
    
    setReminders([...reminders, reminder])
    setNewReminderMessage("")
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const sendReminderNow = (reminder: Reminder) => {
    // Mark as sent
    setReminders(reminders.map(r => 
      r.id === reminder.id ? { ...r, sent: true } : r
    ))
    
    // WhatsApp share for now
    const message = encodeURIComponent(`${reminder.message}\n\n${eventTitle}`)
    window.open(`https://wa.me/?text=${message}`, "_blank")
    
    onSendReminder?.(reminder)
  }

  const formatTimeUntilReminder = (sendAt: Date) => {
    const now = new Date()
    const diff = sendAt.getTime() - now.getTime()
    
    if (diff < 0) return "Nu versturen"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    
    if (days > 0) return `Over ${days} dag${days > 1 ? 'en' : ''}`
    if (hours > 0) return `Over ${hours} uur`
    return "Binnenkort"
  }

  const isPastEvent = !timeLeft

  return (
    <div className="space-y-4">
      {/* Countdown Timer */}
      {timeLeft && (
        <Card 
          className="p-6 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}10 100%)`,
            borderColor: `${primaryColor}40`
          }}
        >
          <div className="text-center mb-4">
            <p className="text-sm text-white/60 uppercase tracking-wider">Event begint over</p>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-1"
                style={{ textShadow: `0 0 20px ${primaryColor}40` }}
              >
                {timeLeft.days}
              </div>
              <div className="text-xs text-white/50 uppercase">Dagen</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-1"
                style={{ textShadow: `0 0 20px ${primaryColor}40` }}
              >
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/50 uppercase">Uren</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-1"
                style={{ textShadow: `0 0 20px ${primaryColor}40` }}
              >
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/50 uppercase">Minuten</div>
            </div>
            <div className="text-center">
              <div 
                className="text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums"
                style={{ textShadow: `0 0 20px ${primaryColor}40` }}
              >
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/50 uppercase">Seconden</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, 100 - (timeLeft.days / 30) * 100)}%`,
                  backgroundColor: primaryColor 
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Past event notice */}
      {isPastEvent && (
        <Card className="p-6 text-center bg-white/5 border-white/10">
          <Clock className="w-12 h-12 mx-auto mb-3 text-white/40" />
          <p className="text-white/60">Dit event is al geweest</p>
        </Card>
      )}

      {/* Reminders Section */}
      {isHost && (
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowReminders(!showReminders)}
            className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Bell className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white">Herinneringen</h3>
                <p className="text-sm text-white/60">{reminders.length} gepland</p>
              </div>
            </div>
            {showReminders ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>

          {showReminders && (
            <div className="p-4 space-y-4 bg-[#09091C]/50">
              {/* Add new reminder */}
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                  <BellRing className="w-4 h-4" style={{ color: primaryColor }} />
                  Nieuwe herinnering plannen
                </h4>
                
                <Input
                  placeholder="Bericht voor gasten..."
                  value={newReminderMessage}
                  onChange={(e) => setNewReminderMessage(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                
                <div className="flex gap-2">
                  <select
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  >
                    <option value="1w">1 week voor event</option>
                    <option value="1d">1 dag voor event</option>
                    <option value="1h">1 uur voor event</option>
                    <option value="30m">30 min voor event</option>
                  </select>
                  
                  <Button 
                    onClick={addReminder}
                    style={{ backgroundColor: primaryColor }}
                    disabled={!newReminderMessage.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Toevoegen
                  </Button>
                </div>
              </div>

              {/* Reminder list */}
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <div 
                    key={reminder.id}
                    className={`p-4 rounded-lg transition-all ${
                      reminder.sent 
                        ? "bg-white/5 opacity-60" 
                        : "bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          reminder.sent ? "bg-green-500/20" : "bg-white/10"
                        }`}
                      >
                        {reminder.sent ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Bell className="w-4 h-4 text-white/60" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{reminder.message}</p>
                        <p className="text-xs text-white/50 mt-1">
                          {reminder.sent 
                            ? "Verstuurd" 
                            : formatTimeUntilReminder(reminder.sendAt)
                          }
                        </p>
                      </div>

                      {!reminder.sent && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10"
                            onClick={() => sendReminderNow(reminder)}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Nu versturen
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/40 hover:text-red-400 hover:bg-white/10"
                            onClick={() => deleteReminder(reminder.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {reminders.length === 0 && (
                  <p className="text-center text-white/40 py-4">
                    Nog geen herinneringen gepland
                  </p>
                )}
              </div>

              <p className="text-xs text-white/40 text-center">
                Herinneringen worden via WhatsApp verstuurd naar alle gasten
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
