"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { VoiceInput } from "@/components/VoiceInput"
import { useAccessibility } from "@/providers/AccessibilityProvider"
import { CHARACTERS } from "@/lib/characters"
import { speak } from "@/lib/speech"

export interface TutorialStep {
  title: string
  content: string
  videoUrl?: string
  targetElement?: string // Selector for highlighting
  actionLabel?: string
}

interface TutorialOverlayProps {
  isOpen: boolean
  steps: TutorialStep[]
  onClose: () => void
}

export function TutorialOverlay({ isOpen, steps, onClose }: TutorialOverlayProps) {
  const { voiceCharacterId, voiceSpeed } = useAccessibility()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isListeningAssistant, setIsListeningAssistant] = React.useState(false)
  const [aiResponse, setAiResponse] = React.useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = React.useState(false)

  if (!isOpen) return null

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const next = () => {
    setAiResponse(null)
    if (isLast) {
      onClose()
      setCurrentStep(0)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleAssistantAsk = async (text: string) => {
    if (!text || text.trim().length < 2) return
    setIsListeningAssistant(false)
    setAiResponse("Thinking of a way to help...")
    
    try {
      const character = CHARACTERS.find(c => c.id === voiceCharacterId) || CHARACTERS[0]
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: `${character.personality} Give a 1-2 sentence simple, encouraging answer related to the current tutorial step. No jargon.` },
            { role: "user", content: `CONTEXT: Current step is "${step.title}" - ${step.content}. THE USER ASKS: "${text}".` }
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
        setAiResponse(fullContent)
      }

      // Speak the response
      speak(fullContent, voiceCharacterId, voiceSpeed)

    } catch (e) {
      setAiResponse("I had a little trouble hearing you. Could you try asking again?")
    } finally {
      setIsListeningAssistant(false)
    }
  }


  return (
    <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-md flex items-center justify-center adaptive-p animate-in fade-in duration-300">
      <div className="bg-surface-bright adaptive-rounded shadow-2xl w-full max-w-[min(92%,800px)] adaptive-p flex flex-col adaptive-gap border-[clamp(2px,0.5vw,4px)] border-primary/10 overflow-y-auto max-h-[95vh] scrollbar-none relative">
        
        {/* Progress & Header */}
        <div className="space-y-[clamp(1rem,2vw,1.5rem)]">
          <div className="flex gap-[clamp(4px,0.8vw,8px)]">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-[clamp(6px,1vw,8px)] rounded-full transition-all duration-500",
                  i === currentStep ? "bg-primary w-[clamp(2rem,6vw,3rem)]" : "bg-surface-container-highest w-[clamp(8px,1.5vw,12px)]"
                )}
              />
            ))}
          </div>
          <h2 className="text-[clamp(1.75rem,5vw,3rem)] font-black text-on-surface leading-tight">
            {step.title}
          </h2>
        </div>

        {/* Video Player - Mathematically Proportional */}
        {step.videoUrl && (
          <div className="aspect-video bg-surface-container-highest rounded-[clamp(1rem,2vw,2rem)] overflow-hidden shadow-inner ring-1 ring-outline-variant/10">
            <iframe 
              src={step.videoUrl} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-[clamp(1.1rem,2.2vw,1.5rem)] text-on-surface-variant font-medium leading-relaxed">
          {step.content}
        </p>

        {/* AI Assistant Bubble - Fluid */}
        {aiResponse && (
          <div className="bg-secondary-container rounded-[clamp(1rem,2vw,2rem)] p-[clamp(1rem,2.5vw,2rem)] border-l-[clamp(6px,1vw,10px)] border-primary animate-in slide-in-from-left-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={cn("w-[clamp(10px,1.5vw,14px)] h-[clamp(10px,1.5vw,14px)] rounded-full bg-primary", isSpeaking && "animate-pulse")} />
              <span className="text-[clamp(0.6rem,1vw,0.75rem)] font-black uppercase tracking-widest text-primary">Guide's Response</span>
            </div>
            <p className="text-[clamp(1rem,1.8vw,1.25rem)] font-bold text-on-surface leading-snug">
              {aiResponse}
            </p>
          </div>
        )}

        <div className="flex flex-col adaptive-gap mt-4">
          <div className="flex adaptive-gap">
            <button 
              onClick={next}
              className="flex-[2] h-[clamp(4rem,8vw,5.5rem)] bg-primary text-on-primary rounded-[clamp(1rem,2vw,1.5rem)] text-[clamp(1.1rem,2.2vw,1.5rem)] font-black hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {isLast ? "Close Tutorial" : (step.actionLabel || "Next Step")}
              {!isLast && <span className="material-symbols-outlined icon-sm">arrow_forward</span>}
            </button>
            
            <button 
              onClick={() => setIsListeningAssistant(!isListeningAssistant)}
              className={cn(
                "flex-1 h-[clamp(4rem,8vw,5.5rem)] rounded-[clamp(1rem,2vw,1.5rem)] text-[clamp(1rem,1.8vw,1.2rem)] font-black transition-all flex flex-col items-center justify-center gap-1 shadow-sm",
                isListeningAssistant ? "bg-error text-on-error" : "bg-surface-container-high text-primary border-[clamp(2px,0.5vw,4px)] border-primary/10"
              )}
            >
              <span className="material-symbols-outlined icon-sm">
                {isListeningAssistant ? "mic_off" : "chat_bubble"}
              </span>
              <span className="text-[clamp(0.5rem,0.8vw,0.65rem)] uppercase tracking-tighter">Ask Guide</span>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full h-14 text-on-surface-variant rounded-[clamp(1rem,2vw,1.5rem)] text-[clamp(0.9rem,1.5vw,1.1rem)] font-bold hover:bg-surface-container transition-colors opacity-60"
          >
            I'm done for now
          </button>
        </div>

        <div className="flex items-center gap-3 opacity-40 py-4 border-t border-outline-variant/10">
          <span className="material-symbols-outlined icon-xs">lightbulb</span>
          <p className="text-[clamp(0.7rem,1.2vw,0.8rem)] font-bold uppercase tracking-widest">Echo Tip: Tap 'Ask Guide' if you get stuck.</p>
        </div>
      </div>

      <VoiceInput 
        onResult={handleAssistantAsk}
        isListening={isListeningAssistant}
        className="hidden"
      />
    </div>
  )
}
