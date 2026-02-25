"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dices, X, RotateCw } from "lucide-react"

interface PartyGameProps {
  eventType?: string
}

const gameCategories = {
  drink: {
    name: "Drink",
    color: "from-blue-500 to-cyan-500",
    icon: "🍺",
  },
  dare: {
    name: "Uitdaging",
    color: "from-red-500 to-pink-500",
    icon: "🎯",
  },
  question: {
    name: "Vraag",
    color: "from-purple-500 to-indigo-500",
    icon: "❓",
  },
  group: {
    name: "Groep",
    color: "from-green-500 to-emerald-500",
    icon: "👥",
  },
}

const gameCards = {
  drink: [
    "Neem 2 slokken",
    "Deel 3 slokken uit",
    "Iedereen drinkt!",
    "De persoon links van jou drinkt",
    "De persoon rechts van jou drinkt",
    "Jongste persoon drinkt",
    "Oudste persoon drinkt",
    "Iedereen met blauw aan drinkt",
    "Laatste persoon die zijn telefoon checkte drinkt",
    "Kies iemand die drinkt",
    "Degene met de langste naam drinkt",
    "Neem 1 slok en deel 1 slok uit",
  ],
  dare: [
    "Dans 10 seconden zonder muziek",
    "Bel een willekeurig contact en zing 'Lang zal die leven'",
    "Post een gekke selfie op je story",
    "Doe een push-up of drink 2 slokken",
    "Spreek de volgende 3 minuten alleen in rijm",
    "Laat de groep door je laatste 5 foto's scrollen",
    "Vertel je meest gênante moment",
    "Imiteer een dier, groep raadt welke",
    "Wissel van kledingstuk met iemand anders",
    "Doe een compliment aan iedereen in de groep",
    "Vertel een geheim dat niemand weet",
    "Doe je beste pick-up line",
  ],
  question: [
    "Wie zou het eerst trouwen?",
    "Wie is het meest waarschijnlijk beroemd?",
    "Wie heeft de grappigste lach?",
    "Wie kan het beste koken?",
    "Wie is de beste danser?",
    "Wie is het meest avontuurlijk?",
    "Wie wordt als eerste miljonair?",
    "Wie is het meest vergeetachtig?",
    "Wie heeft de beste muziek smaak?",
    "Wie is de grootste drama queen?",
    "Wie is het meest sportief?",
    "Wie vertelt de beste verhalen?",
  ],
  group: [
    "Iedereen neemt een slok",
    "Jongens drinken",
    "Meisjes drinken",
    "Singles drinken",
    "Iedereen in een relatie drinkt",
    "Iedereen die vandaag sport heeft gedaan drinkt",
    "Iedereen die eerder is dan 25 drinkt",
    "Groepsfoto tijd! Iedereen poseert",
    "Maak een TikTok met z'n allen",
    "Iedereen deelt zijn beste feest verhaal",
    "Groepsshot! Proost en drink",
    "Iedereen drinkt en nominated iemand anders",
  ],
}

export function PartyGame({ eventType = "party" }: PartyGameProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCard, setCurrentCard] = useState<{
    text: string
    category: keyof typeof gameCategories
  } | null>(null)
  const [history, setHistory] = useState<string[]>([])

  const drawCard = () => {
    const categories = Object.keys(gameCards) as Array<keyof typeof gameCards>
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const categoryCards = gameCards[randomCategory]

    let randomCard: string
    let attempts = 0
    const maxAttempts = 20

    do {
      randomCard = categoryCards[Math.floor(Math.random() * categoryCards.length)]
      attempts++
    } while (history.includes(randomCard) && attempts < maxAttempts)

    if (attempts >= maxAttempts) {
      setHistory([])
    }

    setCurrentCard({
      text: randomCard,
      category: randomCategory,
    })

    setHistory((prev) => [...prev.slice(-10), randomCard])
  }

  const resetGame = () => {
    setCurrentCard(null)
    setHistory([])
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        <Dices className="w-4 h-4 mr-2" />
        Start Party Game
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Dices className="w-6 h-6 text-purple-600" />
                  Party Game
                </h2>
                <p className="text-sm text-muted-foreground">Klik op 'Trek Kaart' voor een nieuwe uitdaging</p>
              </div>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!currentCard ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Dices className="w-24 h-24 mx-auto text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Klaar om te spelen?</h3>
                  <p className="text-muted-foreground mb-6">Trek een kaart en volg de instructies. Veel plezier!</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                  {Object.entries(gameCategories).map(([key, cat]) => (
                    <div key={key} className={`p-4 rounded-lg bg-gradient-to-br ${cat.color} text-white shadow-lg`}>
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="font-semibold">{cat.name}</div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={drawCard}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                >
                  <Dices className="w-5 h-5 mr-2" />
                  Trek Kaart
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`relative p-8 rounded-2xl bg-gradient-to-br ${gameCategories[currentCard.category].color} text-white shadow-2xl min-h-[300px] flex flex-col items-center justify-center text-center`}
                >
                  <div className="text-6xl mb-4">{gameCategories[currentCard.category].icon}</div>
                  <div className="text-sm font-semibold mb-2 opacity-90">
                    {gameCategories[currentCard.category].name}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold leading-tight">{currentCard.text}</div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={drawCard} size="lg" className="flex-1 py-6 text-lg">
                    <Dices className="w-5 h-5 mr-2" />
                    Volgende Kaart
                  </Button>
                  <Button onClick={resetGame} size="lg" variant="outline" className="py-6 bg-transparent">
                    <RotateCw className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Speel verantwoord en zorg dat iedereen zich comfortabel voelt. Je mag altijd
                    een uitdaging overslaan!
                  </p>
                </div>
              </div>
            )}

            {history.length > 0 && currentCard && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">Kaarten getrokken: {history.length}</p>
                <div className="flex flex-wrap gap-1">
                  {history.slice(-5).map((card, index) => (
                    <div
                      key={index}
                      className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground truncate max-w-[150px]"
                    >
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
