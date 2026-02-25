"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { DollarSign, Plus, Trash2, Users } from "lucide-react"
import type { Event, CostItem } from "@/lib/types"
import { updateEvent } from "@/lib/storage"
import { EVENT_TYPES } from "@/lib/types"

interface CostCalculatorProps {
  event: Event
  onUpdate: (updatedEvent: Event) => void
}

export function CostCalculator({ event, onUpdate }: CostCalculatorProps) {
  const [newCost, setNewCost] = useState({ description: "", amount: "" })
  const [isAdding, setIsAdding] = useState(false)

  const theme = event.theme ||
    EVENT_TYPES[event.eventType]?.theme || {
      primaryColor: "#3B82F6",
      accentColor: "#60A5FA",
      emoji: "🎉",
    }

  const costs = event.costs || []
  const guests = event.guests || []
  const totalCost = costs.reduce((sum, cost) => sum + cost.amount, 0)
  const confirmedGuests = guests.filter((g) => g.status === "yes").length
  const costPerPerson = confirmedGuests > 0 ? totalCost / confirmedGuests : 0

  const handleAddCost = () => {
    if (!newCost.description || !newCost.amount) return

    const costItem: CostItem = {
      id: `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description: newCost.description,
      amount: Number.parseFloat(newCost.amount),
      paidBy: event.hostName,
    }

    const updatedEvent = {
      ...event,
      costs: [...costs, costItem],
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
    setNewCost({ description: "", amount: "" })
    setIsAdding(false)
  }

  const handleRemoveCost = (costId: string) => {
    const updatedEvent = {
      ...event,
      costs: costs.filter((c) => c.id !== costId),
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const generateTikkieLink = () => {
    const amount = costPerPerson.toFixed(2)
    const description = encodeURIComponent(`${event.title} - Kosten`)
    return `https://tikkie.me/pay/request?amount=${amount}&description=${description}`
  }

  return (
    <Card className="p-6 bg-sky-700">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5" style={{ color: theme.primaryColor }} />
        <h3 className="text-xl font-semibold">Kostenberekening</h3>
      </div>

      {costs.length > 0 && (
        <div className="space-y-3 mb-4">
          {costs.map((cost) => (
            <div key={cost.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{cost.description}</p>
                <p className="text-sm text-muted-foreground">Betaald door {cost.paidBy}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">€{cost.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCost(cost.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg mb-4">
          <div className="space-y-2">
            <Label htmlFor="cost-description">Omschrijving</Label>
            <Input
              id="cost-description"
              placeholder="Bijv. Drank, Eten, Decoratie"
              value={newCost.description}
              onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost-amount">Bedrag (€)</Label>
            <Input
              id="cost-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={newCost.amount}
              onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddCost} className="flex-1" style={{ backgroundColor: theme.primaryColor }}>
              Toevoegen
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
              Annuleren
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full mb-4"
          style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Kosten toevoegen
        </Button>
      )}

      {costs.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Totaal:</span>
            <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
              €{totalCost.toFixed(2)}
            </span>
          </div>

          {confirmedGuests > 0 && (
            <>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  <span className="font-medium">Per persoon ({confirmedGuests} gasten):</span>
                </div>
                <span className="text-xl font-bold" style={{ color: theme.primaryColor }}>
                  €{costPerPerson.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={() => window.open(generateTikkieLink(), "_blank")}
                className="w-full"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Deel via Tikkie
              </Button>
            </>
          )}
        </div>
      )}

      {costs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Voeg kosten toe om automatisch te berekenen hoeveel iedereen moet betalen
        </p>
      )}
    </Card>
  )
}
