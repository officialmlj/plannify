"use client"

import { Card } from "@/components/ui/card"
import { Music } from "lucide-react"

interface SpotifyPlayerProps {
  playlistUrl: string
}

export function SpotifyPlayer({ playlistUrl }: SpotifyPlayerProps) {
  // Extract playlist ID from Spotify URL
  const getPlaylistId = (url: string) => {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  const playlistId = getPlaylistId(playlistUrl)

  if (!playlistId) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-bold">Spotify Playlist</h3>
        </div>
        <p className="text-sm text-muted-foreground">Ongeldige Spotify playlist URL</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold">Spotify Playlist</h3>
      </div>
      <div className="rounded-lg overflow-hidden">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        />
      </div>
    </Card>
  )
}
