"use client"

import { PartyPopper, Plane, BookOpen, Briefcase, Dumbbell, Calendar } from "lucide-react"
import { useTranslation } from "@/lib/use-translation"

interface EventTypeFilterProps {
  selectedType: "all" | "party" | "vacation" | "study" | "business" | "sport"
  onTypeChange: (type: "all" | "party" | "vacation" | "study" | "business" | "sport") => void
  onAgendaClick?: () => void
}

export function EventTypeFilter({ selectedType, onTypeChange, onAgendaClick }: EventTypeFilterProps) {
  const { t } = useTranslation()

  const eventTypes = [
    { value: "all" as const, label: t.all, emoji: "🎯", icon: null },
    { value: "party" as const, label: t.party, emoji: "🎉", icon: PartyPopper },
    { value: "vacation" as const, label: t.vacation, emoji: "✈️", icon: Plane },
    { value: "study" as const, label: t.study, emoji: "📚", icon: BookOpen },
    { value: "business" as const, label: t.business, emoji: "💼", icon: Briefcase },
    { value: "sport" as const, label: t.sport, emoji: "🏋️", icon: Dumbbell },
  ]

  return (
    null
  )
}
