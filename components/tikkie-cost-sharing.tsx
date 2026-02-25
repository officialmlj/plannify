"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Euro, 
  Plus, 
  Trash2, 
  ExternalLink,
  Users,
  Calculator,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitWith: string[]
  tikkieUrl?: string
}

interface TikkieCostSharingProps {
  eventId: string
  guests?: string[]
  isHost?: boolean
  primaryColor?: string
  hostName?: string
}

export function TikkieCostShopping({ 
  eventId, 
  guests = ["Lisa", "Tom", "Emma", "Max"], 
  isHost = true,
  primaryColor = "#6366F1",
  hostName = "Organisator"
}: TikkieCostSharingProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    { 
      id: "1", 
      description: "Drank en snacks", 
      amount: 45.50, 
      paidBy: "Lisa",
      splitWith: ["Tom", "Emma", "Max"],
      tikkieUrl: "https://tikkie.me/pay/example1"
    },
    { 
      id: "2", 
      description: "Decoratie", 
      amount: 25.00, 
      paidBy: "Tom",
      splitWith: ["Lisa", "Emma"],
    },
  ])

  const [showExpenses, setShowExpenses] = useState(true)
  const [newDescription, setNewDescription] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newPaidBy, setNewPaidBy] = useState(hostName)
  const [newSplitWith, setNewSplitWith] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const allParticipants = [hostName, ...guests]

  const addExpense = () => {
    if (!newDescription.trim() || !newAmount || newSplitWith.length === 0) return
    
    const expense: Expense = {
      id: `expense-${Date.now()}`,
      description: newDescription,
      amount: parseFloat(newAmount),
      paidBy: newPaidBy,
      splitWith: newSplitWith
    }
    setExpenses([...expenses, expense])
    setNewDescription("")
    setNewAmount("")
    setNewSplitWith([])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const toggleSplitWith = (name: string) => {
    if (name === newPaidBy) return // Can't split with the payer
    if (newSplitWith.includes(name)) {
      setNewSplitWith(newSplitWith.filter(n => n !== name))
    } else {
      setNewSplitWith([...newSplitWith, name])
    }
  }

  const calculatePerPerson = (expense: Expense) => {
    const splitCount = expense.splitWith.length + 1 // Include the payer
    return expense.amount / splitCount
  }

  const calculateTotalOwed = (personName: string) => {
    let owed = 0
    let owes = 0

    expenses.forEach(expense => {
      const perPerson = calculatePerPerson(expense)
      
      if (expense.paidBy === personName) {
        // This person paid, others owe them
        owed += expense.amount - perPerson
      } else if (expense.splitWith.includes(personName)) {
        // This person owes
        owes += perPerson
      }
    })

    return { owed, owes, net: owed - owes }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const generateTikkieUrl = (expense: Expense) => {
    const perPerson = calculatePerPerson(expense)
    // Tikkie deep link format (this opens the Tikkie app or website)
    const description = encodeURIComponent(`${expense.description} - ${expense.paidBy}`)
    return `https://tikkie.me/?amount=${perPerson.toFixed(2)}&description=${description}`
  }

  const copyTikkieLink = (expense: Expense) => {
    const url = expense.tikkieUrl || generateTikkieUrl(expense)
    navigator.clipboard.writeText(url)
    setCopiedId(expense.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setShowExpenses(!showExpenses)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Euro className="w-5 h-5" style={{ color: primaryColor }} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Kosten Delen</h3>
            <p className="text-sm text-white/60">Totaal: {totalExpenses.toFixed(2)} euro</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#00B67A20", color: "#00B67A" }}
          >
            Tikkie
          </div>
          {showExpenses ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </div>
      </button>

      {showExpenses && (
        <div className="p-4 space-y-4 bg-[#09091C]/50">
          {/* Summary per person */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {allParticipants.slice(0, 4).map(person => {
              const { net } = calculateTotalOwed(person)
              return (
                <div 
                  key={person}
                  className="p-3 rounded-lg bg-white/5 text-center"
                >
                  <p className="text-xs text-white/60 truncate">{person}</p>
                  <p className={`text-sm font-semibold ${
                    net > 0 ? "text-green-400" : net < 0 ? "text-red-400" : "text-white"
                  }`}>
                    {net > 0 ? "+" : ""}{net.toFixed(2)} euro
                  </p>
                </div>
              )
            })}
          </div>

          {/* Add new expense */}
          {isHost && (
            <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Nieuwe uitgave toevoegen
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Beschrijving..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-sm text-white/60">Betaald door:</span>
                <select
                  value={newPaidBy}
                  onChange={(e) => {
                    setNewPaidBy(e.target.value)
                    setNewSplitWith(newSplitWith.filter(n => n !== e.target.value))
                  }}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                >
                  {allParticipants.map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-white/60 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Verdelen met:
                </span>
                <div className="flex flex-wrap gap-2">
                  {allParticipants.filter(p => p !== newPaidBy).map(person => (
                    <button
                      key={person}
                      onClick={() => toggleSplitWith(person)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        newSplitWith.includes(person)
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                      style={newSplitWith.includes(person) ? { backgroundColor: `${primaryColor}40` } : {}}
                    >
                      {person}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={addExpense}
                className="w-full"
                style={{ backgroundColor: primaryColor }}
                disabled={!newDescription.trim() || !newAmount || newSplitWith.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Uitgave toevoegen
              </Button>
            </div>
          )}

          {/* Expense list */}
          <div className="space-y-2">
            {expenses.map(expense => (
              <div 
                key={expense.id}
                className="p-4 rounded-lg bg-white/10 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{expense.description}</p>
                    <p className="text-sm text-white/60">
                      Betaald door {expense.paidBy} - {expense.amount.toFixed(2)} euro
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {calculatePerPerson(expense).toFixed(2)} euro
                    </p>
                    <p className="text-xs text-white/50">per persoon</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Users className="w-3 h-3" />
                    {expense.splitWith.length + 1} personen
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10"
                      onClick={() => copyTikkieLink(expense)}
                    >
                      {copiedId === expense.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Gekopieerd
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Kopieer link
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      style={{ backgroundColor: "#00B67A" }}
                      onClick={() => window.open(expense.tikkieUrl || generateTikkieUrl(expense), "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Tikkie
                    </Button>
                    {isHost && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/40 hover:text-red-400 hover:bg-white/10"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <p className="text-center text-white/40 py-4">Nog geen uitgaven toegevoegd</p>
            )}
          </div>

          {/* Tikkie info */}
          <div className="p-3 rounded-lg bg-[#00B67A]/10 border border-[#00B67A]/20">
            <p className="text-xs text-[#00B67A]">
              Tip: Klik op "Tikkie" om direct een betaalverzoek te sturen naar de andere deelnemers. 
              Iedereen betaalt automatisch het juiste bedrag.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
