"use client"

import { useState } from "react"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/use-translation"

interface OutfitInspirationProps {
  dresscode?: string
}

const outfitSuggestions: Record<string, { men: string[]; women: string[] }> = {
  Casual: {
    men: ["Jeans met T-shirt", "Chino met polo", "Sneakers", "Casual overhemd"],
    women: ["Jeans met mooie top", "Casual jurk", "Sneakers of flats", "Leuke blouse met rok"],
  },
  Chic: {
    men: ["Pantalon met overhemd", "Blazer (optioneel)", "Nette schoenen", "Accessoires"],
    women: ["Cocktail jurk", "Blouse met nette broek", "Hakken of elegante flats", "Sieraden"],
  },
  Elegant: {
    men: ["Pak of smoking", "Overhemd met stropdas", "Leren schoenen", "Manchetknopen"],
    women: ["Avondjurk", "Elegante pumps", "Clutch", "Statement sieraden"],
  },
  Sportief: {
    men: ["Sportbroek", "Sportshirt", "Sneakers", "Pet of hoofdband"],
    women: ["Sportlegging", "Sporttop", "Sneakers", "Scrunchie of hoofdband"],
  },
  Thema: {
    men: ["Kostuum passend bij thema", "Accessoires voor thema", "Creativiteit is key!"],
    women: ["Outfit passend bij thema", "Accessoires voor thema", "Creativiteit is key!"],
  },
  Wit: {
    men: ["Wit overhemd of T-shirt", "Witte broek of jeans", "Witte sneakers", "Minimaal wit in outfit"],
    women: ["Witte jurk of top", "Witte rok of broek", "Witte schoenen", "Minimaal wit in outfit"],
  },
  Zwart: {
    men: ["Zwart overhemd of T-shirt", "Zwarte broek", "Zwarte schoenen", "All black outfit"],
    women: ["Zwarte jurk of top", "Zwarte rok of broek", "Zwarte schoenen", "All black outfit"],
  },
  Kleurrijk: {
    men: ["Gekleurde kleding", "Felle accessoires", "Kleuren combineren", "Wees creatief!"],
    women: ["Gekleurde jurk of outfit", "Felle accessoires", "Kleuren combineren", "Wees creatief!"],
  },
}

export function OutfitInspiration({ dresscode }: OutfitInspirationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  if (!dresscode) return null

  const suggestions = outfitSuggestions[dresscode] || {
    men: ["Kijk naar de dresscode", "Vraag de organisator", "Wees jezelf!"],
    women: ["Kijk naar de dresscode", "Vraag de organisator", "Wees jezelf!"],
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {t("viewOutfits")}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{t("outfitIdeas")}</h2>
                <p className="text-sm text-muted-foreground">
                  Dresscode: <span className="font-semibold text-primary">{dresscode}</span>
                </p>
              </div>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Men's suggestions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">👔</span>
                  <span>Voor heren</span>
                </h3>
                <div className="space-y-2">
                  {suggestions.men.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Women's suggestions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">👗</span>
                  <span>Voor dames</span>
                </h3>
                <div className="space-y-2">
                  {suggestions.women.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Deze suggesties zijn bedoeld als inspiratie. Je eigen stijl en comfort zijn het
                belangrijkst!
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
