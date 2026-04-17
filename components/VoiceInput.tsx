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

  // Use refs for callbacks to prevent effect re-runs
  const onResultRef = React.useRef(onResult)
  const onInterimResultRef = React.useRef(onInterimResult)
  const onListeningChangeRef = React.useRef(onListeningChange)

  React.useEffect(() => {
    onResultRef.current = onResult
    onInterimResultRef.current = onInterimResult
    onListeningChangeRef.current = onListeningChange
  }, [onResult, onInterimResult, onListeningChange])

  // Explicitly handle controlled state changes
  React.useEffect(() => {
    if (controlledIsListening === true) {
      if (recognitionRef.current) {
        try { recognitionRef.current.start() } catch (e) {}
      }
    } else if (controlledIsListening === false) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch (e) {}
      }
    }
  }, [controlledIsListening])

  React.useEffect(() => {
    // DEPLOYMENT FIX: Web Speech API requires a SECURE context (HTTPS)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setError("Voice requires a secure (HTTPS) connection. Please use HTTPS to enable the microphone.")
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Please try Chrome or Edge.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      onListeningChangeRef.current?.(true)
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
        onResultRef.current(finalTranscript)
      }
      
      if (interimTranscript && onInterimResultRef.current) {
        onInterimResultRef.current(interimTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error)
      
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError("Microphone blocked. Please tap the 'Lock' icon in your browser address bar and choose 'Allow' for Microphone.")
      } else if (event.error === 'network') {
        setError("Internet issue. The speech service needs a connection to hear you correctly.")
      } else if (event.error === 'aborted') {
        // User or system aborted, not a real error
      } else if (event.error !== 'no-speech') {
        setError("I didn't quite catch that. Try again?")
      }
      
      setIsListening(false)
      onListeningChangeRef.current?.(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      onListeningChangeRef.current?.(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch (e) {}
      }
    }
  }, []) // Stable initialization

  const toggleListening = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (err) {
          console.error("Manual start failed:", err)
          setError("Click again to restart the microphone.")
        }
      }
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleListening}
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
        <div className="bg-error-container text-on-error-container p-4 rounded-2xl border-2 border-error/20 max-w-[280px] animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-bold flex items-start gap-2">
            <span className="material-symbols-outlined icon-sm">warning</span>
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
