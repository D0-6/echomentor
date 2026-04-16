"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, ArrowLeft, Loader2, Volume2, Sparkles, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ChatMessage as MyChatMessage } from "@/components/ChatMessage"
import { SeniorButton } from "@/components/SeniorButton"
import { VoiceInput } from "@/components/VoiceInput"

export default function VoiceCoachPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([
    { role: "assistant", content: "Hello! I'm EchoMentor. I'm so happy to see you. How can I help you today? You can type your message or just tap the microphone to talk to me." }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  const handleSpeak = useCallback((text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }, [])

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault()
    
    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading) return

    const userMsg = { role: "user", content: textToSend } as const
    setMessages(prev => [...prev, userMsg])
    if (!customInput) setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!response.ok) throw new Error("Failed to fetch response")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let assistantMsg = ""
      setMessages(prev => [...prev, { role: "assistant", content: "" }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMsg += chunk
        setMessages(prev => {
          const newMsgs = [...prev]
          newMsgs[newMsgs.length - 1].content = assistantMsg
          return newMsgs
        })
      }
      
      handleSpeak(assistantMsg)
      
    } catch (error) {
      console.error("Fetch Error:", error)
      const errorMsg = "I'm sorry, I'm having a little trouble thinking right now. Could we try again in a moment?"
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }])
      handleSpeak(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceResult = (text: string) => {
    handleSubmit(undefined, text)
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/5 animate-in fade-in duration-500">
      <div className="glass-header p-8 flex items-center justify-between">
        <Link href="/">
          <SeniorButton 
            label="Home" 
            variant="ghost" 
            className="h-16 text-2xl px-6 border-hidden hover:bg-primary/5" 
            icon={<ArrowLeft className="h-8 w-8 text-primary" />}
          />
        </Link>
        <div className="flex items-center gap-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-primary gold-glow">Voice Coach</h2>
        </div>
        <div className="w-24"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-20 space-y-6 max-w-5xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className="relative group">
            <MyChatMessage role={msg.role} content={msg.content} />
            {msg.role === "assistant" && msg.content && (
              <button 
                onClick={() => handleSpeak(msg.content)}
                className="absolute -right-16 top-1/2 -translate-y-1/2 p-5 bg-card/80 backdrop-blur-md border border-primary/20 text-primary rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
              >
                <Volume2 className="h-10 w-10" />
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card/50 backdrop-blur-md border-2 border-primary/10 p-10 rounded-[3rem] rounded-bl-sm shadow-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-background/90 backdrop-blur-xl border-t-2 border-primary/10 p-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
          <VoiceInput onResult={handleVoiceResult} disabled={isLoading} />
          <div className="w-full h-px bg-primary/10"></div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full flex items-center gap-4 bg-muted/5 p-4 rounded-[2.5rem] border-2 border-primary/10 focus-within:border-primary transition-all">
              <MessageSquare className="h-10 w-10 text-muted-foreground ml-4" />
              <input 
                placeholder="Type your message here..."
                className="w-full text-3xl p-4 bg-transparent border-none outline-none font-medium placeholder:opacity-30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
            </div>
            <SeniorButton type="submit" label="Send" icon={<Send className="h-10 w-10 text-primary-foreground" />} disabled={isLoading || !input.trim()} />
          </form>
          <p className="text-xl font-black uppercase tracking-[0.2em] opacity-40 text-center">Tap the microphone above to talk to me.</p>
        </div>
      </div>
    </div>
  )
}
