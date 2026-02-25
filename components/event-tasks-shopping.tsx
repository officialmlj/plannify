"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ListTodo, 
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  assignedTo?: string
}

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  assignedTo?: string
  purchased: boolean
}

interface EventTasksShoppingProps {
  eventId: string
  guests?: string[]
  isHost?: boolean
  primaryColor?: string
}

export function EventTasksShopping({ 
  eventId, 
  guests = [], 
  isHost = true,
  primaryColor = "#6366F1"
}: EventTasksShoppingProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Locatie versieren", completed: false, assignedTo: "Lisa" },
    { id: "2", text: "Muziek regelen", completed: true, assignedTo: "Tom" },
    { id: "3", text: "Stoelen en tafels neerzetten", completed: false },
  ])
  
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Chips", quantity: "3 zakken", assignedTo: "Emma", purchased: false },
    { id: "2", name: "Frisdrank", quantity: "6 flessen", assignedTo: "Max", purchased: true },
    { id: "3", name: "Ballonnen", quantity: "20 stuks", purchased: false },
  ])

  const [newTask, setNewTask] = useState("")
  const [newItem, setNewItem] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")
  const [showTasks, setShowTasks] = useState(true)
  const [showShopping, setShowShopping] = useState(true)
  const [assignTaskTo, setAssignTaskTo] = useState("")
  const [assignItemTo, setAssignItemTo] = useState("")

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: `task-${Date.now()}`,
      text: newTask,
      completed: false,
      assignedTo: assignTaskTo || undefined
    }
    setTasks([...tasks, task])
    setNewTask("")
    setAssignTaskTo("")
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const addShoppingItem = () => {
    if (!newItem.trim()) return
    const item: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: newItem,
      quantity: newItemQuantity || "1",
      assignedTo: assignItemTo || undefined,
      purchased: false
    }
    setShoppingItems([...shoppingItems, item])
    setNewItem("")
    setNewItemQuantity("")
    setAssignItemTo("")
  }

  const toggleItem = (id: string) => {
    setShoppingItems(shoppingItems.map(i => 
      i.id === id ? { ...i, purchased: !i.purchased } : i
    ))
  }

  const deleteItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(i => i.id !== id))
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const completedItems = shoppingItems.filter(i => i.purchased).length

  return (
    <div className="space-y-4">
      {/* Takenlijst */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setShowTasks(!showTasks)}
          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <ListTodo className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Takenlijst</h3>
              <p className="text-sm text-white/60">{completedTasks} van {tasks.length} klaar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%`,
                  backgroundColor: primaryColor 
                }}
              />
            </div>
            {showTasks ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>

        {showTasks && (
          <div className="p-4 space-y-3 bg-[#09091C]/50">
            {/* Add new task */}
            {isHost && (
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Nieuwe taak..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <select
                  value={assignTaskTo}
                  onChange={(e) => setAssignTaskTo(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                >
                  <option value="">Toewijzen aan...</option>
                  {guests.map(guest => (
                    <option key={guest} value={guest}>{guest}</option>
                  ))}
                </select>
                <Button 
                  onClick={addTask}
                  size="icon"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Task list */}
            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    task.completed 
                      ? "bg-white/5 opacity-60" 
                      : "bg-white/10"
                  }`}
                >
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <span className={`flex-1 text-white ${task.completed ? "line-through" : ""}`}>
                    {task.text}
                  </span>
                  {task.assignedTo && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                      <User className="w-3 h-3" />
                      {task.assignedTo}
                    </span>
                  )}
                  {isHost && (
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-center text-white/40 py-4">Nog geen taken toegevoegd</p>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Boodschappenlijst */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setShowShopping(!showShopping)}
          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <ShoppingCart className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white">Boodschappenlijst</h3>
              <p className="text-sm text-white/60">{completedItems} van {shoppingItems.length} gekocht</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${shoppingItems.length > 0 ? (completedItems / shoppingItems.length) * 100 : 0}%`,
                  backgroundColor: primaryColor 
                }}
              />
            </div>
            {showShopping ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </div>
        </button>

        {showShopping && (
          <div className="p-4 space-y-3 bg-[#09091C]/50">
            {/* Add new item */}
            {isHost && (
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Item naam..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder="Aantal"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-24 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <select
                  value={assignItemTo}
                  onChange={(e) => setAssignItemTo(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                >
                  <option value="">Wie koopt?</option>
                  {guests.map(guest => (
                    <option key={guest} value={guest}>{guest}</option>
                  ))}
                </select>
                <Button 
                  onClick={addShoppingItem}
                  size="icon"
                  style={{ backgroundColor: primaryColor }}
                  onKeyDown={(e) => e.key === "Enter" && addShoppingItem()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Shopping list */}
            <div className="space-y-2">
              {shoppingItems.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    item.purchased 
                      ? "bg-white/5 opacity-60" 
                      : "bg-white/10"
                  }`}
                >
                  <button onClick={() => toggleItem(item.id)}>
                    {item.purchased ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className={`text-white ${item.purchased ? "line-through" : ""}`}>
                      {item.name}
                    </span>
                    <span className="text-white/50 text-sm ml-2">({item.quantity})</span>
                  </div>
                  {item.assignedTo && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                      <User className="w-3 h-3" />
                      {item.assignedTo}
                    </span>
                  )}
                  {isHost && (
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                    </button>
                  )}
                </div>
              ))}
              {shoppingItems.length === 0 && (
                <p className="text-center text-white/40 py-4">Nog geen items toegevoegd</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
