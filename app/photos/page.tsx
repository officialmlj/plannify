"use client"

import { useEffect, useState } from "react"
import { getAllEvents } from "@/lib/storage"
import type { Event, Photo } from "@/lib/types"
import { Camera, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PhotosGalleryPage() {
  const [allPhotos, setAllPhotos] = useState<Array<{ photo: Photo; event: Event }>>([])

  useEffect(() => {
    const events = getAllEvents()
    const photosWithEvents: Array<{ photo: Photo; event: Event }> = []

    events.forEach((event) => {
      if (event.photos && event.photos.length > 0) {
        event.photos.forEach((photo) => {
          photosWithEvents.push({ photo, event })
        })
      }
    })

    // Sort by newest photos first
    photosWithEvents.sort((a, b) => {
      const dateA = new Date(a.photo.uploadedAt || a.event.date).getTime()
      const dateB = new Date(b.photo.uploadedAt || b.event.date).getTime()
      return dateB - dateA
    })

    setAllPhotos(photosWithEvents)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E293B]">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0B1220]/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Terug naar home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">Foto Galerij</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Alle Foto's</h1>
            <p className="text-slate-300 text-lg">
              {allPhotos.length > 0
                ? `${allPhotos.length} foto${allPhotos.length !== 1 ? "'s" : ""} van al je evenementen`
                : "Nog geen foto's geüpload"}
            </p>
          </div>

          {allPhotos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-sky-400/20 blur-3xl rounded-full" />
                <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-full p-8">
                  <Camera className="w-16 h-16 text-sky-400 mx-auto" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Nog geen foto's</h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto">
                Begin met het organiseren van een feest en upload foto's om je galerij te vullen
              </p>
              <Link href="/create">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl">
                  <Camera className="w-5 h-5" />
                  Maak je eerste feest
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {allPhotos.map(({ photo, event }, index) => (
                <Link key={photo.id} href={`/events/${event.id}/photos`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer"
                  >
                    {/* Photo */}
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={`Photo from ${event.title}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-semibold text-sm mb-1 line-clamp-1">{event.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(event.date).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          {photo.uploadedBy && (
                            <span className="flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {photo.uploadedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
