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
    <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-surface-bright rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 md:p-16 flex flex-col gap-8 border-4 border-primary/10 overflow-y-auto max-h-[90vh]">
        
        {/* Progress & Header */}
        <div className="space-y-6">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === currentStep ? "bg-primary w-12" : "bg-surface-container-highest w-4"
                )}
              />
            ))}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight">
            {step.title}
          </h2>
        </div>

        {/* Video Player */}
        {step.videoUrl && (
          <div className="aspect-video bg-surface-container-highest rounded-3xl overflow-hidden shadow-inner ring-1 ring-outline-variant/10">
            <iframe 
              src={step.videoUrl} 
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">
          {step.content}
        </p>

        {/* AI Assistant Bubble */}
        {aiResponse && (
          <div className="bg-secondary-container rounded-3xl p-6 border-l-8 border-primary animate-in slide-in-from-left-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={cn("w-3 h-3 rounded-full bg-primary", isSpeaking && "animate-pulse")} />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Guide's Response</span>
            </div>
            <p className="text-xl font-bold text-on-surface leading-snug">
              {aiResponse}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex gap-4">
            <button 
              onClick={next}
              className="flex-[2] h-20 bg-primary text-on-primary rounded-2xl text-2xl font-black hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {isLast ? "Close Tutorial" : (step.actionLabel || "Next Step")}
              {!isLast && <span className="material-symbols-outlined text-3xl">arrow_forward</span>}
            </button>
            
            <button 
              onClick={() => setIsListeningAssistant(!isListeningAssistant)}
              className={cn(
                "flex-1 h-20 rounded-2xl text-xl font-black transition-all flex flex-col items-center justify-center gap-1 shadow-sm",
                isListeningAssistant ? "bg-error text-on-error" : "bg-surface-container-high text-primary border-4 border-primary/10"
              )}
            >
              <span className="material-symbols-outlined text-3xl">
                {isListeningAssistant ? "mic_off" : "chat_bubble"}
              </span>
              <span className="text-[10px] uppercase tracking-tighter">Ask Guide</span>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full h-14 text-on-surface-variant rounded-2xl text-lg font-bold hover:bg-surface-container transition-colors opacity-60"
          >
            I'm done for now
          </button>
        </div>

        <div className="flex items-center gap-3 opacity-40 py-2 border-t border-outline-variant/10">
          <span className="material-symbols-outlined">lightbulb</span>
          <p className="text-sm font-bold uppercase tracking-widest">Echo Tip: Tap 'Ask Guide' if you get stuck.</p>
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
