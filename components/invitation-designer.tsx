"use client"

import { useEffect } from "react"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { InvitationCustomization, InvitationSticker } from "@/lib/types"
import { EVENT_TYPES } from "@/lib/types"
import { Sparkles, Type, Palette, Move, Sticker, Trash2, RotateCw, ZoomIn, ZoomOut, ImagePlus, Upload, Plus, AlignLeft } from "lucide-react"

interface InvitationDesignerProps {
  title: string
  coverImage: string
  customization: InvitationCustomization
  onCustomizationChange: (customization: InvitationCustomization) => void
  onTitleChange?: (title: string) => void
  onCoverImageChange?: (src: string) => void
  eventType?: string
  textSize?: number
  onTextSizeChange?: (size: number) => void
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  dresscode?: string[]
}

export function InvitationDesigner({
  title,
  coverImage,
  customization,
  onCustomizationChange,
  onTitleChange,
  onCoverImageChange,
  eventType,
  textSize,
  onTextSizeChange,
  eventDate,
  eventTime,
  eventLocation,
  dresscode,
}: InvitationDesignerProps) {
  const [activeTab, setActiveTab] = useState<"animation" | "style" | "font" | "position" | "stickers" | "photos" | "details" | "text">("animation")
  const [textBlocks, setTextBlocks] = useState<Array<{
    id: string; text: string; x: number; y: number;
    fontSize: number; color: string; fontWeight: string;
  }>>([])
  const [selectedTextBlock, setSelectedTextBlock] = useState<string | null>(null)
  const [draggingTextBlock, setDraggingTextBlock] = useState<string | null>(null)
  const [showDate, setShowDate] = useState(!!eventDate)
  const [showTime, setShowTime] = useState(!!eventTime)
  const [showLocation, setShowLocation] = useState(!!eventLocation)
  const [showDresscode, setShowDresscode] = useState(!!(dresscode && dresscode.length > 0))
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [isDraggingTitle, setIsDraggingTitle] = useState(false)
  const [draggingSticker, setDraggingSticker] = useState<string | null>(null)
  const [draggingPhoto, setDraggingPhoto] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Array<{ id: string; src: string; x: number; y: number; size: number; rotation: number }>>([])
  // Auto-show dresscode when it becomes available
  useEffect(() => {
    if (dresscode && dresscode.length > 0) {
      setShowDresscode(true)
    }
  }, [dresscode])

  const previewRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const bgInputRef = useRef<HTMLInputElement>(null)

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onCoverImageChange) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      onCoverImageChange(src)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const stickerCategories = {
    feest: ["🎉", "🎊", "🎈", "🎂", "🍰", "🎁", "🥳", "🎆", "🎇", "✨", "🌟", "💫", "🎵", "🎶", "🍾", "🥂"],
    vakantie: ["🏖️", "🌴", "🌊", "⛱️", "🏝️", "✈️", "🧳", "🗺️", "🌅", "🌄", "⛰️", "🏔️", "🚗", "🚙", "🛳️", "⛵"],
    sport: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🥎", "🏆", "🥇", "🥈", "🥉", "💪", "🏃", "🚴", "🏊"],
    algemeen: ["❤️", "💕", "💖", "💗", "💙", "💚", "💛", "🧡", "💜", "⭐", "🌟", "✨", "💫", "🔥", "👍", "😊"],
  }

  const animations = [
    { value: "none", label: "Geen", preview: "ABC" },
    { value: "fade-in", label: "Fade In", preview: "ABC" },
    { value: "slide-in", label: "Slide In", preview: "ABC" },
    { value: "bounce", label: "Bounce", preview: "ABC" },
    { value: "typewriter", label: "Typewriter", preview: "ABC" },
    { value: "glow", label: "Glow", preview: "ABC" },
  ]

  const styles = [
    { value: "none", label: "Normaal", class: "" },
    {
      value: "gradient",
      label: "Gradient",
      class: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
    },
    { value: "shadow", label: "Shadow", class: "drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" },
    { value: "outline", label: "Outline", class: "text-stroke" },
    { value: "glow", label: "Glow", class: "text-glow" },
    { value: "3d", label: "3D", class: "text-3d" },
  ]

  const fonts = [
    { value: "none", label: "Standaard", class: "font-sans" },
    { value: "poppins", label: "Poppins", class: "font-sans" },
    { value: "playfair", label: "Playfair", class: "font-serif" },
    { value: "dancing", label: "Dancing", class: "font-cursive" },
    { value: "bebas", label: "Bebas", class: "font-display" },
  ]

  const positions = [
    { value: "top", label: "Boven", class: "items-start pt-12" },
    { value: "center", label: "Midden", class: "items-center" },
    { value: "bottom", label: "Onder", class: "items-end pb-12" },
  ]

  const addSticker = (emoji: string) => {
    const newSticker: InvitationSticker = {
      id: `sticker-${Date.now()}-${Math.random()}`,
      emoji,
      x: 50,
      y: 50,
      size: 2,
      rotation: 0,
    }
    onCustomizationChange({
      ...customization,
      stickers: [...(customization.stickers || []), newSticker],
    })
    setSelectedSticker(newSticker.id)
  }

  const updateSticker = (id: string, updates: Partial<InvitationSticker>) => {
    onCustomizationChange({
      ...customization,
      stickers: (customization.stickers || []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  const deleteSticker = (id: string) => {
    onCustomizationChange({
      ...customization,
      stickers: (customization.stickers || []).filter((s) => s.id !== id),
    })
    if (selectedSticker === id) {
      setSelectedSticker(null)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const src = ev.target?.result as string
        const newPhoto = {
          id: `photo-${Date.now()}-${Math.random()}`,
          src,
          x: 50,
          y: 50,
          size: 25,
          rotation: 0,
        }
        setPhotos((prev) => [...prev, newPhoto])
        setSelectedPhoto(newPhoto.id)
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  const updatePhoto = (id: string, updates: Partial<(typeof photos)[0]>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    if (selectedPhoto === id) setSelectedPhoto(null)
  }

  const handlePhotoMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDraggingPhoto(id)
    setSelectedPhoto(id)
    setSelectedSticker(null)
  }

  const addTextBlock = () => {
    const newBlock = {
      id: `text-${Date.now()}`,
      text: "Typ hier je tekst",
      x: 50,
      y: 70,
      fontSize: 16,
      color: "#ffffff",
      fontWeight: "normal",
    }
    setTextBlocks((prev) => [...prev, newBlock])
    setSelectedTextBlock(newBlock.id)
  }

  const updateTextBlock = (id: string, updates: Partial<(typeof textBlocks)[0]>) => {
    setTextBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const deleteTextBlock = (id: string) => {
    setTextBlocks((prev) => prev.filter((b) => b.id !== id))
    if (selectedTextBlock === id) setSelectedTextBlock(null)
  }

  const handleTextBlockMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDraggingTextBlock(id)
    setSelectedTextBlock(id)
    setSelectedSticker(null)
    setSelectedPhoto(null)
  }

  const handleStickerClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSticker(id)
  }

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDraggingTitle(true)
  }

  const handleStickerMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDraggingSticker(id)
    setSelectedSticker(id)
    setSelectedPhoto(null)
  }

  const getPositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!previewRef.current) return null
    const rect = previewRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))
    return { x, y }
  }, [])

  // Document-level mouse/touch move & up for fast, smooth dragging
  useEffect(() => {
    const isDragging = isDraggingTitle || draggingSticker || draggingPhoto

    if (!isDragging) return

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const pos = getPositionFromEvent(clientX, clientY)
      if (!pos) return

      if (isDraggingTitle) {
        onCustomizationChange({ ...customization, titleX: pos.x, titleY: pos.y })
      } else if (draggingSticker) {
        updateSticker(draggingSticker, { x: pos.x, y: pos.y })
      } else if (draggingPhoto) {
        updatePhoto(draggingPhoto, { x: pos.x, y: pos.y })
      }
    }

    const onUp = () => {
      setIsDraggingTitle(false)
      setDraggingSticker(null)
      setDraggingPhoto(null)
    }

    document.addEventListener("mousemove", onMove, { passive: false })
    document.addEventListener("mouseup", onUp)
    document.addEventListener("touchmove", onMove, { passive: false })
    document.addEventListener("touchend", onUp)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("touchend", onUp)
    }
  }, [isDraggingTitle, draggingSticker, draggingPhoto, customization, onCustomizationChange, getPositionFromEvent])

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingTitle || draggingSticker) return

    if (selectedSticker && e.currentTarget === e.target) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      updateSticker(selectedSticker, { x, y })
    }
  }

  const getAnimationClass = (animation?: string) => {
    switch (animation) {
      case "fade-in":
        return "animate-fade-in"
      case "slide-in":
        return "animate-slide-in"
      case "bounce":
        return "animate-bounce-in"
      case "typewriter":
        return "animate-typewriter"
      case "glow":
        return "animate-glow"
      default:
        return ""
    }
  }

  const getStyleClass = (style?: string) => {
    const styleObj = styles.find((s) => s.value === style)
    return styleObj?.class || ""
  }

  const getFontClass = (font?: string) => {
    const fontObj = fonts.find((f) => f.value === font)
    return fontObj?.class || "font-sans"
  }

  const getPositionClass = (position?: string) => {
    const posObj = positions.find((p) => p.value === position)
    return posObj?.class || "items-center"
  }

  const getStickerSize = (size: number) => {
    switch (size) {
      case 1:
        return "text-3xl"
      case 2:
        return "text-5xl"
      case 3:
        return "text-7xl"
      default:
        return "text-5xl"
    }
  }

  const getTitlePosition = () => {
    if (customization.titleX !== undefined && customization.titleY !== undefined) {
      return {
        position: "absolute" as const,
        left: `${customization.titleX}%`,
        top: `${customization.titleY}%`,
        transform: "translate(-50%, -50%)",
      }
    }
    return {}
  }

  const getTitleContainerClass = () => {
    if (customization.titleX !== undefined && customization.titleY !== undefined) {
      return ""
    }
    return getPositionClass(customization.titlePosition)
  }

  const handleTitleEdit = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || ""
    if (onTitleChange) {
      onTitleChange(newTitle)
    }
  }

  const getTitleFontSize = () => {
    const size = customization.titleSize || textSize || 3 // default 3rem (48px)
    return { fontSize: `${size}rem` }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-white">Uitnodiging Designer</h3>
      </div>

      {/* Preview */}
      <Card
        ref={previewRef}
        className={`relative aspect-video overflow-hidden touch-none ${isDraggingTitle || draggingSticker || draggingPhoto ? "cursor-grabbing" : "cursor-default"}`}
        onClick={handlePreviewClick}
      >
        <img
          src={coverImage || "/placeholder.svg"}
          alt="Cover preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Background upload overlay */}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          onChange={handleBgUpload}
          className="hidden"
        />
        {onCoverImageChange && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              bgInputRef.current?.click()
            }}
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all backdrop-blur-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Achtergrond wijzigen
          </button>
        )}
        <div className={`absolute inset-0 bg-black/40 flex flex-col justify-center ${getTitleContainerClass()} px-8`}>
          <div
            style={getTitlePosition()}
            className={isDraggingTitle ? "cursor-grabbing" : "cursor-grab"}
            onMouseDown={handleTitleMouseDown}
          >
            {eventType && EVENT_TYPES[eventType] && (
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm md:text-base font-semibold px-4 py-2 rounded-full mb-4">
                <span className="text-lg">{EVENT_TYPES[eventType].emoji}</span>
                {EVENT_TYPES[eventType].label}
              </span>
            )}
            <h1
              contentEditable={onTitleChange ? true : false}
              suppressContentEditableWarning
              onBlur={handleTitleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
              className={`text-3xl md:text-5xl font-bold text-white text-center ${onTitleChange ? "outline-none focus:ring-2 focus:ring-primary/50 rounded px-2" : "select-none"} ${getAnimationClass(customization.titleAnimation)} ${getStyleClass(customization.titleStyle)} ${getFontClass(customization.titleFont)}`}
              style={{ color: customization.titleColor || "white", ...getTitleFontSize() }}
            >
              {title || "Je bent uitgenodigd"}
            </h1>
            {customization.subtitleText && (
              <p
                className={`text-xl md:text-2xl text-white/90 text-center mt-4 select-none ${getAnimationClass(customization.subtitleAnimation)}`}
              >
                {customization.subtitleText}
              </p>
            )}
            {/* Event details overlay */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {showDate && eventDate && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(eventDate).toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "long" })}
                </span>
              )}
              {showTime && eventTime && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {eventTime}
                </span>
              )}
              {showLocation && eventLocation && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {eventLocation}
                </span>
              )}
              {showDresscode && dresscode && dresscode.length > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  {dresscode.join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
        {(customization.stickers || []).map((sticker) => (
          <div
            key={sticker.id}
            className={`absolute select-none transition-all ${getStickerSize(sticker.size)} ${
              selectedSticker === sticker.id ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
            } ${draggingSticker === sticker.id ? "cursor-grabbing" : "cursor-grab"}`}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
            }}
            onMouseDown={(e) => handleStickerMouseDown(sticker.id, e)}
            onTouchStart={(e) => handleStickerMouseDown(sticker.id, e)}
            onClick={(e) => handleStickerClick(sticker.id, e)}
          >
            {sticker.emoji}
          </div>
        ))}
        {/* Photos on preview */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`absolute select-none touch-none transition-shadow ${
              selectedPhoto === photo.id ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
            } ${draggingPhoto === photo.id ? "cursor-grabbing" : "cursor-grab"}`}
            style={{
              left: `${photo.x}%`,
              top: `${photo.y}%`,
              width: `${photo.size}%`,
              transform: `translate(-50%, -50%) rotate(${photo.rotation}deg)`,
            }}
            onMouseDown={(e) => handlePhotoMouseDown(photo.id, e)}
            onTouchStart={(e) => handlePhotoMouseDown(photo.id, e)}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(photo.id)
              setSelectedSticker(null)
            }}
          >
            <img
              src={photo.src || "/placeholder.svg"}
              alt="Uitnodiging foto"
              className="w-full h-auto rounded-lg shadow-lg pointer-events-none"
              draggable={false}
            />
          </div>
        ))}
      </Card>

      {onTitleChange && (
        <p className="text-[10px] text-muted-foreground/20 text-center -mt-2">
          💡 Tip: Klik op de titel in de preview om deze direct te bewerken
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <Button
          variant={activeTab === "animation" ? "default" : "ghost"}
          onClick={() => setActiveTab("animation")}
          className="flex-1 min-w-fit bg-sky-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Animatie
        </Button>
        <Button
          variant={activeTab === "style" ? "default" : "ghost"}
          onClick={() => setActiveTab("style")}
          className="flex-1 min-w-fit"
        >
          <Type className="w-4 h-4 mr-2" />
          Stijl
        </Button>
        <Button
          variant={activeTab === "font" ? "default" : "ghost"}
          onClick={() => setActiveTab("font")}
          className="flex-1 min-w-fit"
        >
          <Palette className="w-4 h-4 mr-2" />
          Font
        </Button>
        <Button
          variant={activeTab === "position" ? "default" : "ghost"}
          onClick={() => setActiveTab("position")}
          className="flex-1 min-w-fit"
        >
          <Move className="w-4 h-4 mr-2" />
          Positie
        </Button>
        <Button
          variant={activeTab === "stickers" ? "default" : "ghost"}
          onClick={() => setActiveTab("stickers")}
          className="flex-1 min-w-fit"
        >
          <Sticker className="w-4 h-4 mr-2" />
          Stickers
        </Button>
        <Button
          variant={activeTab === "photos" ? "default" : "ghost"}
          onClick={() => setActiveTab("photos")}
          className="flex-1 min-w-fit"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          {"Foto's"}
        </Button>
        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          onClick={() => setActiveTab("details")}
          className="flex-1 min-w-fit"
        >
          <Type className="w-4 h-4 mr-2" />
          Details
        </Button>
      </div>

      {/* Animation Tab */}
      {activeTab === "animation" && (
        <div className="space-y-4">
          <Label>Titel Animatie</Label>
          <div className="grid grid-cols-3 gap-3">
            {animations.map((anim) => (
              <Card
                key={anim.value}
                className={`p-4 cursor-pointer text-center transition-all text-white bg-primary ${
                  customization.titleAnimation === anim.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() =>
                  onCustomizationChange({
                    ...customization,
                    titleAnimation: anim.value as any,
                  })
                }
              >
                <div className={`text-2xl font-bold mb-2 ${getAnimationClass(anim.value)}`}>{anim.preview}</div>
                <p className="text-xs">{anim.label}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="subtitle">Ondertitel (optioneel)</Label>
            <Input
              id="subtitle"
              placeholder="Bijv. Je bent uitgenodigd!"
              value={customization.subtitleText || ""}
              onChange={(e) =>
                onCustomizationChange({
                  ...customization,
                  subtitleText: e.target.value,
                })
              }
            />
          </div>

          {customization.subtitleText && (
            <>
              <Label>Ondertitel Animatie</Label>
              <div className="grid grid-cols-3 gap-3">
                {animations.slice(0, 4).map((anim) => (
                  <Card
                    key={anim.value}
                    className={`p-4 cursor-pointer text-center transition-all ${
                      customization.subtitleAnimation === anim.value
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      onCustomizationChange({
                        ...customization,
                        subtitleAnimation: anim.value as any,
                      })
                    }
                  >
                    <p className="text-sm">{anim.label}</p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Style Tab */}
      {activeTab === "style" && (
        <div className="space-y-4">
          <Label>Tekst Stijl</Label>
          <div className="grid grid-cols-3 gap-3">
            {styles.map((style) => (
              <Card
                key={style.value}
                className={`p-4 cursor-pointer text-center transition-all ${
                  customization.titleStyle === style.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() =>
                  onCustomizationChange({
                    ...customization,
                    titleStyle: style.value as any,
                  })
                }
              >
                <div className={`text-2xl font-bold mb-2 ${style.class}`}>Aa</div>
                <p className="text-sm">{style.label}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="titleColor">Tekst Kleur</Label>
            <div className="flex gap-2">
              <Input
                id="titleColor"
                type="color"
                value={customization.titleColor || "#ffffff"}
                onChange={(e) =>
                  onCustomizationChange({
                    ...customization,
                    titleColor: e.target.value,
                  })
                }
                className="w-20 h-12"
              />
              <Input
                type="text"
                value={customization.titleColor || "#ffffff"}
                onChange={(e) =>
                  onCustomizationChange({
                    ...customization,
                    titleColor: e.target.value,
                  })
                }
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Font Tab */}
      {activeTab === "font" && (
        <div className="space-y-4">
          <Label>Lettertype</Label>
          <div className="grid grid-cols-2 gap-3">
            {fonts.map((font) => (
              <Card
                key={font.value}
                className={`p-4 cursor-pointer text-center transition-all ${
                  customization.titleFont === font.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() =>
                  onCustomizationChange({
                    ...customization,
                    titleFont: font.value as any,
                  })
                }
              >
                <div className={`text-2xl font-bold mb-2 ${font.class}`}>Aa</div>
                <p className="text-sm">{font.label}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="titleSize">Tekstgrootte</Label>
              <span className="text-sm text-muted-foreground">{customization.titleSize || textSize || 3}rem</span>
            </div>
            {onTextSizeChange && (
              <Slider
                id="titleSize"
                min={1.5}
                max={6}
                step={0.25}
                value={[customization.titleSize || textSize || 3]}
                onValueChange={(value) =>
                  onCustomizationChange({
                    ...customization,
                    titleSize: value[0],
                  })
                }
                className="w-full"
              />
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Klein</span>
              <span>Groot</span>
            </div>
          </div>
        </div>
      )}

      {/* Position Tab */}
      {activeTab === "position" && (
        <div className="space-y-4">
          <Label>Tekst Positie</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Sleep de titel in de preview om deze vrij te positioneren, of kies een voorgedefinieerde positie:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {positions.map((pos) => (
              <Card
                key={pos.value}
                className={`p-6 cursor-pointer text-center transition-all ${
                  customization.titlePosition === pos.value && !customization.titleX
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() =>
                  onCustomizationChange({
                    ...customization,
                    titlePosition: pos.value as any,
                    titleX: undefined,
                    titleY: undefined,
                  })
                }
              >
                <p className="text-sm font-medium">{pos.label}</p>
              </Card>
            ))}
          </div>
          {customization.titleX !== undefined && (
            <Card className="p-4 bg-primary/5 border-primary">
              <p className="text-sm font-medium">Aangepaste positie actief</p>
              <p className="text-xs text-muted-foreground mt-1">
                Sleep de titel om de positie aan te passen, of kies een voorgedefinieerde positie hierboven.
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === "stickers" && (
        <div className="space-y-4">
          <div className="space-y-4">
            {Object.entries(stickerCategories).map(([category, emojis]) => (
              <div key={category}>
                <Label className="capitalize mb-2 block">{category}</Label>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      className="text-3xl h-14 hover:scale-110 transition-transform bg-transparent"
                      onClick={() => addSticker(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedSticker && (
            <Card className="p-4 space-y-4 border-primary">
              <div className="flex items-center justify-between">
                <Label>Geselecteerde Sticker</Label>
                <Button variant="destructive" size="sm" onClick={() => deleteSticker(selectedSticker)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Verwijder
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Grootte</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sticker = customization.stickers?.find((s) => s.id === selectedSticker)
                        if (sticker && sticker.size > 1) {
                          updateSticker(selectedSticker, { size: sticker.size - 1 })
                        }
                      }}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sticker = customization.stickers?.find((s) => s.id === selectedSticker)
                        if (sticker && sticker.size < 3) {
                          updateSticker(selectedSticker, { size: sticker.size + 1 })
                        }
                      }}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Rotatie</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sticker = customization.stickers?.find((s) => s.id === selectedSticker)
                        if (sticker) {
                          updateSticker(selectedSticker, { rotation: (sticker.rotation - 15) % 360 })
                        }
                      }}
                    >
                      <RotateCw className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sticker = customization.stickers?.find((s) => s.id === selectedSticker)
                        if (sticker) {
                          updateSticker(selectedSticker, { rotation: (sticker.rotation + 15) % 360 })
                        }
                      }}
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Sleep de sticker in de preview om deze te verplaatsen</p>
            </Card>
          )}

          {(customization.stickers || []).length === 0 && (
            <Card className="p-8 text-center text-muted-foreground">
              <Sticker className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Klik op een sticker hierboven om deze toe te voegen aan je uitnodiging</p>
            </Card>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-primary/50 rounded-xl p-8 flex flex-col items-center gap-3 transition-all hover:bg-primary/5 cursor-pointer"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Klik om foto{"'"}s te uploaden</span>
            <span className="text-xs text-muted-foreground/60">JPG, PNG of GIF</span>
          </button>

          {/* Uploaded photos grid */}
          {photos.length > 0 && (
            <div className="space-y-3">
              <Label>{"Foto's"} op uitnodiging ({photos.length})</Label>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhoto === photo.id ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedPhoto(photo.id)
                      setSelectedSticker(null)
                    }}
                  >
                    <img src={photo.src || "/placeholder.svg"} alt="Foto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected photo controls */}
          {selectedPhoto && (
            <Card className="p-4 space-y-4 border-primary">
              <div className="flex items-center justify-between">
                <Label>Geselecteerde foto</Label>
                <Button variant="destructive" size="sm" onClick={() => deletePhoto(selectedPhoto)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Verwijder
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Grootte</Label>
                    <span className="text-xs text-muted-foreground">{photos.find((p) => p.id === selectedPhoto)?.size || 25}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={80}
                    step={1}
                    value={[photos.find((p) => p.id === selectedPhoto)?.size || 25]}
                    onValueChange={(value) => updatePhoto(selectedPhoto, { size: value[0] })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Klein</span>
                    <span>Groot</span>
                  </div>
                </div>

                <div>
                  <Label>Rotatie</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => {
                        const photo = photos.find((p) => p.id === selectedPhoto)
                        if (photo) updatePhoto(selectedPhoto, { rotation: (photo.rotation - 15) % 360 })
                      }}
                    >
                      <RotateCw className="w-4 h-4 rotate-180" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => {
                        const photo = photos.find((p) => p.id === selectedPhoto)
                        if (photo) updatePhoto(selectedPhoto, { rotation: (photo.rotation + 15) % 360 })
                      }}
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">Sleep de foto in de preview om deze te verplaatsen</p>
            </Card>
          )}

          {photos.length === 0 && (
            <Card className="p-8 text-center text-muted-foreground">
              <ImagePlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{"Upload foto's om ze op je uitnodiging te plaatsen"}</p>
              <p className="text-xs mt-2">{"Je kunt ze verslepen, draaien en vergroten/verkleinen"}</p>
            </Card>
          )}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Kies welke gegevens zichtbaar zijn op de uitnodiging</p>

          <div className="space-y-3">
            {/* Datum */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${showDate ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <div>
                  <span className="font-medium text-sm">Datum</span>
                  {eventDate && (
                    <p className="text-xs text-muted-foreground">{new Date(eventDate).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  )}
                  {!eventDate && <p className="text-xs text-orange-500">Geen datum ingesteld</p>}
                </div>
              </div>
              <input
                type="checkbox"
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                disabled={!eventDate}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>

            {/* Tijd */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${showTime ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <span className="font-medium text-sm">Tijd</span>
                  {eventTime && <p className="text-xs text-muted-foreground">{eventTime} uur</p>}
                  {!eventTime && <p className="text-xs text-orange-500">Geen tijd ingesteld</p>}
                </div>
              </div>
              <input
                type="checkbox"
                checked={showTime}
                onChange={(e) => setShowTime(e.target.checked)}
                disabled={!eventTime}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>

            {/* Locatie */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${showLocation ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <span className="font-medium text-sm">Locatie</span>
                  {eventLocation && <p className="text-xs text-muted-foreground">{eventLocation}</p>}
                  {!eventLocation && <p className="text-xs text-orange-500">Geen locatie ingesteld</p>}
                </div>
              </div>
              <input
                type="checkbox"
                checked={showLocation}
                onChange={(e) => setShowLocation(e.target.checked)}
                disabled={!eventLocation}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>

            {/* Dresscode */}
            <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${showDresscode ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                <div>
                  <span className="font-medium text-sm">Dresscode</span>
                  {dresscode && dresscode.length > 0 && <p className="text-xs text-muted-foreground">{dresscode.join(", ")}</p>}
                  {(!dresscode || dresscode.length === 0) && <p className="text-xs text-orange-500">Stel eerst een dresscode in via de Dresscode module</p>}
                </div>
              </div>
              <input
                type="checkbox"
                checked={showDresscode}
                onChange={(e) => setShowDresscode(e.target.checked)}
                disabled={!dresscode || dresscode.length === 0}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvitationDesigner
