"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { VoiceInput } from "@/components/VoiceInput"
import { cn } from "@/lib/utils"

export default function VoiceCoachPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([
    { role: "assistant", content: "Hello! I'm EchoMentor. I'm so happy to see you. How can I help you today?" }
  ])
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastTranscript, setLastTranscript] = useState("")

  const handleSpeak = useCallback((text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg = { role: "user", content: text } as const
    setMessages(prev => [...prev, userMsg])
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
    setLastTranscript(text)
    sendMessage(text)
  }

  const currentTranscription = messages[messages.length - 1]?.role === "user" 
    ? messages[messages.length - 1].content 
    : "I'm listening, take your time."

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant")?.content || "Speak clearly whenever you're ready."

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full p-12 animate-in fade-in duration-700">
      {/* Listening Animation / Icon Cluster */}
      <div className="relative flex items-center justify-center mb-16">
        <div className={cn(
          "absolute w-64 h-64 bg-secondary-container rounded-full transition-all duration-700",
          isListening ? "opacity-20 scale-110 animate-pulse" : "opacity-10 scale-100"
        )}></div>
        <div className={cn(
          "absolute w-48 h-48 bg-secondary-container rounded-full transition-all duration-700",
          isListening ? "opacity-40 scale-105 animate-pulse delay-75" : "opacity-20 scale-100"
        )}></div>
        <div className="relative w-32 h-32 bg-primary flex items-center justify-center rounded-full shadow-2xl z-10">
          <VoiceInput 
            onResult={handleVoiceResult} 
            onListeningChange={setIsListening}
            disabled={isLoading}
            className="w-full h-full flex items-center justify-center"
            customTrigger={
              <span className="material-symbols-outlined text-on-primary text-5xl cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            }
          />
        </div>
      </div>

      {/* Contextual Status */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-on-surface mb-4 tracking-tight">
          {isListening ? "I'm listening, take your time." : "Tap the mic to talk to me"}
        </h2>
        <p className="text-on-secondary-container text-xl font-medium">
          {isLoading ? "Thinking..." : "Speak clearly whenever you're ready."}
        </p>
      </div>

      {/* Asymmetric Bento Grid for Transcription and Tips */}
      <div className="grid grid-cols-12 gap-8 w-full mt-8">
        {/* Main Transcription Area */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-10 shadow-[0_10px_40px_-10px_rgba(11,28,48,0.08)]">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary-fixed-dim">notes</span>
            <span className="text-label-md text-on-secondary-container font-bold tracking-widest uppercase">LATEST INTERACTION</span>
          </div>
          <p className="text-[2.25rem] font-headline font-bold text-on-surface leading-tight min-h-[120px]">
            {isLoading ? (
              <span className="opacity-50 italic">Processing your request...</span>
            ) : (
              `"${lastAssistantMsg.slice(0, 150)}${lastAssistantMsg.length > 150 ? '...' : ''}"`
            )}
          </p>
          <div className="mt-8 flex gap-2">
            <div className="h-1 w-8 bg-primary rounded-full"></div>
            <div className="h-1 w-4 bg-surface-container-high rounded-full"></div>
            <div className="h-1 w-4 bg-surface-container-high rounded-full"></div>
          </div>
        </div>

        {/* Integration: Coach Tips */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-low rounded-xl p-8 border-l-8 border-primary shadow-sm h-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h3 className="text-xl font-bold text-on-surface">Coach Tip</h3>
            </div>
            <p className="text-on-secondary-container text-lg leading-relaxed">
              Try asking me specifically about <span className="text-primary font-bold">"Computer Updates"</span>. I can walk you through it step-by-step.
            </p>
          </div>

          <div className="bg-surface-container rounded-xl p-8 shadow-sm">
            <h4 className="text-on-secondary-container font-bold text-sm tracking-widest mb-6 uppercase">SESSION INSIGHT</h4>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-on-surface">Pace</span>
              <span className="text-on-secondary-container">Calm</span>
            </div>
            <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[40%] rounded-full animate-pulse"></div>
            </div>
            <p className="mt-4 text-on-secondary-container text-sm">Your speech rate is perfect for clear recognition.</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-4 items-end">
        <div className="bg-surface-bright/90 backdrop-blur-xl p-6 rounded-xl shadow-[0_10px_40px_-10px_rgba(11,28,48,0.15)] max-w-xs flex flex-col gap-4">
          <p className="text-on-surface text-sm font-medium">Need to pause? Just say "Pause listening" or click below.</p>
          <div className="flex gap-2">
            <button className="flex-1 h-12 bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">pause</span>
              Pause
            </button>
            <button className="flex-1 h-12 bg-error-container text-on-error-container rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined">stop</span>
              End
            </button>
          </div>
        </div>
        <button className="w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-3xl">help</span>
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-surface-container-low rounded-full blur-[120px] opacity-60 translate-x-1/2 -translate-y-1/4"></div>
      <div className="fixed bottom-0 left-80 -z-10 w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px] opacity-30 -translate-x-1/4 translate-y-1/4"></div>
    </div>
  )
}
