"use client"

import * as React from "react"
import { VoiceInput } from "@/components/VoiceInput"
import { cn } from "@/lib/utils"

import { useAccessibility } from "@/providers/AccessibilityProvider"
import { CHARACTERS } from "@/lib/characters"
import { speak } from "@/lib/speech"

export default function VoiceCoachPage() {
  const { voiceCharacterId, voiceSpeed } = useAccessibility()
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState("Practice your greeting, or share your thoughts with me.")
  const [interimTranscript, setInterimTranscript] = React.useState("")
  const [coachTip, setCoachTip] = React.useState("I'm ready when you are. Tap the microphone and start speaking.")
  const [isThinking, setIsThinking] = React.useState(false)

  const handleAnalysis = async (text: string) => {
    setTranscript(text)
    setInterimTranscript("")
    setIsThinking(true)
    setCoachTip("Thinking...")
    
    try {
      const character = CHARACTERS.find(c => c.id === voiceCharacterId) || CHARACTERS[0]
      const systemPrompt = character.role === "mentor"
        ? `You are ${character.name}, a wise and patient mentor. Give 2-3 sentences of encouraging, calm feedback in your unique tone.`
        : `You are ${character.name}, a kind and tech-savvy grandchild. Give 2-3 sentences of loving, bright feedback to your grandparent in your unique tone.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `The user says: "${text}"` }
          ]
        }),
      })
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")
      const decoder = new TextDecoder()
      let fullContent = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value)
        
        // Remove error JSON from text if it accidentally appeared
        let cleanText = fullContent
        try {
          const parsed = JSON.parse(fullContent)
          if (parsed.error) cleanText = "I'm having a little trouble connecting right now."
        } catch(e) {}
        
        setCoachTip(cleanText)
      }

      speak(fullContent, voiceCharacterId, voiceSpeed)

    } catch (e) {
      setCoachTip("I had a little trouble processing that. You're doing great though, keep practicing!")
      speak("I had a little trouble processing that. You're doing great though, keep practicing!", voiceCharacterId, voiceSpeed)
    } finally {
      setIsThinking(false)
    }
  }


  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          How can I help <span className="text-secondary">you</span> today?
        </h2>
        <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
          I'm listening closely. Share your thoughts, or just practice your speech with me.
        </p>
      </section>

      {/* The "Voice Canvas" Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch mb-20 px-1">
        
        {/* Large Transcription Area */}
        <div className="flex-grow bg-surface-container-lowest rounded-3xl p-10 shadow-sm min-h-[320px] flex flex-col justify-center relative overflow-hidden group">
          <span className="text-sm text-on-secondary-container mb-4 font-bold tracking-widest uppercase opacity-60">Live Transcription</span>
          <p className="font-headline text-[1.75rem] md:text-[2.25rem] leading-snug font-bold text-on-surface">
            {isListening && interimTranscript ? (
              <span className="opacity-50 italic">"{interimTranscript}..."</span>
            ) : (
              `"${transcript}"`
            )}
          </p>
          
          {/* Waveform Visualization */}
          <div className="mt-8 flex gap-1.5 h-10 items-center">
            {[3, 5, 8, 6, 4, 7, 5, 2, 6, 9, 7, 4].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "waveform-bar",
                  isListening ? "animate-pulse" : "opacity-40"
                )} 
                style={{ height: `${h * 4}px` }} 
              />
            ))}
          </div>
        </div>

        {/* AI Response "Coach Tip" Bubble */}
        <div className="w-full md:w-80 bg-surface-container-high rounded-3xl p-8 flex flex-col justify-between border-l-8 border-primary shadow-sm min-h-[200px]">
          <div>
            <span className="material-symbols-outlined text-primary mb-4 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="font-headline text-xl font-bold mb-3">Coach Tip</h3>
            <p className="text-on-secondary-container leading-relaxed">
              {coachTip}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full bg-primary", (isListening || isThinking) && "animate-pulse")} />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Microphone Control (Tactile Target) */}
      <div className="flex flex-col items-center justify-center gap-6 pb-20">
        <div className="relative">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={cn(
              "group relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 z-10",
              isListening ? "bg-error text-on-error" : "bg-primary text-on-primary"
            )}
          >
            <span className="material-symbols-outlined text-6xl md:text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isListening ? "pause_circle" : "record_voice_over"}
            </span>
          </button>
          
          {/* Animated Halo Rings for Listening State */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-error opacity-20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-error opacity-40 scale-110" />
            </>
          )}
        </div>
        
        <div className="text-center">
          <p className="font-extrabold text-2xl mb-1">{isListening ? "Tap to Pause" : "Tap to Speak"}</p>
          <p className="text-on-secondary-container text-lg font-medium">
            {isListening ? "EchoMentor is listening..." : "I'm ready when you are."}
          </p>
        </div>
      </div>

      <VoiceInput 
        onResult={handleAnalysis} 
        onInterimResult={setInterimTranscript}
        onListeningChange={(listening) => {
          setIsListening(listening)
          if (listening) {
            setInterimTranscript("")
          }
        }}
        isListening={isListening}
        className="hidden"
      />
    </div>
  )
}
