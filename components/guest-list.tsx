import { Card } from "@/components/ui/card"
import { Check, HelpCircle, X, UserPlus, Mail, Wine, Gift, Briefcase, UtensilsCrossed } from "lucide-react"
import type { Guest } from "@/lib/types"

interface GuestListProps {
  guests: Guest[]
}

export function GuestList({ guests }: GuestListProps) {
  const sortedGuests = [...guests].sort((a, b) => {
    const statusOrder = { yes: 0, maybe: 1, no: 2, pending: 3 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const getStatusIcon = (status: Guest["status"]) => {
    switch (status) {
      case "yes":
        return <Check className="w-4 h-4 text-primary" />
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-secondary" />
      case "no":
        return <X className="w-4 h-4 text-muted-foreground" />
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: Guest["status"]) => {
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

  const getStatusColor = (status: Guest["status"]) => {
    switch (status) {
      case "yes":
        return "bg-primary/10 text-primary"
      case "maybe":
        return "bg-secondary/10 text-secondary"
      case "no":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg text-popover">Nog geen gasten hebben gereageerd</p>
        <p className="text-sm mt-2 text-popover">Deel de uitnodigingslink om gasten uit te nodigen</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedGuests.map((guest) => (
        <Card key={guest.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                {guest.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{guest.name}</p>
                  {guest.plusOne && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">+1</span>
                  )}
                </div>
                {guest.email && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                )}
                {guest.respondedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Gereageerd op{" "}
                    {new Date(guest.respondedAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}

                {guest.preferences && guest.status === "yes" && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {guest.preferences.drinkPreference && (
                      <div className="flex items-center gap-2 text-sm">
                        <Wine className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Drank:</span>
                        <span className="font-medium">{guest.preferences.drinkPreference}</span>
                      </div>
                    )}
                    {guest.preferences.dietaryRestrictions && (
                      <div className="flex items-center gap-2 text-sm">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Dieet:</span>
                        <span className="font-medium">{guest.preferences.dietaryRestrictions}</span>
                      </div>
                    )}
                    {guest.preferences.contribution && (
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Brengt mee:</span>
                        <span className="font-medium">{guest.preferences.contribution}</span>
                      </div>
                    )}
                    {guest.preferences.role && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <span className="text-muted-foreground">Helpt met:</span>
                        <span className="font-medium">{guest.preferences.role}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full flex-shrink-0 ${getStatusColor(guest.status)}`}
            >
              {getStatusIcon(guest.status)}
              <span className="text-sm font-medium whitespace-nowrap">{getStatusText(guest.status)}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
