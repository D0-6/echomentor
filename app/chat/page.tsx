"use client"

import * as React from "react"
import { VoiceInput } from "@/components/VoiceInput"
import { RichMessageRenderer } from "@/components/RichMessageRenderer"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/providers/AccessibilityProvider"
import { CHARACTERS } from "@/lib/characters"
import { speak, warmupSpeech } from "@/lib/speech"
import { SAFETY_AUDIT_PROMPT } from "@/lib/prompts"
import { getPersonalNimResponse, getPersonalNimVisionResponse } from "@/lib/ai-client"
import { processMessageIntents } from "@/lib/native-actions"

interface Message {
  id: string
  role: "user" | "assistant"
  type: "text" | "image" | "pdf"
  content: string
  metadata?: any
}

export default function MasterAssistantPage() {
  const { 
    voiceCharacterId, voiceSpeed, windowSize,
    userName, userAge, healthIssues, nvidiaApiKey 
  } = useAccessibility()

  const [messages, setMessages] = React.useState<Message[]>([])
  const [isListening, setIsListening] = React.useState(false)
  const [interimText, setInterimText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [inputText, setInputText] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Load history from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("echomentor_chat_history")
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load chat history", e)
      }
    } else {
      // Default greeting
      setMessages([
        { 
          id: "1", 
          role: "assistant", 
          type: "text", 
          content: "Hello! I am your EchoMentor Guide. I can help you with anything—just speak to me, or send me a photo or a document to look at." 
        }
      ])
    }
  }, [])

  // Save history to localStorage
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("echomentor_chat_history", JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, interimText, isTyping])

  const handleSendMessage = React.useCallback(async (text: string, type: "text" | "image" | "pdf" = "text", metadata?: any) => {
    if (!text && !metadata) return
    
    // DEPLOYMENT FIX: Unlock browser speech synthesis on this user gesture
    warmupSpeech()
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", type, content: text, metadata }
    setMessages(prev => [...prev, userMsg])
    setInputText("")
    setInterimText("")
    setIsTyping(true)

    try {
      const profile = {
        name: userName,
        age: userAge,
        healthIssues: healthIssues,
        apiKey: nvidiaApiKey
      }

      if (type === "image") {
        const analysis = await getPersonalNimVisionResponse(metadata.base64, SAFETY_AUDIT_PROMPT, profile) || "I'm sorry, I couldn't analyze that photo. Please try again.";
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", type: "text", content: analysis }
        setMessages(prev => [...prev, aiMsg])
        speak(analysis, voiceCharacterId, voiceSpeed)
      } else {
        const stream = await getPersonalNimResponse(
          messages.map(m => ({ role: m.role, content: m.content })).concat({ role: "user", content: text }),
          profile
        );

        let assistantMsgContent = ""
        const assistantId = (Date.now() + 1).toString()
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", type: "text", content: "" }])

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          assistantMsgContent += content;
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantMsgContent } : m))
        }

        speak(assistantMsgContent, voiceCharacterId, voiceSpeed)
        // Process any native intents (Calls, Open App, etc.)
        processMessageIntents(assistantMsgContent)
      }
    } catch (e: any) {
      console.error("AI Error:", e)
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "assistant", 
        type: "text", 
        content: e.message?.includes("API Key") 
          ? "I need a 'Brain' to think! Please go to Settings and enter your NVIDIA API Key." 
          : "I'm sorry, I'm having trouble connecting to my brain right now. Please try again." 
      }])
    } finally {
      setIsTyping(false)
    }
  }, [messages, voiceCharacterId, voiceSpeed, userName, userAge, healthIssues, nvidiaApiKey])

  const handleFileUpload = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (type === "image") {
        handleSendMessage("Analyzing this photo for you...", "image", { base64 })
      } else {
        handleSendMessage(`I've uploaded a document named ${file.name}. Can you help me understand it?`, "pdf", { name: file.name })
      }
    }
    reader.readAsDataURL(file)
  }, [handleSendMessage])

  return (
    <div className="flex flex-col h-dynamic-screen fluid-container overflow-hidden transition-all duration-500">
      
      {/* Editorial Header - Mathematically Scaling */}
      <div className="py-[clamp(0.5rem,2vw,1.5rem)] px-1 border-b border-outline-variant/10 flex items-center justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black text-on-surface leading-tight">Your <span className="text-primary">Assistant</span></h2>
          <p className="text-[clamp(0.7rem,1.5vw,0.85rem)] font-bold opacity-60 uppercase tracking-widest mt-1">Voice • Photo • Document</p>
        </div>
        <button 
          onClick={() => {
            if (confirm("Clear all messages?")) {
              setMessages([{ id: "1", role: "assistant", type: "text", content: "Chat cleared. How can I help you now?" }])
              localStorage.removeItem("echomentor_chat_history")
            }
          }}
          className="w-[clamp(2.5rem,5vw,3.5rem)] h-[clamp(2.5rem,5vw,3.5rem)] flex items-center justify-center text-on-surface-variant/40 hover:text-error transition-colors rounded-full hover:bg-error/5"
          title="Clear History"
        >
          <span className="material-symbols-outlined icon-md">delete_sweep</span>
        </button>
      </div>

      {/* Message Feed - Fluid Spacing */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto adaptive-p space-y-[clamp(1rem,3vw,2.5rem)] scroll-smooth scrollbar-thin scrollbar-thumb-outline-variant/20 shadow-inner"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex flex-col w-full max-w-[min(90%,800px)]",
              msg.role === "user" ? "ml-auto items-end" : "items-start"
            )}
          >
            <div 
              className={cn(
                "rounded-[clamp(1.5rem,4vw,2.5rem)] p-[clamp(1rem,2.5vw,1.75rem)] text-[clamp(1.1rem,2.2vw,1.35rem)] leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-primary text-on-primary rounded-tr-none" 
                  : "bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/10"
              )}
            >
              {msg.type === "pdf" && (
                <div className="flex items-center gap-3 mb-3 bg-on-primary/10 p-3 rounded-xl border border-on-primary/5">
                  <span className="material-symbols-outlined icon-sm">description</span>
                  <span className="text-[clamp(0.75rem,1.5vw,0.9rem)] font-bold uppercase tracking-tight">File: {msg.metadata?.name}</span>
                </div>
              )}
              {msg.role === "assistant" ? (
                <RichMessageRenderer content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 px-[clamp(0.5rem,2vw,1.5rem)]">
              <span className="text-[clamp(0.6rem,1.2vw,0.75rem)] font-black uppercase opacity-30">
                {msg.role === "user" ? "You" : "EchoMentor"}
              </span>
              {msg.role === "assistant" && (
                <button 
                  onClick={() => speak(msg.content, voiceCharacterId, voiceSpeed)}
                  className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center hover:bg-secondary/10 transition-colors"
                  title="Speak Message"
                >
                  <span className="material-symbols-outlined icon-sm text-secondary">volume_up</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Interim Transcription Bubble */}
        {interimText && (
          <div className="flex flex-col items-end ml-auto max-w-[85%] opacity-70 animate-pulse">
            <div className="bg-secondary-container text-primary rounded-[clamp(1.5rem,4vw,2.5rem)] p-[clamp(1rem,2.5vw,1.75rem)] text-[clamp(1.1rem,2.2vw,1.35rem)] rounded-tr-none font-medium italic">
              {interimText}...
            </div>
          </div>
        )}

        {isTyping && !interimText && (
          <div className="flex gap-2 p-4">
            <div className="w-[clamp(6px,1vw,10px)] h-[clamp(6px,1vw,10px)] bg-primary rounded-full animate-bounce" />
            <div className="w-[clamp(6px,1vw,10px)] h-[clamp(6px,1vw,10px)] bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-[clamp(6px,1vw,10px)] h-[clamp(6px,1vw,10px)] bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Unified Input Bar - Proportionally Scaling */}
      <div className="p-[clamp(0.75rem,2vw,1.5rem)] bg-surface-container-lowest border-t border-outline-variant/10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex adaptive-gap items-end">
          
          {/* File Actions Menu */}
          <div className="flex flex-col gap-[clamp(0.5rem,1vw,1rem)]">
            <button 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => handleFileUpload(e as any, "image")
                input.click()
              }}
              className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-surface-container-high rounded-[clamp(1rem,2vw,1.5rem)] flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm active:scale-90"
              aria-label="Upload Photo"
            >
              <span className="material-symbols-outlined icon-md">add_a_photo</span>
            </button>
            
            {/* NEW: Guide Me Button (Vision Assistant) */}
            <button 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => {
                  const file = (e.target as any).files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    handleSendMessage("Can you guide me on what to do next? Here is my screen.", "image", { base64: reader.result })
                  }
                  reader.readAsDataURL(file)
                }
                input.click()
              }}
              className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-secondary-container rounded-[clamp(1rem,2vw,1.5rem)] flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-secondary transition-all shadow-sm active:scale-90 border-2 border-secondary/20"
              aria-label="Guide Me"
              title="Help me with my screen"
            >
              <span className="material-symbols-outlined icon-md" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            </button>

             <button 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf'
                input.onchange = (e) => handleFileUpload(e as any, "pdf")
                input.click()
              }}
              className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-surface-container-high rounded-[clamp(1rem,2vw,1.5rem)] flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all shadow-sm active:scale-90"
              aria-label="Upload PDF"
            >
              <span className="material-symbols-outlined icon-md">description</span>
            </button>
          </div>

          {/* Text/Voice Compound Input */}
          <div className="flex-grow flex items-center bg-surface-container rounded-[clamp(1.5rem,4vw,3.5rem)] p-[clamp(0.5rem,1vw,0.75rem)] ring-1 ring-outline-variant/10 focus-within:ring-primary focus-within:ring-2 transition-all shadow-inner">
             <input 
               type="text" 
               placeholder="Write or speak..."
               className="flex-grow bg-transparent border-none focus:ring-0 text-[clamp(1rem,2vw,1.25rem)] px-4 placeholder:opacity-50"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
             />
             <VoiceInput 
               onResult={(text) => handleSendMessage(text)}
               onInterimResult={(text) => setInterimText(text)}
               onListeningChange={setIsListening}
               customTrigger={
                 <div className={cn(
                   "w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] rounded-full flex items-center justify-center transition-all shadow-md active:scale-95",
                   isListening ? "bg-error text-on-error animate-pulse" : "bg-primary text-on-primary"
                 )}>
                   <span className="material-symbols-outlined icon-md">
                     {isListening ? "mic_off" : "mic"}
                   </span>
                 </div>
               }
             />
          </div>

          <button 
            disabled={!inputText.trim()}
            onClick={() => handleSendMessage(inputText)}
            className="w-[clamp(3.5rem,7vw,4.5rem)] h-[clamp(3.5rem,7vw,4.5rem)] bg-primary text-on-primary rounded-[clamp(1rem,2vw,1.5rem)] flex items-center justify-center shadow-lg disabled:opacity-20 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined icon-md">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
