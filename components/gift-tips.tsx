"use client"

import { useState } from "react"
import { Gift, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/use-translation"

interface GiftTipsProps {
  eventType?: string
  customTips?: string[]
}

const giftSuggestions: Record<string, string[]> = {
  party: [
    "Wijn of champagne",
    "Bloemen of plant",
    "Chocolade of luxe snacks",
    "Cadeaubon (Bol.com, restaurant, etc.)",
    "Kaars of geurstokjes",
    "Spelletje of puzzel",
    "Fotolijst of fotoboek",
    "Kookboek of foodbox",
  ],
  birthday: [
    "Persoonlijk cadeau gebaseerd op hobby's",
    "Ervaringscadeau (concert, spa, workshop)",
    "Boeken of magazine abonnement",
    "Tech gadget of accessoires",
    "Kleding of sieraden",
    "Parfum of verzorgingsproducten",
    "Decoratie voor het huis",
    "Cadeau samen met vrienden (groter cadeau)",
  ],
  housewarming: [
    "Planten of bloemen",
    "Handdoeken of beddengoed",
    "Keukenspullen (panneset, servies)",
    "Decoratie items",
    "Gereedschap",
    "Koffie of thee set",
    "Wijn of champagne",
    "Cadeaubon voor interieur winkel",
  ],
  wedding: [
    "Geld (klassiek en altijd welkom)",
    "Iets van de verlanglijst",
    "Luxe servies of glaswerk",
    "Ervaringscadeau voor twee",
    "Reis cadeaubon",
    "Gepersonaliseerd cadeau",
    "Kunstwerk voor het huis",
    "Huishoudelijke apparaten",
  ],
  babyshower: [
    "Babykleding (maat 3-6 maanden)",
    "Luiers (altijd nodig!)",
    "Babyverzorging producten",
    "Speelgoed voor baby's",
    "Boeken voor baby's",
    "Kraamcadeau mand",
    "Baby monitor",
    "Cadeaubon voor babywinkel",
  ],
}

export function GiftTips({ eventType = "party", customTips }: GiftTipsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const suggestions = customTips || giftSuggestions[eventType] || giftSuggestions.party

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:from-yellow-500/20 hover:to-orange-500/20"
      >
        <Gift className="w-4 h-4 mr-2" />
        Cadeau Ideeën
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Gift className="w-6 h-6 text-yellow-600" />
                  Cadeau Tips
                </h2>
                <p className="text-sm text-muted-foreground">Inspiratie voor het perfecte cadeau</p>
              </div>
              <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3 mb-6">
              {suggestions.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 flex items-start gap-3 hover:from-yellow-500/15 hover:to-orange-500/15 transition-colors"
                >
                  <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">{tip}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Vraag de organisator naar specifieke wensen of check of er een verlanglijst is.
                Een persoonlijk cadeau of kaartje wordt altijd gewaardeerd!
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
