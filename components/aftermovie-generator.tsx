"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  X,
  Play,
  Pause,
  Download,
  Music,
  SkipForward,
  SkipBack,
  Settings,
  Type,
  Sparkles,
  Volume2,
  VolumeX,
  AlertCircle,
} from "lucide-react"
import type { Event } from "@/lib/types"

interface PhotoWithSettings {
  id: string
  url: string
  caption?: string
  filter?: string
  duration?: number
}

interface AfterMovieSettings {
  transition: "fade" | "slide" | "zoom" | "none"
  transitionDuration: number
  musicUrl?: string
  musicVolume: number
  defaultPhotoDuration: number
}

interface AfterMovieGeneratorProps {
  event: Event
  open: boolean
  onClose: () => void
}

export function AfterMovieGenerator({ event, open, onClose }: AfterMovieGeneratorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [photoSettings, setPhotoSettings] = useState<PhotoWithSettings[]>(
    (event.photos || []).map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: "",
      filter: "none",
      duration: 3000,
    })),
  )

  const [settings, setSettings] = useState<AfterMovieSettings>({
    transition: "fade",
    transitionDuration: 1000,
    musicVolume: 0.5,
    defaultPhotoDuration: 3000,
  })

  const [musicUploadError, setMusicUploadError] = useState<string | null>(null)

  const hasSpotifyPlaylist = event.spotifyPlaylistUrl || event.partyFields?.spotifyPlaylistUrl

  useEffect(() => {
    if (isPlaying && photoSettings.length > 0) {
      const currentPhoto = photoSettings[currentPhotoIndex]
      const duration = currentPhoto.duration || settings.defaultPhotoDuration

      intervalRef.current = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % photoSettings.length)
      }, duration)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, photoSettings.length, currentPhotoIndex, settings.defaultPhotoDuration, photoSettings])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : settings.musicVolume
      if (isPlaying && settings.musicUrl) {
        audioRef.current.play().catch(() => {
          // Autoplay might be blocked
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, settings.musicUrl, settings.musicVolume, isMuted])

  useEffect(() => {
    if (open) {
      setIsPlaying(true)
      setCurrentPhotoIndex(0)
    } else {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [open])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoSettings.length)
  }

  const handlePrevious = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photoSettings.length) % photoSettings.length)
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setMusicUploadError(null)

    // Check file type
    if (!file.type.startsWith("audio/")) {
      setMusicUploadError("Alleen audio bestanden zijn toegestaan")
      return
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setMusicUploadError(`Bestand is te groot (${fileSizeMB}MB). Maximaal 5MB toegestaan.`)
      e.target.value = "" // Reset input
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const audioUrl = event.target?.result as string
      setSettings((prev) => ({ ...prev, musicUrl: audioUrl }))
    }
    reader.readAsDataURL(file)
  }

  const updatePhotoCaption = (index: number, caption: string) => {
    setPhotoSettings((prev) => prev.map((photo, i) => (i === index ? { ...photo, caption } : photo)))
  }

  const updatePhotoFilter = (index: number, filter: string) => {
    setPhotoSettings((prev) => prev.map((photo, i) => (i === index ? { ...photo, filter } : photo)))
  }

  const getFilterStyle = (filter: string) => {
    switch (filter) {
      case "grayscale":
        return "grayscale(100%)"
      case "sepia":
        return "sepia(100%)"
      case "vintage":
        return "sepia(50%) contrast(110%) brightness(110%)"
      case "bright":
        return "brightness(120%) contrast(110%)"
      case "dark":
        return "brightness(80%) contrast(120%)"
      case "warm":
        return "sepia(30%) saturate(120%)"
      case "cool":
        return "hue-rotate(180deg) saturate(120%)"
      default:
        return "none"
    }
  }

  const getTransitionClass = () => {
    switch (settings.transition) {
      case "slide":
        return "transition-transform duration-1000"
      case "zoom":
        return "transition-all duration-1000"
      case "fade":
      default:
        return "transition-opacity duration-1000"
    }
  }

  const handleDownload = () => {
    // Enhanced HTML with settings
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${event.title} - Aftermovie</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #000; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .slideshow { 
      position: relative; 
      width: 100%; 
      height: 100%; 
    }
    .slide { 
      position: absolute; 
      width: 100%; 
      height: 100%; 
      opacity: 0; 
      transition: opacity ${settings.transitionDuration}ms ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide.active { opacity: 1; }
    .slide img { 
      max-width: 100%; 
      max-height: 100%; 
      object-fit: contain;
    }
    .caption {
      position: absolute;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 32px;
      font-weight: 600;
      text-shadow: 0 4px 12px rgba(0,0,0,0.8);
      text-align: center;
      max-width: 80%;
    }
    .title {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 48px;
      font-weight: bold;
      text-shadow: 0 4px 12px rgba(0,0,0,0.8);
      z-index: 10;
    }
    .info {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-size: 24px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      z-index: 10;
    }
  </style>
</head>
<body>
  <div class="slideshow">
    <div class="title">${event.title}</div>
    ${photoSettings
      .map(
        (photo, index) => `
      <div class="slide ${index === 0 ? "active" : ""}" data-duration="${photo.duration || settings.defaultPhotoDuration}">
        <img src="${photo.url}" alt="Photo ${index + 1}" style="filter: ${getFilterStyle(photo.filter || "none")}" />
        ${photo.caption ? `<div class="caption">${photo.caption}</div>` : ""}
      </div>
    `,
      )
      .join("")}
    <div class="info">${new Date(event.date).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
  ${settings.musicUrl ? `<audio autoplay loop><source src="${settings.musicUrl}" type="audio/mpeg"></audio>` : ""}
  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    
    function showNextSlide() {
      const currentDuration = parseInt(slides[currentSlide].getAttribute('data-duration'));
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
      setTimeout(showNextSlide, currentDuration);
    }
    
    setTimeout(showNextSlide, parseInt(slides[0].getAttribute('data-duration')));
  </script>
</body>
</html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}_aftermovie.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSpotifyEmbedUrl = (url: string) => {
    const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
    if (playlistId) {
      return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`
    }
    return null
  }

  if (!open) return null

  if (photoSettings.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Geen foto's beschikbaar</h2>
          <p className="text-muted-foreground mb-6">Upload eerst foto's om een aftermovie te maken.</p>
          <Button onClick={onClose} className="w-full">
            Sluiten
          </Button>
        </Card>
      </div>
    )
  }

  const currentPhoto = photoSettings[currentPhotoIndex]
  const spotifyEmbedUrl = hasSpotifyPlaylist
    ? getSpotifyEmbedUrl(event.spotifyPlaylistUrl || event.partyFields?.spotifyPlaylistUrl || "")
    : null

  return (
    <div className="fixed inset-0 bg-black z-50">
      {settings.musicUrl && (
        <audio ref={audioRef} loop>
          <source src={settings.musicUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-6 right-24 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      {/* Title Overlay */}
      <div className="absolute top-6 left-6 z-40">
        <h1 className="text-4xl font-bold text-white drop-shadow-2xl">{event.title}</h1>
        <p className="text-lg text-white/80 drop-shadow-lg mt-2">
          {new Date(event.date).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Photo Slideshow */}
      <div className="relative w-full h-full flex items-center justify-center">
        {photoSettings.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 ${getTransitionClass()} ${
              index === currentPhotoIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <img
              src={photo.url || "/placeholder.svg"}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-contain"
              style={{ filter: getFilterStyle(photo.filter || "none") }}
            />
            {photo.caption && (
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 max-w-3xl px-6">
                <p className="text-white text-2xl font-semibold text-center drop-shadow-2xl">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}

        {/* Photo Counter */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm font-medium">
            {currentPhotoIndex + 1} / {photoSettings.length}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <SkipBack className="w-5 h-5 text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <SkipForward className="w-5 h-5 text-white" />
        </Button>

        {settings.musicUrl && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <Download className="w-5 h-5 text-white" />
        </Button>
      </div>

      {showSettings && (
        <div className="absolute top-24 right-6 w-96 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Card className="p-6 bg-black/90 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Aftermovie Instellingen
            </h3>

            {/* Music Upload */}
            <div className="space-y-4 mb-6">
              <Label className="text-white flex items-center gap-2">
                <Music className="w-4 h-4" />
                Muziek
              </Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="bg-white/10 border-white/20 text-white"
                />
                <p className="text-white/60 text-xs">Maximaal 5MB (MP3, WAV, etc.)</p>
                {musicUploadError && (
                  <div className="flex items-start gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{musicUploadError}</p>
                  </div>
                )}
                {settings.musicUrl && !musicUploadError && (
                  <div className="flex items-center gap-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <Music className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm">Muziek toegevoegd</p>
                  </div>
                )}
              </div>
            </div>

            {/* Transition Effect */}
            <div className="space-y-4 mb-6">
              <Label className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Overgangseffect
              </Label>
              <Select
                value={settings.transition}
                onValueChange={(value: any) => setSettings((prev) => ({ ...prev, transition: value }))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="none">Geen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photo Duration */}
            <div className="space-y-4 mb-6">
              <Label className="text-white">Foto duur (seconden)</Label>
              <Slider
                value={[settings.defaultPhotoDuration / 1000]}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, defaultPhotoDuration: value[0] * 1000 }))}
                min={1}
                max={10}
                step={0.5}
                className="w-full"
              />
              <p className="text-white/60 text-sm">{settings.defaultPhotoDuration / 1000}s per foto</p>
            </div>

            {/* Current Photo Settings */}
            <div className="space-y-4 border-t border-white/20 pt-6">
              <Label className="text-white flex items-center gap-2">
                <Type className="w-4 h-4" />
                Huidige foto ({currentPhotoIndex + 1}/{photoSettings.length})
              </Label>

              {/* Caption */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Bijschrift</Label>
                <Textarea
                  value={currentPhoto.caption || ""}
                  onChange={(e) => updatePhotoCaption(currentPhotoIndex, e.target.value)}
                  placeholder="Voeg een bijschrift toe..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  rows={2}
                />
              </div>

              {/* Filter */}
              <div className="space-y-2">
                <Label className="text-white text-sm">Filter</Label>
                <Select
                  value={currentPhoto.filter || "none"}
                  onValueChange={(value) => updatePhotoFilter(currentPhotoIndex, value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Geen filter</SelectItem>
                    <SelectItem value="grayscale">Zwart-wit</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                    <SelectItem value="bright">Helder</SelectItem>
                    <SelectItem value="dark">Donker</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cool">Koel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Spotify Player */}
      {!settings.musicUrl && hasSpotifyPlaylist && spotifyEmbedUrl && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md">
          <Card className="p-4 bg-black/80 backdrop-blur-sm border-white/20">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          </Card>
        </div>
      )}
    </div>
  )
}
