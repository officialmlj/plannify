"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  return (
    <Link href="/create" className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
      <Button size="lg" className="h-14 w-14 rounded-full shadow-xl hover:scale-110 transition-transform">
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  )
}
