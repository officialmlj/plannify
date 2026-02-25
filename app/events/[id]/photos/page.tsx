"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getEventById } from "@/lib/storage"
import type { Event, Photo } from "@/lib/types"
import { Camera, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function PhotoAlbumPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  useEffect(() => {
    if (params.id) {
      const foundEvent = getEventById(params.id as string)
      setEvent(foundEvent)
    }
  }, [params.id])

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Event niet gevonden</div>
      </div>
    )
  }

  const photos = event.photos || []

  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 text-white hover:text-sky-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Terug</span>
              </button>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Geen foto's</h1>
          <p className="text-slate-400">Er zijn nog geen foto's geüpload voor dit evenement</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % photos.length
    setSelectedIndex(nextIndex)
    setSelectedPhoto(photos[nextIndex])
  }

  const handlePrev = () => {
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length
    setSelectedIndex(prevIndex)
    setSelectedPhoto(photos[prevIndex])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 text-white hover:text-sky-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Terug</span>
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">{event.title}</h1>
              <p className="text-sm text-slate-400">{photos.length} foto's</p>
            </div>
          </div>
          <Camera className="w-6 h-6 text-sky-400" />
        </div>
      </header>

      {/* Photo Grid */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-white/5 border border-white/10"
              onClick={() => {
                setSelectedPhoto(photo)
                setSelectedIndex(index)
              }}
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {photo.uploadedBy && (
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">{photo.uploadedBy}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-sky-400 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-4 text-white hover:text-sky-400 transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 text-white hover:text-sky-400 transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url || "/placeholder.svg"}
                alt="Selected photo"
                className="w-full h-full object-contain rounded-lg"
              />
              {selectedPhoto.uploadedBy && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-white text-sm">Geüpload door {selectedPhoto.uploadedBy}</p>
                </div>
              )}
              <div className="absolute bottom-4 right-4 text-white text-sm bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                {selectedIndex + 1} / {photos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
