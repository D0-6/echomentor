"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onResult: (text: string) => void
  onInterimResult?: (text: string) => void
  onListeningChange?: (isListening: boolean) => void
  isListening?: boolean
  disabled?: boolean
  className?: string
  customTrigger?: React.ReactNode
}

export function VoiceInput({ 
  onResult, 
  onInterimResult,
  onListeningChange, 
  isListening: controlledIsListening,
  disabled, 
  className,
  customTrigger 
}: VoiceInputProps) {
  const [internalIsListening, setInternalIsListening] = React.useState(false)
  const isListening = controlledIsListening !== undefined ? controlledIsListening : internalIsListening
  const setIsListening = controlledIsListening !== undefined ? () => {} : setInternalIsListening

  const [error, setError] = React.useState<string | null>(null)
  const recognitionRef = React.useRef<any>(null)

  // Explicitly handle controlled state changes
  React.useEffect(() => {
    if (controlledIsListening === true && !internalIsListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          // Ignore if already started
        }
      }
    } else if (controlledIsListening === false && internalIsListening) {
      recognitionRef.current?.stop()
    }
  }, [controlledIsListening])

  React.useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false // Auto-stop on pause for clear conversational turns
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        onListeningChange?.(true)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript)
        }
        
        if (interimTranscript && onInterimResult) {
          onInterimResult(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error("Speech Recognition Error:", event.error)
          setError("I didn't quite catch that. Try again?")
        }
        // Even on 'no-speech', we shouldn't necessarily stop listening if continuous is true
        // But for predictable state, we stop it and let user tap again if needed.
        setIsListening(false)
        onListeningChange?.(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        onListeningChange?.(false)
      }

      recognitionRef.current = recognition
    } else {
      setError("Voice search not supported in this browser.")
    }
  }, [onResult, onListeningChange])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    }
  }

  return (
    <div 
      className={cn("flex flex-col items-center gap-4", className)}
      onClick={toggleListening}
    >
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center transition-all chat-icon-btn",
          !customTrigger && "h-24 w-24 rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-95"
        )}
        aria-label={isListening ? "Stop Listening" : "Start Listening"}
      >
        {customTrigger ? customTrigger : (
          <span className="material-symbols-outlined text-4xl">
            {isListening ? "mic_off" : "mic"}
          </span>
        )}
      </button>
      
      {error && !customTrigger && (
        <p className="text-xl font-bold text-red-500 animate-in fade-in slide-in-from-top-2">
          {error}
        </p>
      )}
    </div>
  )
}
