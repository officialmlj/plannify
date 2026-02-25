"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, Send, X, ChevronDown, User } from "lucide-react"

interface ChatMessage {
  id: string
  senderName: string
  message: string
  timestamp: Date
  isHost?: boolean
}

interface EventChatProps {
  eventId: string
  currentUserName: string
  isHost?: boolean
  primaryColor?: string
}

export function EventChat({ eventId, currentUserName, isHost = false, primaryColor = "#6366F1" }: EventChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`chat_${eventId}`)
    if (stored) {
      const parsedMessages = JSON.parse(stored).map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages(parsedMessages)
    } else {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        senderName: "Plannify",
        message: "Welkom bij de groepschat! Hier kun je met alle gasten communiceren.",
        timestamp: new Date(),
        isHost: true,
      }
      setMessages([welcomeMessage])
    }
  }, [eventId])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${eventId}`, JSON.stringify(messages))
    }
  }, [messages, eventId])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setUnreadCount(0)
    }
  }, [messages, isOpen])

  // Track unread messages when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastReadKey = `lastRead_${eventId}_${currentUserName}`
      const lastRead = localStorage.getItem(lastReadKey)
      const lastReadTime = lastRead ? new Date(lastRead) : new Date(0)
      
      const unread = messages.filter(
        (msg) => new Date(msg.timestamp) > lastReadTime && msg.senderName !== currentUserName
      ).length
      setUnreadCount(unread)
    }
  }, [messages, isOpen, eventId, currentUserName])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderName: currentUserName,
      message: newMessage.trim(),
      timestamp: new Date(),
      isHost,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Mark as read
    localStorage.setItem(`lastRead_${eventId}_${currentUserName}`, new Date().toISOString())
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return "Vandaag"
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Gisteren"
    }
    
    return messageDate.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
    })
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = new Date(message.timestamp).toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {} as Record<string, ChatMessage[]>)

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          setUnreadCount(0)
          localStorage.setItem(`lastRead_${eventId}_${currentUserName}`, new Date().toISOString())
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50"
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] flex flex-col shadow-2xl z-50 overflow-hidden border-0">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Groepschat</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
          <div key={dateKey}>
            {/* Date divider */}
            <div className="flex items-center justify-center my-4">
              <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                {formatDate(dateMessages[0].timestamp)}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg) => {
              const isOwn = msg.senderName === currentUserName
              const isSystem = msg.senderName === "Plannify"

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-lg max-w-[80%] text-center">
                      {msg.message}
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`max-w-[75%] ${
                      isOwn
                        ? "rounded-l-xl rounded-tr-xl"
                        : "rounded-r-xl rounded-tl-xl"
                    } px-4 py-2 shadow-sm`}
                    style={{
                      backgroundColor: isOwn ? primaryColor : "white",
                      color: isOwn ? "white" : "inherit",
                    }}
                  >
                    {!isOwn && (
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-semibold" style={{ color: primaryColor }}>
                          {msg.senderName}
                        </span>
                        {msg.isHost && (
                          <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                            Host
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isOwn ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Typ een bericht..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
