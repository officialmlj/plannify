"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Plus, Check, X, User } from "lucide-react"
import type { Event } from "@/lib/types"
import { updateEvent, getEvent } from "@/lib/storage"

interface ShoppingItem {
  id: string
  category: "drinks" | "snacks" | "food" | "other"
  description: string
  quantity?: string
  claimedBy?: string
  claimedByName?: string
  completed: boolean
}

interface ShoppingListProps {
  event: Event
  guestName?: string
  isHost?: boolean
}

const CATEGORY_LABELS = {
  drinks: "Dranken",
  snacks: "Snacks",
  food: "Eten",
  other: "Overig",
}

const CATEGORY_COLORS = {
  drinks: "from-blue-500 to-cyan-500",
  snacks: "from-orange-500 to-yellow-500",
  food: "from-green-500 to-emerald-500",
  other: "from-purple-500 to-pink-500",
}

export function ShoppingList({ event, guestName, isHost = false }: ShoppingListProps) {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(event.shoppingList || [])
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState({
    category: "drinks" as ShoppingItem["category"],
    description: "",
    quantity: "",
  })

  // Refresh shopping list
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEvent = getEvent(event.id)
      if (updatedEvent && updatedEvent.shoppingList) {
        setShoppingList(updatedEvent.shoppingList)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [event.id])

  const handleAddItem = () => {
    if (!newItem.description) return

    const item: ShoppingItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category: newItem.category,
      description: newItem.description,
      quantity: newItem.quantity || undefined,
      completed: false,
    }

    const updatedList = [...shoppingList, item]
    setShoppingList(updatedList)

    const updatedEvent = {
      ...event,
      shoppingList: updatedList,
    }
    updateEvent(event.id, updatedEvent)

    setNewItem({ category: "drinks", description: "", quantity: "" })
    setShowAddItem(false)
  }

  const handleClaimItem = (itemId: string) => {
    if (!guestName) return

    const updatedList = shoppingList.map((item) => {
      if (item.id === itemId) {
        const isClaimed = item.claimedBy === guestName
        return {
          ...item,
          claimedBy: isClaimed ? undefined : guestName,
          claimedByName: isClaimed ? undefined : guestName,
        }
      }
      return item
    })

    setShoppingList(updatedList)

    const updatedEvent = {
      ...event,
      shoppingList: updatedList,
    }
    updateEvent(event.id, updatedEvent)
  }

  const handleToggleComplete = (itemId: string) => {
    const updatedList = shoppingList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          completed: !item.completed,
        }
      }
      return item
    })

    setShoppingList(updatedList)

    const updatedEvent = {
      ...event,
      shoppingList: updatedList,
    }
    updateEvent(event.id, updatedEvent)
  }

  const handleRemoveItem = (itemId: string) => {
    const updatedList = shoppingList.filter((item) => item.id !== itemId)
    setShoppingList(updatedList)

    const updatedEvent = {
      ...event,
      shoppingList: updatedList,
    }
    updateEvent(event.id, updatedEvent)
  }

  const groupedItems = shoppingList.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<ShoppingItem["category"], ShoppingItem[]>,
  )

  const stats = {
    total: shoppingList.length,
    claimed: shoppingList.filter((item) => item.claimedBy).length,
    completed: shoppingList.filter((item) => item.completed).length,
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Shopping List
          </h3>
          <p className="text-sm text-muted-foreground">
            {stats.claimed} van {stats.total} items geclaimd
          </p>
        </div>
        {isHost && (
          <Button onClick={() => setShowAddItem(!showAddItem)} variant="outline" size="sm">
            {showAddItem ? (
              <X className="w-4 h-4" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" /> Voeg toe
              </>
            )}
          </Button>
        )}
      </div>

      {showAddItem && isHost && (
        <Card className="p-4 mb-4 bg-muted/50">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Categorie</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, category: cat })}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      newItem.category === cat ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Item</label>
              <Input
                placeholder="Bijv. Cola, Chips, Pizza"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hoeveelheid (optioneel)</label>
              <Input
                placeholder="Bijv. 2 liter, 1 zak, 3 stuks"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
            <Button onClick={handleAddItem} className="w-full" disabled={!newItem.description}>
              Item toevoegen
            </Button>
          </div>
        </Card>
      )}

      {shoppingList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Geen items op de lijst</p>
          {isHost && <p className="text-sm">Voeg items toe zodat gasten kunnen zien wat ze kunnen meenemen</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.keys(groupedItems) as Array<ShoppingItem["category"]>).map((category) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {CATEGORY_LABELS[category]}
              </h4>
              <div className="space-y-2">
                {groupedItems[category].map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 transition-all ${
                      item.completed ? "opacity-50 bg-muted/50" : ""
                    } ${item.claimedBy ? "ring-2 ring-primary/20" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${item.completed ? "line-through" : ""}`}>{item.description}</p>
                          {item.quantity && <span className="text-sm text-muted-foreground">({item.quantity})</span>}
                        </div>
                        {item.claimedByName && (
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3 text-primary" />
                            <p className="text-xs text-primary">{item.claimedByName} neemt dit mee</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {guestName && !isHost && (
                          <Button
                            onClick={() => handleClaimItem(item.id)}
                            variant={item.claimedBy === guestName ? "default" : "outline"}
                            size="sm"
                          >
                            {item.claimedBy === guestName ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Geclaimd
                              </>
                            ) : item.claimedBy ? (
                              "Geclaimd"
                            ) : (
                              "Claim"
                            )}
                          </Button>
                        )}
                        {isHost && (
                          <>
                            <Button onClick={() => handleToggleComplete(item.id)} variant="ghost" size="sm">
                              {item.completed ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                            <Button onClick={() => handleRemoveItem(item.id)} variant="ghost" size="sm">
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isHost && !guestName && shoppingList.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">RSVP om items te claimen die je wilt meenemen</p>
        </div>
      )}
    </Card>
  )
}
