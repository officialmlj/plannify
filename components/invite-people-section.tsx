"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Copy,
  Check,
  QrCode,
  Send,
  UserPlus,
  MessageCircle,
  Link2,
  Download,
  ChevronDown,
  X,
  Plus,
} from "lucide-react"
import type { Event } from "@/lib/types"
import QRCode from "qrcode"

interface InvitePeopleSectionProps {
  event: Event
}

export function InvitePeopleSection({ event }: InvitePeopleSectionProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [showQR, setShowQR] = useState(false)
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [manualNames, setManualNames] = useState("")
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const [showCustomMessage, setShowCustomMessage] = useState(false)

  const eventUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event.id}`
      : `https://plannify.app/events/${event.id}`

  const defaultMessage = `Hey! Je bent uitgenodigd voor ${event.title}!\n\n${event.date} om ${event.time}\n${event.location}\n\nLaat weten of je komt:`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleWhatsAppShare = () => {
    const msg = showCustomMessage && whatsappMessage ? whatsappMessage : defaultMessage
    const text = `${msg}\n\n${eventUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleWhatsAppDirect = (number: string) => {
    const msg = showCustomMessage && whatsappMessage ? whatsappMessage : defaultMessage
    const text = `${msg}\n\n${eventUrl}`
    const cleanNumber = number.replace(/\D/g, "")
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, "_blank")
  }

  const handleInstagramShare = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleGenerateQR = async () => {
    try {
      const qr = await QRCode.toDataURL(eventUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#ffffff", light: "#00000000" },
      })
      setQrCodeUrl(qr)
      setShowQR(true)
    } catch (error) {
      console.error("Failed to generate QR:", error)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return
    const link = document.createElement("a")
    link.download = `${event.title}-qr-code.png`
    link.href = qrCodeUrl
    link.click()
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Uitnodiging: ${event.title}`,
          text: defaultMessage,
          url: eventUrl,
        })
      } catch (error) {
        // User cancelled share
      }
    }
  }

  const [phoneNumber, setPhoneNumber] = useState("")

  return (
    <div className="bg-gradient-to-br from-[#2070FF]/10 to-[#06B6D4]/10 border border-[#2070FF]/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#2070FF]/20 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#2070FF]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mensen uitnodigen</h2>
            <p className="text-xs text-white/50">Deel je event via link, WhatsApp of QR-code</p>
          </div>
        </div>
      </div>

      {/* Quick Share Buttons */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-3 p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">WhatsApp</p>
              <p className="text-xs text-white/50">Groep of contact</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2070FF]/20 flex items-center justify-center flex-shrink-0">
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Link2 className="w-5 h-5 text-[#2070FF]" />
              )}
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">
                {copied ? "Gekopieerd!" : "Kopieer link"}
              </p>
              <p className="text-xs text-white/50">Plak overal</p>
            </div>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={handleInstagramShare}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#833AB4]/10 to-[#FD1D1D]/10 hover:from-[#833AB4]/20 hover:to-[#FD1D1D]/20 border border-[#833AB4]/20 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] to-[#FD1D1D] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm px-0 mx-[-6px]">Instagram</p>
              <p className="text-xs text-white/50">Story of DM</p>
            </div>
          </button>

          {/* QR Code */}
          <button
            type="button"
            onClick={handleGenerateQR}
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white text-sm">QR-code</p>
              <p className="text-xs text-white/50">Print of toon</p>
            </div>
          </button>
        </div>
      </div>

      {/* Send to specific number */}
      <div className="px-5 pb-4">
        <div className="flex gap-2">
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Telefoonnummer (bijv. +31612345678)"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11"
          />
          <Button
            onClick={() => {
              if (phoneNumber.trim()) {
                handleWhatsAppDirect(phoneNumber)
                setPhoneNumber("")
              }
            }}
            disabled={!phoneNumber.trim()}
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl h-11 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Custom Message Toggle */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => setShowCustomMessage(!showCustomMessage)}
          className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {showCustomMessage ? "Standaard bericht gebruiken" : "Bericht aanpassen"}
          <ChevronDown className={`w-3 h-3 transition-transform ${showCustomMessage ? "rotate-180" : ""}`} />
        </button>
        {showCustomMessage && (
          <textarea
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder={defaultMessage}
            rows={4}
            className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm p-3 placeholder:text-white/30 resize-none focus:outline-none focus:border-[#2070FF]/50"
          />
        )}
      </div>

      {/* Native Share (mobile) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <div className="px-5 pb-5">
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl gap-2"
          >
            <Send className="w-4 h-4" />
            Meer deeloptie
          </Button>
        </div>
      )}

      {/* QR Code Popup */}
      {showQR && qrCodeUrl && (
        <div className="px-5 pb-5">
          <Card className="p-5 bg-[#1B1B47] border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">QR-code</h3>
              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white rounded-2xl p-4">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-xs text-white/50 text-center">
                Laat gasten deze code scannen om direct naar de uitnodiging te gaan
              </p>
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR-code
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Link Preview */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 bg-black/20 rounded-xl p-3">
          <Link2 className="w-4 h-4 text-white/30 flex-shrink-0" />
          <p className="text-xs text-white/40 truncate flex-1">{eventUrl}</p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-[#2070FF] text-xs font-semibold hover:text-[#2070FF]/80 flex-shrink-0"
          >
            {copied ? "Gekopieerd!" : "Kopieer"}
          </button>
        </div>
      </div>
    </div>
  )
}
