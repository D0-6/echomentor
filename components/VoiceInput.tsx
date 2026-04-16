"use client"

import * as React from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onResult: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onResult, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const recognitionRef = React.useRef<any>(null)

  React.useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onResult(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error)
        setError("I didn't quite catch that. Try again?")
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      setError("Voice search not supported in this browser.")
    }
  }, [onResult])

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
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          "h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative group overflow-hidden",
          isListening 
            ? "bg-red-500 text-white animate-pulse ring-8 ring-red-500/20" 
            : "bg-primary text-primary-foreground hover:scale-110 active:scale-95"
        )}
        aria-label={isListening ? "Stop Listening" : "Start Listening"}
      >
        {isListening ? (
          <MicOff className="h-10 w-10 animate-bounce" />
        ) : (
          <Mic className="h-10 w-10" />
        )}
        
        {/* Animated Ripple Effect when listening */}
        {isListening && (
           <>
             <div className="absolute inset-0 bg-white/20 animate-ping rounded-full"></div>
             <div className="absolute inset-0 bg-white/10 animate-[ping_1.5s_infinite] rounded-full delay-75"></div>
           </>
        )}
      </button>
      
      {error && (
        <p className="text-xl font-bold text-red-500 animate-in fade-in slide-in-from-top-2">
          {error}
        </p>
      )}
      
      <p className="text-xl font-black uppercase tracking-widest text-primary/60">
        {isListening ? "I'm listening..." : "Tap to Speak"}
      </p>
    </div>
  )
}
