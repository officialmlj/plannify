"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Plus, Wine, UtensilsCrossed, Package, Sparkles, Music, Car, Trash2 } from "lucide-react"
import type { Event, PreparationItem } from "@/lib/types"
import { updateEvent } from "@/lib/storage"

interface PreparationChecklistProps {
  event: Event
  onUpdate: (event: Event) => void
}

const CATEGORIES = [
  { id: "drinks", label: "Drinken", icon: Wine, color: "text-blue-600" },
  { id: "food", label: "Eten", icon: UtensilsCrossed, color: "text-orange-600" },
  { id: "supplies", label: "Benodigdheden", icon: Package, color: "text-purple-600" },
  { id: "decoration", label: "Decoratie", icon: Sparkles, color: "text-pink-600" },
  { id: "music", label: "Muziek", icon: Music, color: "text-green-600" },
  { id: "carpool", label: "Carpool", icon: Car, color: "text-indigo-600" },
  { id: "cleanup", label: "Na het feest", icon: Trash2, color: "text-gray-600" },
] as const

export function PreparationChecklist({ event, onUpdate }: PreparationChecklistProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("drinks")
  const [newItemText, setNewItemText] = useState("")

  const preparationList = event.preparationList || []

  const handleAddItem = () => {
    if (!newItemText.trim()) return

    const newItem: PreparationItem = {
      id: `prep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category: selectedCategory as PreparationItem["category"],
      description: newItemText,
      completed: false,
    }

    const updatedEvent = {
      ...event,
      preparationList: [...preparationList, newItem],
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
    setNewItemText("")
  }

  const handleToggleItem = (itemId: string) => {
    const updatedList = preparationList.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    )

    const updatedEvent = {
      ...event,
      preparationList: updatedList,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const handleClaimItem = (itemId: string, guestName: string) => {
    const updatedList = preparationList.map((item) =>
      item.id === itemId ? { ...item, claimedBy: event.hostId, claimedByName: guestName } : item,
    )

    const updatedEvent = {
      ...event,
      preparationList: updatedList,
    }

    updateEvent(event.id, updatedEvent)
    onUpdate(updatedEvent)
  }

  const getCategoryProgress = (categoryId: string) => {
    const categoryItems = preparationList.filter((item) => item.category === categoryId)
    if (categoryItems.length === 0) return 0
    const completedItems = categoryItems.filter((item) => item.completed).length
    return (completedItems / categoryItems.length) * 100
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Boodschappen & Voorbereidingen</h3>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          const progress = getCategoryProgress(category.id)
          const itemCount = preparationList.filter((item) => item.category === category.id).length

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all min-w-[100px] ${
                selectedCategory === category.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className={`w-5 h-5 ${category.color}`} />
              <span className="text-xs font-medium text-center">{category.label}</span>
              {itemCount > 0 && (
                <div className="w-full">
                  <Progress value={progress} className="h-1" />
                  <span className="text-[10px] text-muted-foreground mt-1">{Math.round(progress)}%</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Add Item Form */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Nieuw item toevoegen..."
          onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
        />
        <Button onClick={handleAddItem} disabled={!newItemText.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {preparationList
          .filter((item) => item.category === selectedCategory)
          .map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                item.completed ? "bg-muted/50 border-muted" : "bg-background border-border hover:border-primary/50"
              }`}
            >
              <button onClick={() => handleToggleItem(item.id)} className="flex-shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <p className={`${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.description}</p>
                {item.claimedByName && (
                  <p className="text-xs text-muted-foreground mt-1">Geregeld door {item.claimedByName}</p>
                )}
              </div>
              {!item.claimedBy && !item.completed && (
                <Button size="sm" variant="outline" onClick={() => handleClaimItem(item.id, event.hostName)}>
                  Claim
                </Button>
              )}
            </div>
          ))}

        {preparationList.filter((item) => item.category === selectedCategory).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nog geen items in deze categorie</p>
          </div>
        )}
      </div>
    </Card>
  )
}
