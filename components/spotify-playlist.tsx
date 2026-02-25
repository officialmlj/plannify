"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  Music, 
  Plus, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ListMusic,
  Play
} from "lucide-react"

interface SpotifyPlaylistProps {
  eventId: string
  playlistUrl?: string
  onPlaylistChange?: (url: string) => void
  isHost?: boolean
  primaryColor?: string
}

export function SpotifyPlaylist({ 
  eventId, 
  playlistUrl: initialUrl = "",
  onPlaylistChange,
  isHost = true,
  primaryColor = "#6366F1"
}: SpotifyPlaylistProps) {
  const [playlistUrl, setPlaylistUrl] = useState(initialUrl)
  const [inputUrl, setInputUrl] = useState("")
  const [showPlaylist, setShowPlaylist] = useState(true)
  const [songSuggestions, setSongSuggestions] = useState<string[]>([
    "Uptown Funk - Bruno Mars",
    "Happy - Pharrell Williams", 
    "Can't Stop the Feeling - Justin Timberlake"
  ])
  const [newSuggestion, setNewSuggestion] = useState("")

  const getSpotifyEmbedUrl = (url: string) => {
    // Handle different Spotify URL formats
    const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/)
    const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/)
    const albumMatch = url.match(/album\/([a-zA-Z0-9]+)/)
    
    if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}?utm_source=generator&theme=0`
    }
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&theme=0`
    }
    if (albumMatch) {
      return `https://open.spotify.com/embed/album/${albumMatch[1]}?utm_source=generator&theme=0`
    }
    return null
  }

  const handleAddPlaylist = () => {
    if (!inputUrl.trim()) return
    const embedUrl = getSpotifyEmbedUrl(inputUrl)
    if (embedUrl) {
      setPlaylistUrl(inputUrl)
      onPlaylistChange?.(inputUrl)
      setInputUrl("")
    }
  }

  const addSongSuggestion = () => {
    if (!newSuggestion.trim()) return
    setSongSuggestions([...songSuggestions, newSuggestion])
    setNewSuggestion("")
  }

  const embedUrl = playlistUrl ? getSpotifyEmbedUrl(playlistUrl) : null

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setShowPlaylist(!showPlaylist)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#1B1B47]/80 to-[#09091C]/80 hover:from-[#1B1B47] hover:to-[#09091C]/90 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#1DB95420" }}
          >
            <Music className="w-5 h-5 text-[#1DB954]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Spotify Playlist</h3>
            <p className="text-sm text-white/60">
              {embedUrl ? "Playlist gekoppeld" : "Voeg muziek toe"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#1DB95420", color: "#1DB954" }}
          >
            Spotify
          </div>
          {showPlaylist ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </div>
      </button>

      {showPlaylist && (
        <div className="p-4 space-y-4 bg-[#09091C]/50">
          {/* Spotify Embed */}
          {embedUrl ? (
            <div className="rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              />
              
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={() => window.open(playlistUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Spotify
                </Button>
                {isHost && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    onClick={() => setPlaylistUrl("")}
                  >
                    Wijzig
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Add playlist input */}
              {isHost && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Plak Spotify playlist URL..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddPlaylist()}
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button 
                      onClick={handleAddPlaylist}
                      style={{ backgroundColor: "#1DB954" }}
                      disabled={!inputUrl.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Koppel
                    </Button>
                  </div>
                  
                  <p className="text-xs text-white/50">
                    Tip: Open Spotify, ga naar je playlist, klik op "Delen" en kopieer de link.
                  </p>
                </div>
              )}

              {/* Quick playlist suggestions */}
              <div className="space-y-2">
                <p className="text-sm text-white/60 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                  Populaire feest playlists
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Party Hits 2026", id: "37i9dQZF1DXaXB8fQg7xif" },
                    { name: "All Out 2020s", id: "37i9dQZF1DX7rPE0Vn5EPZK" },
                    { name: "Dance Party", id: "37i9dQZF1DX0BcQWzuB7ZO" },
                  ].map(playlist => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        const url = `https://open.spotify.com/playlist/${playlist.id}`
                        setPlaylistUrl(url)
                        onPlaylistChange?.(url)
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded bg-[#1DB954]/20 flex items-center justify-center">
                        <Play className="w-5 h-5 text-[#1DB954]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{playlist.name}</p>
                        <p className="text-xs text-white/50">Spotify Playlist</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Song suggestions from guests */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <p className="text-sm text-white/60 flex items-center gap-2">
              <ListMusic className="w-4 h-4" />
              Muziek suggesties van gasten
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Stel een nummer voor..."
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSongSuggestion()}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button 
                onClick={addSongSuggestion}
                size="icon"
                style={{ backgroundColor: primaryColor }}
                disabled={!newSuggestion.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {songSuggestions.map((song, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded bg-white/5"
                >
                  <Music className="w-4 h-4 text-[#1DB954]" />
                  <span className="text-sm text-white">{song}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
