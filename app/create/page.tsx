"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { EventFormSimple } from "@/components/event-form-simple"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#09091C] relative overflow-hidden">
      {/* Decorative curved lines */}
      <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-[#2070FF]/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full border-2 border-[#06B6D4]/20 rounded-full transform translate-x-1/2 translate-y-1/2" />
      </div>

      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#09091C]/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2 hover:bg-white/10 text-white bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Terug
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src="/images/3f2caac9-0280-4ded-a48f-bcf263c686bd.png" alt="Plannify" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">Plannify</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 relative z-10 py-12 md:py-20">
        <EventFormSimple />
      </main>
    </div>
  )
}
