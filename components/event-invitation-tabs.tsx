"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EventInvitation } from "./event-invitation"
import type { Event, Photo } from "@/lib/types"
import { MessageSquare, ImageIcon, DollarSign, Info, Upload, Home } from "lucide-react"
import { updateEvent, getEvent } from "@/lib/storage"
import { CostCalculator } from "./cost-calculator"
import { useTranslation } from "@/lib/use-translation"
import Link from "next/link"

interface EventInvitationTabsProps {
  event: Event
}

export function EventInvitationTabs({ event: initialEvent }: EventInvitationTabsProps) {
  const [event, setEvent] = useState(initialEvent)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEvent = getEvent(event.id)
      if (updatedEvent) {
        setEvent(updatedEvent)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [event.id])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhoto(true)

    try {
      const newPhotos: Photo[] = []

      for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i]

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is te groot. Maximaal 5MB per foto.`)
          continue
        }

        const reader = new FileReader()

        await new Promise((resolve, reject) => {
          reader.onload = (event) => {
            const base64String = event.target?.result as string
            newPhotos.push({
              id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              url: base64String,
              uploadedBy: "Gast",
              uploadedAt: new Date(),
            })
            resolve(null)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const updatedPhotos = [...(event.photos || []), ...newPhotos]
      const updatedEvent = { ...event, photos: updatedPhotos }
      updateEvent(event.id, updatedEvent)
      setEvent(updatedEvent)
    } catch (error) {
      console.error("[v0] Error uploading photos:", error)
      alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
    } finally {
      setUploadingPhoto(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 bg-sky-700">
      <div className="container mx-auto px-4 pt-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Terug naar home</span>
            </Button>
          </Link>
          <div className="bg-white rounded-lg p-1.5">
            <img src="/logo.png" alt="Plannify Logo" className="w-10 h-10 object-contain" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm bg-sky-700">
          <div className="container mx-auto px-2 md:px-4">
            <TabsList className="w-full grid grid-cols-4 h-14 md:h-16 bg-transparent gap-1">
              <TabsTrigger
                value="overview"
                className="flex flex-col gap-0.5 md:gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all px-2"
              >
                <Info className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-medium">{t("overview")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex flex-col gap-0.5 md:gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all px-2"
              >
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-medium">{t("chat")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex flex-col gap-0.5 md:gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all px-2 relative"
              >
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-medium">{t("media")}</span>
                {event.photos && event.photos.length > 0 && (
                  <span className="absolute top-1 right-1 md:top-2 md:right-2 w-4 h-4 md:w-5 md:h-5 bg-primary text-white text-[10px] md:text-xs rounded-full flex items-center justify-center">
                    {event.photos.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="budget"
                className="flex flex-col gap-0.5 md:gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all px-2"
              >
                <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-medium">{t("budget")}</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <EventInvitation event={event} />
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-5 md:p-6 text-white">
                  <MessageSquare className="w-10 h-10 md:w-12 md:h-12 mb-2 md:mb-3" />
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{t("eventChat")}</h3>
                  <p className="text-white/90 text-sm md:text-base">{t("chatDescription")}</p>
                </div>
                <div className="p-6 md:p-8 text-center">
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">{t("chatComingSoon")}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{t("chatFeatures")}</p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="mt-0">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
              <Card className="p-5 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{t("photosVideos")}</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {event.photos && event.photos.length > 0
                        ? `${event.photos.length} ${event.photos.length === 1 ? t("photoUploaded") : t("photosUploaded")}`
                        : t("noPhotos")}
                    </p>
                  </div>
                  <Label htmlFor="media-upload" className="cursor-pointer w-full sm:w-auto">
                    <Button
                      className="bg-primary hover:bg-primary-hover text-white w-full sm:w-auto"
                      disabled={uploadingPhoto}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingPhoto ? t("uploading") : t("uploadPhotos")}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="media-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </div>

                {event.photos && event.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {event.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors group"
                      >
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={t("eventPhoto")}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                    <ImageIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4 text-sm md:text-base">{t("noPhotos")}</p>
                    <Label htmlFor="media-upload-empty" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {t("uploadFirstPhoto")}
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="media-upload-empty"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="mt-0">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-2xl mx-auto">
              <CostCalculator event={event} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
