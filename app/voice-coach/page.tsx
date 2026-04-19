"use client"

import * as React from "react"
import { VoiceInput } from "@/components/VoiceInput"
import { RichMessageRenderer } from "@/components/RichMessageRenderer"
import { cn } from "@/lib/utils"

import { useAccessibility } from "@/providers/AccessibilityProvider"
import { CHARACTERS } from "@/lib/characters"
import { speak, warmupSpeech } from "@/lib/speech"
import { getPersonalNimResponse } from "@/lib/ai-client"

export default function VoiceCoachPage() {
  const { 
    voiceCharacterId, voiceSpeed,
    userName, userAge, healthIssues, nvidiaApiKey 
  } = useAccessibility()
  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState("Practice your greeting, or share your thoughts with me.")
  const [interimTranscript, setInterimTranscript] = React.useState("")
  const [coachTip, setCoachTip] = React.useState("I'm ready when you are. Tap the microphone and start speaking.")
  const [isThinking, setIsThinking] = React.useState(false)

  const handleAnalysis = React.useCallback(async (text: string) => {
    setTranscript(text)
    setInterimTranscript("")
    setIsThinking(true)
    setCoachTip("Thinking...")
    
    try {
      const profile = { name: userName, age: userAge, healthIssues, apiKey: nvidiaApiKey }

      const stream = await getPersonalNimResponse(
        [{ role: "user", content: `This is a voice exercise. Listen to what I said and give me one short, helpful tip to improve my speech or just a kind word: "${transcript}"` }],
        profile
      );

      let fullContent = ""
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullContent += content;
        setCoachTip(fullContent)
      }

      speak(fullContent, voiceCharacterId, voiceSpeed)
    } catch (e: any) {
      console.error("Coach Error:", e)
      setCoachTip(e.message?.includes("API Key") 
        ? "I need a 'Brain' to help you! Please go to Settings and enter your NVIDIA API Key." 
        : "I had a little trouble processing that. You're doing great though!")
    } finally {
      setIsThinking(false)
    }
  }, [voiceCharacterId, voiceSpeed, userName, userAge, healthIssues, nvidiaApiKey])

  const handleListeningChange = React.useCallback((listening: boolean) => {
    setIsListening(listening)
    if (listening) {
      setInterimTranscript("")
    }
  }, [])


  return (
    <div className="fluid-container adaptive-p space-y-[clamp(1rem,4vw,3rem)]">
      {/* Editorial Header */}
      <section className="text-left py-6">
        <h2 className="editorial-display-lg mb-4 text-on-surface">
          How can I help <span className="text-secondary">you</span> today?
        </h2>
        <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-on-secondary-container max-w-xl leading-relaxed">
          I'm listening closely. Share your thoughts, or just practice your speech with me.
        </p>
      </section>

      {/* The "Voice Canvas" Layout - Fluid mathematically */}
      <div className="flex flex-wrap lg:flex-nowrap adaptive-gap items-stretch px-1 pb-nav lg:pb-0">
        
        {/* Large Transcription Area */}
        <div className="flex-grow bg-surface-container-lowest adaptive-rounded adaptive-p shadow-sm min-h-[clamp(250px,30vw,380px)] flex flex-col justify-center relative overflow-hidden group border border-outline-variant/10">
          <span className="text-[clamp(0.7rem,1.2vw,0.8rem)] text-on-secondary-container mb-4 font-bold tracking-widest uppercase opacity-60">Live Transcription</span>
          <p className="font-headline text-[clamp(1.5rem,3.5vw,2.5rem)] leading-snug font-bold text-on-surface">
            {isListening && interimTranscript ? (
              <span className="opacity-50 italic">"{interimTranscript}..."</span>
            ) : (
              `"${transcript}"`
            )}
          </p>
          
          {/* Waveform Visualization */}
          <div className="mt-8 flex gap-[clamp(4px,0.8vw,8px)] h-[clamp(2.5rem,5vw,4rem)] items-center">
            {[3, 5, 8, 6, 4, 7, 5, 2, 6, 9, 7, 4].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "waveform-bar",
                  isListening ? "animate-pulse" : "opacity-40"
                )} 
                style={{ 
                  height: `${h * 10}%`,
                  width: 'clamp(4px, 0.8vw, 12px)'
                }} 
              />
            ))}
          </div>
        </div>

        {/* AI Response "Coach Tip" Bubble */}
        <div className="w-full lg:w-[clamp(300px,25vw,400px)] bg-surface-container-high adaptive-rounded adaptive-p flex flex-col justify-between border-l-[clamp(8px,1.5vw,16px)] border-primary shadow-sm min-h-[200px]">
          <div>
            <span className="material-symbols-outlined text-primary mb-4 icon-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="font-headline text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold mb-3">Coach Tip</h3>
            <div className="text-[clamp(1rem,1.8vw,1.2rem)] text-on-secondary-container leading-relaxed">
              <RichMessageRenderer content={coachTip} />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn("w-[clamp(10px,1.5vw,14px)] h-[clamp(10px,1.5vw,14px)] rounded-full bg-primary", (isListening || isThinking) && "animate-pulse")} />
              <span className="text-[clamp(0.75rem,2.2vw,0.9rem)] font-bold text-primary uppercase tracking-wider">
                {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ready"}
              </span>
            </div>
            
            {coachTip && (
              <button 
                onClick={() => speak(coachTip, voiceCharacterId, voiceSpeed)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-sm">volume_up</span>
                Replay Message
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Microphone Control (Tactile Target) */}
      <div className="flex flex-col items-center justify-center gap-[clamp(1.5rem,4vw,3rem)] pb-nav lg:pb-16">
        <div className="relative">
          <button 
            onClick={() => {
              warmupSpeech() // DEPLOYMENT FIX: unlock TTS on user gesture
              setIsListening(!isListening)
            }}
            className={cn(
              "group relative w-[clamp(7rem,20vw,12rem)] h-[clamp(7rem,20vw,12rem)] rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 z-10",
              isListening ? "bg-error text-on-error" : "bg-primary text-on-primary"
            )}
          >
            <span className="material-symbols-outlined text-[clamp(3.5rem,10vw,6rem)]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isListening ? "pause_circle" : "record_voice_over"}
            </span>
          </button>
          
          {/* Animated Halo Rings for Listening State */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-[clamp(4px,1vw,8px)] border-error opacity-20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-[clamp(2px,0.5vw,4px)] border-error opacity-40 scale-110" />
            </>
          )}
        </div>
        
        <div className="text-center">
          <p className="font-extrabold text-[clamp(1.5rem,3vw,2.25rem)] mb-1 leading-tight">{isListening ? "Tap to Pause" : "Tap to Speak"}</p>
          <p className="text-on-secondary-container text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
            {isListening ? "EchoMentor is listening..." : "I'm ready when you are."}
          </p>
        </div>
      </div>

      <VoiceInput 
        onResult={handleAnalysis} 
        onInterimResult={setInterimTranscript}
        onListeningChange={handleListeningChange}
        isListening={isListening}
        className="hidden"
      />
    </div>
  )
}
