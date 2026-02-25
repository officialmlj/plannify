"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Gift, Plus, Shuffle, Eye, EyeOff, Share2, X, Sparkles, Users, PartyPopper, Heart } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

interface Participant {
  id: string
  name: string
  wishlist?: string
}

interface Draw {
  giver: string
  receiver: string
  receiverWishlist?: string
}

export function SecretSanta() {
  const { t } = useTranslation()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [newName, setNewName] = useState("")
  const [newWishlist, setNewWishlist] = useState("")
  const [draws, setDraws] = useState<Draw[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const addParticipant = () => {
    if (newName.trim()) {
      setParticipants([
        ...participants,
        {
          id: Date.now().toString(),
          name: newName.trim(),
          wishlist: newWishlist.trim() || undefined,
        },
      ])
      setNewName("")
      setNewWishlist("")
    }
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id))
    setDraws([])
    setShowResults(false)
  }

  const drawNames = () => {
    if (participants.length < 3) return

    setIsDrawing(true)

    setTimeout(() => {
      const shuffled = [...participants]
      let validDraw = false
      let attempts = 0
      let result: Draw[] = []

      while (!validDraw && attempts < 100) {
        const receivers = [...shuffled].sort(() => Math.random() - 0.5)
        validDraw = shuffled.every((giver, index) => giver.id !== receivers[index].id)

        if (validDraw) {
          result = shuffled.map((giver, index) => ({
            giver: giver.name,
            receiver: receivers[index].name,
            receiverWishlist: receivers[index].wishlist,
          }))
        }

        attempts++
      }

      setDraws(result)
      setIsDrawing(false)
      setShowResults(true)
    }, 1500)
  }

  const shareResults = () => {
    const text = draws.map((draw) => `${draw.giver} ${t.gives} ${draw.receiver}`).join("\n")
    const message = `🎁 ${t.secretSanta}\n\n${text}\n\n${t.secretSantaInfo}`

    if (navigator.share) {
      navigator.share({
        title: t.secretSanta,
        text: message,
      })
    } else {
      navigator.clipboard.writeText(message)
      alert("Resultaten gekopieerd naar klembord!")
    }
  }

  const resetDraw = () => {
    setDraws([])
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-purple-50 via-pink-50/50 to-amber-50/30 dark:from-purple-950/30 dark:via-pink-900/20 dark:to-amber-950/20 rounded-2xl border-2 border-purple-200/50 dark:border-purple-800/30 shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-1.5 flex items-center gap-2">
            {t.secretSantaSubtitle}
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.secretSantaInfo}</p>
        </div>
      </div>

      {/* Add Participant */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          {t.addParticipant}
        </label>
        <div className="space-y-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && addParticipant()}
            placeholder={t.participantNamePlaceholder}
            className="h-12 text-base border-2 focus:border-purple-500 dark:focus:border-purple-400"
          />
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              {t.wishlistOptional}
            </label>
            <Textarea
              value={newWishlist}
              onChange={(e) => setNewWishlist(e.target.value)}
              placeholder={t.wishlistPlaceholder}
              className="min-h-[80px] text-sm border-2 focus:border-purple-500 dark:focus:border-purple-400 resize-none"
            />
            <p className="text-xs text-muted-foreground">{t.wishlistInfo}</p>
          </div>
          <Button
            onClick={addParticipant}
            disabled={!newName.trim()}
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all h-12"
          >
            <Plus className="w-5 h-5" />
            {t.addParticipant}
          </Button>
        </div>
      </div>

      {/* Participants List */}
      {participants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              {participants.length} {participants.length === 1 ? t.participant : t.participants}
            </p>
            {participants.length >= 3 && (
              <span className="text-xs text-purple-700 dark:text-purple-300 font-medium px-2 py-1 bg-purple-100 dark:bg-purple-950/30 rounded-full">
                ✓ Klaar om te trekken
              </span>
            )}
          </div>
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="group p-4 bg-gradient-to-br from-muted to-muted/50 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 rounded-xl border-2 border-border hover:border-purple-200 dark:hover:border-purple-800/50 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{participant.name}</span>
                      {participant.wishlist && <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />}
                    </div>
                    {participant.wishlist && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{participant.wishlist}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {draws.length === 0 ? (
          <Button
            onClick={drawNames}
            disabled={participants.length < 3 || isDrawing}
            size="lg"
            className="flex-1 gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 hover:from-purple-600 hover:via-pink-600 hover:to-amber-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all h-14 text-base font-semibold"
          >
            {isDrawing ? (
              <>
                <Shuffle className="w-5 h-5 animate-spin" />
                {t.drawing}
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                {t.drawNames}
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setShowResults(!showResults)}
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700"
            >
              {showResults ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {showResults ? t.hideResults : t.revealResults}
            </Button>
            <Button
              onClick={shareResults}
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-300 dark:hover:border-pink-700 bg-transparent"
            >
              <Share2 className="w-5 h-5" />
              {t.shareResults}
            </Button>
            <Button
              onClick={resetDraw}
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:bg-muted bg-transparent"
            >
              <Shuffle className="w-5 h-5" />
              {t.resetDraw}
            </Button>
          </>
        )}
      </div>

      {participants.length < 3 && participants.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800/30 rounded-xl">
          <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">⚠️ {t.minParticipants}</span>
        </div>
      )}

      {/* Results */}
      {showResults && draws.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50/50 dark:from-purple-950/30 dark:via-pink-900/20 dark:to-amber-950/10 rounded-2xl border-2 border-purple-200/50 dark:border-purple-800/30 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="font-bold text-lg mb-4 text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <PartyPopper className="w-5 h-5" />
            {t.drawComplete}
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h4>
          <div className="space-y-3">
            {draws.map((draw, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-background rounded-xl border-2 border-purple-200/50 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-shadow space-y-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-foreground">{draw.giver}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>→</span>
                  </div>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{draw.receiver}</span>
                </div>
                {draw.receiverWishlist && (
                  <div className="ml-11 pl-4 border-l-2 border-pink-200 dark:border-pink-800/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                      <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">{t.giftIdeas}:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{draw.receiverWishlist}</p>
                  </div>
                )}
                {!draw.receiverWishlist && (
                  <div className="ml-11 pl-4 border-l-2 border-muted">
                    <p className="text-xs text-muted-foreground italic">{t.noWishlist}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
